/**
 * Performance Optimization Utilities
 * Web Vitals monitoring, code splitting hints, and performance enhancements
 */

import { useCallback, useRef, useEffect } from 'react'

/**
 * Custom hook to measure component render performance
 */
export function usePerformanceMonitor(componentName: string) {
	const renderTime = useRef<number>(0)

	useEffect(() => {
		renderTime.current = performance.now()

		return () => {
			const endTime = performance.now()
			const duration = endTime - renderTime.current

			if (duration > 16) {
				// More than one frame (60fps)
				console.warn(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms`)
			}
		}
	}, [componentName])
}

/**
 * Debounced callback hook
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number
): (...args: Parameters<T>) => void {
	const timeoutRef = useRef<NodeJS.Timeout>()

	return useCallback(
		(...args: Parameters<T>) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}

			timeoutRef.current = setTimeout(() => {
				callback(...args)
			}, delay)
		},
		[callback, delay]
	)
}

/**
 * Throttled callback hook
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number
): (...args: Parameters<T>) => void {
	const lastCallRef = useRef<number>(0)
	const timeoutRef = useRef<NodeJS.Timeout>()

	return useCallback(
		(...args: Parameters<T>) => {
			const now = Date.now()
			const timeSinceLastCall = now - lastCallRef.current

			if (timeSinceLastCall >= delay) {
				lastCallRef.current = now
				callback(...args)
			} else {
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current)
				}

				timeoutRef.current = setTimeout(() => {
					lastCallRef.current = Date.now()
					callback(...args)
				}, delay - timeSinceLastCall)
			}
		},
		[callback, delay]
	)
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersection(
	element: React.RefObject<HTMLElement>,
	options?: IntersectionObserverInit
) {
	const [isVisible, setIsVisible] = React.useState(false)

	React.useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setIsVisible(true)
				observer.unobserve(entry.target)
			}
		}, options)

		if (element.current) {
			observer.observe(element.current)
		}

		return () => observer.disconnect()
	}, [element, options])

	return isVisible
}

/**
 * Web Vitals monitoring
 */
export interface WebVitals {
	CLS: number // Cumulative Layout Shift
	FID: number // First Input Delay
	LCP: number // Largest Contentful Paint
	FCP: number // First Contentful Paint
	TTFB: number // Time to First Byte
}

export function reportWebVitals(callback: (vitals: Partial<WebVitals>) => void) {
	if (typeof window === 'undefined') return

	try {
		// Use Web Vitals if available
		import('web-vitals').then(({ getCLS, getFID, getLCP, getFCP }) => {
			getCLS(callback)
			getFID(callback)
			getLCP(callback)
			getFCP(callback)
		})
	} catch {
		// Fallback: report basic metrics
		if ('PerformanceObserver' in window) {
			const observer = new PerformanceObserver((list) => {
				const entries = list.getEntries()
				entries.forEach((entry) => {
					callback({ [entry.name]: entry.duration } as Partial<WebVitals>)
				})
			})

			try {
				observer.observe({ entryTypes: ['measure', 'navigation'] })
			} catch {
				// Browser doesn't support this entry type
			}
		}
	}
}

/**
 * Memory leak detector (development only)
 */
export function useMemoryMonitor() {
	useEffect(() => {
		if (process.env.NODE_ENV !== 'development' || !('memory' in performance)) return

		const checkMemory = () => {
			const memory = (performance as any).memory

			if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
				console.warn('[Memory] Heap size approaching limit:', {
					used: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
					limit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
				})
			}
		}

		const interval = setInterval(checkMemory, 5000)
		return () => clearInterval(interval)
	}, [])
}

/**
 * Image optimization utility
 */
export function getOptimizedImageUrl(url: string, width: number, quality: number = 75): string {
	if (!url || url.includes('data:')) return url

	// Handle Unsplash URLs
	if (url.includes('unsplash.com')) {
		const params = new URLSearchParams()
		params.set('w', width.toString())
		params.set('q', quality.toString())
		params.set('fm', 'webp')
		params.set('fit', 'max')

		return `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`
	}

	return url
}

/**
 * Cache busting utility
 */
export function getCacheBustingUrl(url: string, cacheVersion?: string): string {
	const timestamp = cacheVersion || new Date().getTime().toString()
	const separator = url.includes('?') ? '&' : '?'
	return `${url}${separator}v=${timestamp}`
}

/**
 * Request deduplication utility
 */
export class RequestDeduplicator {
	private pendingRequests = new Map<string, Promise<any>>()

	async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
		if (this.pendingRequests.has(key)) {
			return this.pendingRequests.get(key)!
		}

		const promise = requestFn()
			.then((result) => {
				this.pendingRequests.delete(key)
				return result
			})
			.catch((error) => {
				this.pendingRequests.delete(key)
				throw error
			})

		this.pendingRequests.set(key, promise)
		return promise
	}

	clear() {
		this.pendingRequests.clear()
	}
}

/**
 * Batch operations utility for optimal rendering
 */
export class BatchScheduler {
	private batch: Set<() => void> = new Set()
	private scheduled = false

	add(fn: () => void) {
		this.batch.add(fn)
		this.schedule()
	}

	private schedule() {
		if (this.scheduled) return

		this.scheduled = true
		requestAnimationFrame(() => {
			const fns = Array.from(this.batch)
			this.batch.clear()
			this.scheduled = false

			fns.forEach((fn) => fn())
		})
	}
}
