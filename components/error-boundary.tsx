/**
 * Advanced Error Boundary
 * Catches React errors and provides graceful fallback UI
 */

import React from 'react'
import { logger } from '@/lib/logger-analytics'

interface ErrorBoundaryProps {
	children: React.ReactNode
	fallback?: React.ReactNode
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
	hasError: boolean
	error: Error | null
	errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		}
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		this.setState({ errorInfo })

		// Log to service
		logger.error('app', 'React Error Boundary caught error', {
			error: error.toString(),
			componentStack: errorInfo.componentStack,
		})

		this.props.onError?.(error, errorInfo)
	}

	render(): React.ReactNode {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback
			}

			return (
				<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800 p-4'>
					<div className='max-w-md w-full'>
						<div className='text-center mb-8'>
							<div className='text-6xl mb-4'>⚠️</div>
							<h1 className='text-3xl font-bold text-white mb-2'>Oops! Something went wrong</h1>
							<p className='text-zinc-400'>We apologize for the inconvenience. Our team has been notified.</p>
						</div>

						<div className='bg-zinc-800 rounded-lg p-4 mb-6 max-h-48 overflow-y-auto'>
							<p className='text-sm font-mono text-red-400 break-words'>
								{this.state.error?.toString()}
							</p>
							{process.env.NODE_ENV === 'development' && this.state.errorInfo && (
								<pre className='text-xs text-zinc-400 mt-4 whitespace-pre-wrap'>
									{this.state.errorInfo.componentStack}
								</pre>
							)}
						</div>

						<div className='space-y-3'>
							<button
								onClick={() => window.location.reload()}
								className='w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors'
							>
								Reload Page
							</button>
							<button
								onClick={() => window.history.back()}
								className='w-full px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-lg transition-colors'
							>
								Go Back
							</button>
						</div>

						<p className='text-center text-xs text-zinc-500 mt-6'>
							Error ID: {Date.now()}
						</p>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}
