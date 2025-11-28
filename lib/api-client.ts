/**
 * Advanced API Client with caching, retry logic, and error handling
 * Enterprise-grade HTTP client for all API communications
 */

import { ApiResponse, ApiError, PaginatedResponse } from './types'

interface CacheEntry<T> {
	data: T
	timestamp: number
	ttl: number
}

interface RequestConfig {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
	headers?: Record<string, string>
	body?: any
	cache?: {
		ttl: number // Time to live in milliseconds
		key?: string
	}
	retry?: {
		maxAttempts: number
		delayMs: number
	}
	timeout?: number
}

class ApiClient {
	private baseUrl: string
	private cache: Map<string, CacheEntry<any>> = new Map()
	private requestQueue: Map<string, Promise<any>> = new Map()
	private defaultTimeout = 30000 // 30 seconds
	private defaultRetry = { maxAttempts: 3, delayMs: 1000 }

	constructor(baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') {
		this.baseUrl = baseUrl
		// Clear cache every hour
		setInterval(() => this.clearExpiredCache(), 3600000)
	}

	/**
	 * Make an API request with automatic caching, retry logic, and error handling
	 */
	async request<T>(
		endpoint: string,
		config: RequestConfig = {}
	): Promise<T> {
		const {
			method = 'GET',
			cache = { ttl: 5 * 60 * 1000 }, // 5 minutes default
			retry = this.defaultRetry,
			timeout = this.defaultTimeout,
			headers = {},
		} = config

		const cacheKey = config.cache?.key || `${method}:${endpoint}`

		// Check cache for GET requests
		if (method === 'GET' && cache) {
			const cached = this.getFromCache<T>(cacheKey)
			if (cached) {
				return cached
			}
		}

		// Prevent duplicate requests
		if (this.requestQueue.has(cacheKey)) {
			return this.requestQueue.get(cacheKey)!
		}

		const requestPromise = this.executeRequest<T>(endpoint, config, retry, timeout, headers)

		// Only queue GET requests
		if (method === 'GET') {
			this.requestQueue.set(cacheKey, requestPromise)

			const result = await requestPromise
			this.requestQueue.delete(cacheKey)

			// Store in cache
			if (cache) {
				this.setInCache(cacheKey, result, cache.ttl)
			}

			return result
		}

		return requestPromise
	}

	/**
	 * Execute the actual HTTP request with retry logic
	 */
	private async executeRequest<T>(
		endpoint: string,
		config: RequestConfig,
		retry: { maxAttempts: number; delayMs: number },
		timeout: number,
		headers: Record<string, string>
	): Promise<T> {
		let lastError: Error | null = null

		for (let attempt = 0; attempt < retry.maxAttempts; attempt++) {
			try {
				return await this.performFetch<T>(endpoint, config, timeout, headers)
			} catch (error) {
				lastError = error as Error

				// Don't retry on client errors (4xx)
				if (error instanceof ApiClientError && error.statusCode >= 400 && error.statusCode < 500) {
					throw error
				}

				// Wait before retrying
				if (attempt < retry.maxAttempts - 1) {
					await this.sleep(retry.delayMs * Math.pow(2, attempt)) // Exponential backoff
				}
			}
		}

		throw lastError || new Error('Max retries exceeded')
	}

	/**
	 * Perform actual fetch request
	 */
	private async performFetch<T>(
		endpoint: string,
		config: RequestConfig,
		timeout: number,
		headers: Record<string, string>
	): Promise<T> {
		const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`

		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), timeout)

		try {
			const response = await fetch(url, {
				method: config.method || 'GET',
				headers: {
					'Content-Type': 'application/json',
					...headers,
				},
				body: config.body ? JSON.stringify(config.body) : undefined,
				signal: controller.signal,
			})

			clearTimeout(timeoutId)

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				throw new ApiClientError(
					errorData.message || `HTTP ${response.status}`,
					response.status,
					errorData
				)
			}

			const data = await response.json()
			return data as T
		} catch (error) {
			clearTimeout(timeoutId)

			if (error instanceof ApiClientError) {
				throw error
			}

			if (error instanceof Error) {
				if (error.name === 'AbortError') {
					throw new ApiClientError('Request timeout', 408)
				}
				throw new ApiClientError(error.message, 500)
			}

			throw error
		}
	}

	/**
	 * Cache management methods
	 */
	private getFromCache<T>(key: string): T | null {
		const entry = this.cache.get(key)
		if (!entry) return null

		const isExpired = Date.now() - entry.timestamp > entry.ttl
		if (isExpired) {
			this.cache.delete(key)
			return null
		}

		return entry.data as T
	}

	private setInCache<T>(key: string, data: T, ttl: number): void {
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
			ttl,
		})
	}

	private clearExpiredCache(): void {
		const now = Date.now()
		for (const [key, entry] of this.cache.entries()) {
			if (now - entry.timestamp > entry.ttl) {
				this.cache.delete(key)
			}
		}
	}

	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	/**
	 * Convenience methods for common operations
	 */
	get<T>(endpoint: string, config?: Omit<RequestConfig, 'method'>): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: 'GET' })
	}

	post<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: 'POST', body })
	}

	put<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: 'PUT', body })
	}

	delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method'>): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: 'DELETE' })
	}

	clearCache(key?: string): void {
		if (key) {
			this.cache.delete(key)
		} else {
			this.cache.clear()
		}
	}
}

/**
 * Custom error class for API errors
 */
class ApiClientError extends Error {
	constructor(
		message: string,
		public statusCode: number,
		public details?: Record<string, any>
	) {
		super(message)
		this.name = 'ApiClientError'
	}
}

// Export singleton instance
export const apiClient = new ApiClient()
export { ApiClientError }
