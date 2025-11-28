'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Page from '@/components/page'
import Section from '@/components/section'
import { useAdmin } from '@/contexts/AdminContext'

export const LoginContent = () => {
	const router = useRouter()
	const { isLoggedIn, login } = useAdmin()
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		// Redirect if already logged in
		if (isLoggedIn) {
			router.push('/dashboard')
		}
	}, [isLoggedIn, router])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		// Small delay to simulate authentication
		await new Promise((resolve) => setTimeout(resolve, 500))

		const success = login(password)

		if (success) {
			setPassword('')
			router.push('/dashboard')
		} else {
			setError('Invalid password. Please try again.')
			setPassword('')
		}

		setLoading(false)
	}

	return (
		<Page>
			<Section>
				<div className='max-w-md mx-auto'>
					{/* Header */}
					<div className='text-center mb-8'>
						<h1 className='text-3xl font-bold text-zinc-900 dark:text-white mb-2'>
							Admin Login
						</h1>
						<p className='text-zinc-600 dark:text-zinc-400'>
							Enter your admin password to manage recipes
						</p>
					</div>

					{/* Login Form */}
					<form onSubmit={handleSubmit} className='space-y-4'>
						{/* Password Input */}
						<div>
							<label htmlFor='password' className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
								Admin Password
							</label>
							<input
								id='password'
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder='Enter admin password'
								className='w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
								disabled={loading}
								autoFocus
							/>
						</div>

						{/* Error Message */}
						{error && (
							<div className='p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg text-sm'>
								{error}
							</div>
						)}

						{/* Submit Button */}
						<button
							type='submit'
							disabled={loading || !password.trim()}
							className='w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors'
						>
							{loading ? 'Authenticating...' : 'Login'}
						</button>
					</form>

					{/* Back to Home */}
					<div className='mt-6 text-center'>
						<Link href='/' className='text-orange-500 hover:text-orange-600 font-semibold'>
							← Back to Home
						</Link>
					</div>
				</div>
			</Section>
		</Page>
	)
}
