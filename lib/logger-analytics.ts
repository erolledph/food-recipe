/**
 * Advanced Logger & Analytics Service
 * Production-grade logging and event tracking for debugging and insights
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type LogCategory = 'app' | 'auth' | 'recipe' | 'user' | 'api' | 'performance'

interface LogEntry {
	timestamp: number
	level: LogLevel
	category: LogCategory
	message: string
	data?: Record<string, any>
	stack?: string
	userId?: string
	sessionId?: string
}

interface AnalyticsEvent {
	name: string
	category: string
	timestamp: number
	properties: Record<string, any>
	sessionId: string
	userId?: string
	duration?: number
}

class Logger {
	private logs: LogEntry[] = []
	private maxLogs = 1000
	private isDevelopment = process.env.NODE_ENV === 'development'
	private sessionId = this.generateSessionId()

	constructor() {
		// Handle uncaught errors
		if (typeof window !== 'undefined') {
			window.addEventListener('error', (event) => {
				this.error('app', 'Uncaught error', {
					message: event.message,
					filename: event.filename,
					lineno: event.lineno,
					colno: event.colno,
				})
			})

			window.addEventListener('unhandledrejection', (event) => {
				this.error('app', 'Unhandled promise rejection', {
					reason: event.reason,
				})
			})
		}
	}

	private generateSessionId(): string {
		return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
	}

	private formatLog(entry: LogEntry): string {
		const time = new Date(entry.timestamp).toISOString()
		const level = entry.level.toUpperCase().padEnd(5)
		return `[${time}] ${level} [${entry.category}] ${entry.message}`
	}

	private log(level: LogLevel, category: LogCategory, message: string, data?: Record<string, any>): void {
		const entry: LogEntry = {
			timestamp: Date.now(),
			level,
			category,
			message,
			data,
			sessionId: this.sessionId,
		}

		// Store in memory
		this.logs.push(entry)
		if (this.logs.length > this.maxLogs) {
			this.logs = this.logs.slice(-this.maxLogs)
		}

		// Console output in development
		if (this.isDevelopment) {
			const logFn = console[level as keyof Console] || console.log
			console.group(this.formatLog(entry))
			if (data) console.table(data)
			console.groupEnd()
		}

		// Send to server in production
		if (!this.isDevelopment && level === 'error') {
			this.sendToServer(entry)
		}
	}

	private async sendToServer(entry: LogEntry): Promise<void> {
		try {
			await fetch('/api/logs', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(entry),
			}).catch(() => {
				// Silently fail - don't create infinite loops
			})
		} catch {
			// Silent fail
		}
	}

	debug(category: LogCategory, message: string, data?: Record<string, any>): void {
		this.log('debug', category, message, data)
	}

	info(category: LogCategory, message: string, data?: Record<string, any>): void {
		this.log('info', category, message, data)
	}

	warn(category: LogCategory, message: string, data?: Record<string, any>): void {
		this.log('warn', category, message, data)
	}

	error(category: LogCategory, message: string, data?: Record<string, any>): void {
		this.log('error', category, message, data)
	}

	getLogs(filter?: { level?: LogLevel; category?: LogCategory; hours?: number }): LogEntry[] {
		let filtered = [...this.logs]

		if (filter?.level) {
			filtered = filtered.filter((l) => l.level === filter.level)
		}

		if (filter?.category) {
			filtered = filtered.filter((l) => l.category === filter.category)
		}

		if (filter?.hours) {
			const cutoff = Date.now() - filter.hours * 3600000
			filtered = filtered.filter((l) => l.timestamp > cutoff)
		}

		return filtered
	}

	clearLogs(): void {
		this.logs = []
	}

	exportLogs(format: 'json' | 'csv' = 'json'): string {
		if (format === 'json') {
			return JSON.stringify(this.logs, null, 2)
		}

		// CSV format
		const headers = ['Timestamp', 'Level', 'Category', 'Message', 'Data']
		const rows = this.logs.map((log) => [
			new Date(log.timestamp).toISOString(),
			log.level,
			log.category,
			log.message,
			JSON.stringify(log.data || {}),
		])

		const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')

		return csv
	}
}

class Analytics {
	private events: AnalyticsEvent[] = []
	private sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
	private isDevelopment = process.env.NODE_ENV === 'development'
	private eventQueue: AnalyticsEvent[] = []
	private batchTimer?: NodeJS.Timeout

	constructor(private logger: Logger) {}

	track(eventName: string, category: string = 'general', properties: Record<string, any> = {}): void {
		const event: AnalyticsEvent = {
			name: eventName,
			category,
			timestamp: Date.now(),
			properties,
			sessionId: this.sessionId,
		}

		this.events.push(event)
		this.eventQueue.push(event)

		if (this.isDevelopment) {
			this.logger.debug('app', `Analytics: ${eventName}`, properties)
		}

		this.scheduleBatch()
	}

	trackTiming(eventName: string, startTime: number, category: string = 'performance'): void {
		const duration = Date.now() - startTime

		this.track(`${eventName}_completed`, category, {
			duration,
			slow: duration > 3000,
		})

		if (duration > 3000) {
			this.logger.warn('performance', `Slow operation: ${eventName}`, { duration })
		}
	}

	trackPageView(pageName: string): void {
		this.track('page_view', 'navigation', {
			page: pageName,
			referrer: typeof document !== 'undefined' ? document.referrer : undefined,
		})
	}

	trackRecipeView(recipeSlug: string, difficulty?: string): void {
		this.track('recipe_viewed', 'recipe', {
			slug: recipeSlug,
			difficulty,
		})
	}

	trackSearch(query: string, resultsCount: number): void {
		this.track('search', 'recipe', {
			query,
			results: resultsCount,
		})
	}

	trackFavorite(action: 'added' | 'removed', recipeSlug: string): void {
		this.track(`favorite_${action}`, 'user', {
			slug: recipeSlug,
		})
	}

	private scheduleBatch(): void {
		if (this.batchTimer) return

		this.batchTimer = setTimeout(() => {
			this.sendBatch()
			this.batchTimer = undefined
		}, 5000) // Send every 5 seconds
	}

	private async sendBatch(): Promise<void> {
		if (this.eventQueue.length === 0) return

		const batch = [...this.eventQueue]
		this.eventQueue = []

		try {
			await fetch('/api/analytics', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ events: batch }),
			}).catch(() => {
				// Restore to queue on failure
				this.eventQueue.unshift(...batch)
			})
		} catch {
			// Restore to queue on error
			this.eventQueue.unshift(...batch)
		}
	}

	getEvents(filter?: { name?: string; category?: string; hours?: number }): AnalyticsEvent[] {
		let filtered = [...this.events]

		if (filter?.name) {
			filtered = filtered.filter((e) => e.name === filter.name)
		}

		if (filter?.category) {
			filtered = filtered.filter((e) => e.category === filter.category)
		}

		if (filter?.hours) {
			const cutoff = Date.now() - filter.hours * 3600000
			filtered = filtered.filter((e) => e.timestamp > cutoff)
		}

		return filtered
	}

	getSessionStats() {
		const pageViews = this.events.filter((e) => e.name === 'page_view').length
		const searches = this.events.filter((e) => e.name === 'search').length
		const recipes = this.events.filter((e) => e.name === 'recipe_viewed').length

		return {
			sessionId: this.sessionId,
			totalEvents: this.events.length,
			pageViews,
			searches,
			recipesViewed: recipes,
			duration: (Date.now() - parseInt(this.sessionId.split('-')[0])) / 1000, // in seconds
		}
	}

	clearEvents(): void {
		this.events = []
		this.eventQueue = []
	}
}

// Singleton instances
const logger = new Logger()
const analytics = new Analytics(logger)

export { logger, analytics }
