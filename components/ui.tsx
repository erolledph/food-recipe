/**
 * Premium UI Component Library
 * Reusable, accessible, and animated components for enterprise applications
 */

import React, { ReactNode, forwardRef } from 'react'

// ============= LOADING STATES =============

interface SkeletonProps {
	className?: string
	width?: string | number
	height?: string | number
	count?: number
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, width = '100%', height = '1rem', count = 1 }) => (
	<>
		{Array.from({ length: count }).map((_, i) => (
			<div
				key={i}
				className={`animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700 ${className}`}
				style={{ width, height }}
			/>
		))}
	</>
)

// ============= BUTTONS =============

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant
	size?: ButtonSize
	loading?: boolean
	icon?: ReactNode
	children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
	primary: 'bg-orange-500 hover:bg-orange-600 text-white',
	secondary: 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white',
	danger: 'bg-red-500 hover:bg-red-600 text-white',
	ghost: 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white',
}

const sizeClasses: Record<ButtonSize, string> = {
	sm: 'px-3 py-1 text-sm',
	md: 'px-4 py-2',
	lg: 'px-6 py-3 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant = 'primary', size = 'md', loading = false, icon, children, className, disabled, ...props }, ref) => {
		return (
			<button
				ref={ref}
				disabled={loading || disabled}
				className={`
					inline-flex items-center gap-2 rounded-lg font-semibold transition-all duration-200
					disabled:opacity-50 disabled:cursor-not-allowed
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
					${variantClasses[variant]}
					${sizeClasses[size]}
					${className}
				`}
				{...props}
			>
				{loading && <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />}
				{!loading && icon && <span>{icon}</span>}
				{children}
			</button>
		)
	}
)

Button.displayName = 'Button'

// ============= CARDS =============

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode
	hoverable?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
	({ children, hoverable = false, className, ...props }, ref) => (
		<div
			ref={ref}
			className={`
				rounded-lg bg-white dark:bg-zinc-800 shadow-md
				${hoverable ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1' : ''}
				${className}
			`}
			{...props}
		>
			{children}
		</div>
	)
)

Card.displayName = 'Card'

// ============= BADGES =============

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: BadgeVariant
	children: ReactNode
}

const badgeVariants: Record<BadgeVariant, string> = {
	default: 'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200',
	success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
	warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
	danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
	info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	({ variant = 'default', children, className, ...props }, ref) => (
		<span
			ref={ref}
			className={`
				inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold
				${badgeVariants[variant]}
				${className}
			`}
			{...props}
		>
			{children}
		</span>
	)
)

Badge.displayName = 'Badge'

// ============= ALERTS =============

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: BadgeVariant
	title?: string
	children: ReactNode
	closable?: boolean
	onClose?: () => void
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
	({ variant = 'info', title, children, closable = false, onClose, className, ...props }, ref) => {
		const bgColors: Record<BadgeVariant, string> = {
			default: 'bg-zinc-100 border-zinc-300 text-zinc-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200',
			success: 'bg-green-50 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-100',
			warning: 'bg-yellow-50 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-100',
			danger: 'bg-red-50 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-100',
			info: 'bg-blue-50 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-100',
		}

		return (
			<div
				ref={ref}
				className={`
					rounded-lg border px-4 py-3 animate-in fade-in slide-in-from-top-2
					${bgColors[variant]}
					${className}
				`}
				{...props}
			>
				<div className='flex items-start justify-between'>
					<div>
						{title && <h3 className='font-semibold'>{title}</h3>}
						<p className='text-sm'>{children}</p>
					</div>
					{closable && (
						<button
							onClick={onClose}
							className='ml-4 text-xl font-bold leading-none hover:opacity-70'
							aria-label='Close alert'
						>
							×
						</button>
					)}
				</div>
			</div>
		)
	}
)

Alert.displayName = 'Alert'

// ============= INPUT =============

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
	helpText?: string
	icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, helpText, icon, className, ...props }, ref) => (
		<div className='w-full'>
			{label && (
				<label className='block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1'>
					{label}
					{props.required && <span className='text-red-500'>*</span>}
				</label>
			)}
			<div className='relative'>
				{icon && <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>{icon}</div>}
				<input
					ref={ref}
					className={`
						w-full rounded-lg border px-4 py-2 bg-white dark:bg-zinc-700
						text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400
						border-zinc-300 dark:border-zinc-600
						focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200
						disabled:opacity-50 disabled:cursor-not-allowed
						transition-colors
						${icon ? 'pl-10' : ''}
						${error ? 'border-red-500 focus:ring-red-200' : ''}
						${className}
					`}
					{...props}
				/>
			</div>
			{error && <p className='mt-1 text-xs text-red-500'>{error}</p>}
			{helpText && !error && <p className='mt-1 text-xs text-zinc-500 dark:text-zinc-400'>{helpText}</p>}
		</div>
	)
)

Input.displayName = 'Input'

// ============= MODAL =============

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	title?: string
	children: ReactNode
	footer?: ReactNode
	size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
			onClick={onClose}
			role='presentation'
		>
			<div
				className={`
					rounded-lg bg-white dark:bg-zinc-800 shadow-xl
					animate-in fade-in zoom-in-95
					${sizeStyles[size]}
					w-full mx-4
				`}
				onClick={(e) => e.stopPropagation()}
			>
				{title && (
					<div className='flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 px-6 py-4'>
						<h2 className='text-xl font-bold text-zinc-900 dark:text-white'>{title}</h2>
						<button
							onClick={onClose}
							className='text-2xl font-bold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
							aria-label='Close modal'
						>
							×
						</button>
					</div>
				)}
				<div className='px-6 py-4'>{children}</div>
				{footer && <div className='border-t border-zinc-200 dark:border-zinc-700 px-6 py-4 flex gap-3 justify-end'>{footer}</div>}
			</div>
		</div>
	)
}

// ============= TOAST =============

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
	message: string
	type?: ToastType
	duration?: number
	onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
	React.useEffect(() => {
		const timer = setTimeout(onClose, duration)
		return () => clearTimeout(timer)
	}, [duration, onClose])

	const bgColors: Record<ToastType, string> = {
		success: 'bg-green-500',
		error: 'bg-red-500',
		warning: 'bg-yellow-500',
		info: 'bg-blue-500',
	}

	return (
		<div
			className={`
				fixed bottom-4 right-4 px-4 py-3 rounded-lg text-white font-medium shadow-lg
				animate-in fade-in slide-in-from-bottom-4
				${bgColors[type]}
			`}
			role='alert'
		>
			{message}
		</div>
	)
}
