import React from 'react'
import Image from 'next/image'

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAInstallModalProps {
	deferredPrompt: BeforeInstallPromptEvent | null
	onInstall: () => void
	onDismiss: () => void
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
	deferredPrompt,
	onInstall,
	onDismiss,
}) => {
	if (!deferredPrompt) return null

	const handleInstall = async () => {
		if (!deferredPrompt) return

		deferredPrompt.prompt()
		const { outcome } = await deferredPrompt.userChoice

		if (outcome === 'accepted') {
			onInstall()
		}
	}

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
			<div className='bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-bounce-in'>
				{/* Header */}
			<div className='bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 text-white'>
				<h2 className='text-2xl font-bold mb-2'>Install The Cook Book</h2>
				<p className='text-orange-50'>Get instant access to thousands of recipes</p>
			</div>				{/* Content */}
				<div className='px-6 py-6'>
					<div className='flex items-start gap-4 mb-6'>
						<div className='flex-shrink-0'>
							<Image
							src='/images/icon-192.png'
							alt='The Cook Book'
							width={64}
							height={64}
							className='rounded-lg shadow-md'
							/>
						</div>
						<div>
							<p className='text-sm text-slate-600 dark:text-slate-300'>
								Install the app to enjoy:
							</p>
							<ul className='mt-2 text-sm space-y-1 text-slate-700 dark:text-slate-200'>
								<li className='flex items-center gap-2'>
									<span className='text-blue-500'>✓</span> Offline access
								</li>
								<li className='flex items-center gap-2'>
									<span className='text-blue-500'>✓</span> Fast loading
								</li>
								<li className='flex items-center gap-2'>
									<span className='text-blue-500'>✓</span> Home screen icon
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className='px-6 py-4 bg-slate-50 dark:bg-slate-800 flex gap-3'>
					<button
						onClick={onDismiss}
						className='flex-1 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium'
					>
						Not now
					</button>
					<button
						onClick={handleInstall}
						className='flex-1 px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors font-medium shadow-lg hover:shadow-xl'
					>
						Install
					</button>
				</div>
			</div>
		</div>
	)
}
