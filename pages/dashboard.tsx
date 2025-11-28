'use client'

import dynamic from 'next/dynamic'

const DashboardContent = dynamic(() => import('@/components/dashboard-content').then(mod => ({ default: mod.DashboardContent })), {
ssr: false,
})

const DashboardPageWrapper = () => {
return <DashboardContent />
}

export default DashboardPageWrapper
