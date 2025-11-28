import React, { createContext, useContext, useState, useEffect } from 'react'

interface AdminContextType {
	isLoggedIn: boolean
	login: (password: string) => boolean
	logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [mounted, setMounted] = useState(false)

	// Check if admin is logged in on mount
	useEffect(() => {
		const storedAuth = localStorage.getItem('admin_logged_in')
		if (storedAuth === 'true') {
			setIsLoggedIn(true)
		}
		setMounted(true)
	}, [])

	const login = (password: string): boolean => {
		if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
			setIsLoggedIn(true)
			localStorage.setItem('admin_logged_in', 'true')
			return true
		}
		return false
	}

	const logout = () => {
		setIsLoggedIn(false)
		localStorage.removeItem('admin_logged_in')
	}

	if (!mounted) {
		return <>{children}</>
	}

	return (
		<AdminContext.Provider value={{ isLoggedIn, login, logout }}>
			{children}
		</AdminContext.Provider>
	)
}

export const useAdmin = () => {
	const context = useContext(AdminContext)
	if (context === undefined) {
		throw new Error('useAdmin must be used within AdminProvider')
	}
	return context
}
