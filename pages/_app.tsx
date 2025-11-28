import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { ThemeProvider } from 'next-themes'
import { AdminProvider } from '@/contexts/AdminContext'
import { PWAInstallModal } from '@/components/pwa-install-modal'
import '@/styles/globals.css'

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function App({ Component, pageProps }: AppProps) {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
	const [showModal, setShowModal] = useState(false)

	useEffect(() => {
		const handleBeforeInstallPrompt = (e: Event) => {
			// Prevent the mini-infobar from appearing
			e.preventDefault()
			// Store the event for later use
			setDeferredPrompt(e as BeforeInstallPromptEvent)
			// Show modal after 4 seconds
			setTimeout(() => {
				setShowModal(true)
			}, 4000)
		}

		const handleAppInstalled = () => {
			// App was installed, clear the stored prompt
			setDeferredPrompt(null)
			setShowModal(false)
		}

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
		window.addEventListener('appinstalled', handleAppInstalled)

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
			window.removeEventListener('appinstalled', handleAppInstalled)
		}
	}, [])

	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='system'
			disableTransitionOnChange
		>
			<AdminProvider>
				<PWAInstallModal
					deferredPrompt={showModal ? deferredPrompt : null}
					onInstall={() => {
						setDeferredPrompt(null)
						setShowModal(false)
					}}
					onDismiss={() => setShowModal(false)}
				/>
				<Component {...pageProps} />
			</AdminProvider>
		</ThemeProvider>
	)
}
