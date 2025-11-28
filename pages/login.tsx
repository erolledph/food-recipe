'use client'

import dynamic from 'next/dynamic'

const LoginContent = dynamic(() => import('@/components/login-content').then(mod => ({ default: mod.LoginContent })), {
	ssr: false,
})

const LoginPageWrapper = () => {
	return <LoginContent />
}

export default LoginPageWrapper
