import Link from 'next/link'
import Page from '@/components/page'
import Hero from '@/components/hero'
import Section from '@/components/section'

const Index = () => (
	<Page>
		<Hero />
		<Section>
			<h2 className='text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4'>
				Featured Recipes
			</h2>
			<p className='text-zinc-600 dark:text-zinc-400'>
				Browse our collection of delicious recipes, from quick weeknight dinners to impressive dishes for entertaining. Each recipe includes detailed instructions and ingredient lists to help you create amazing meals.
			</p>
			<div className='mt-6 text-center'>
				<Link
					href='/recipes'
					className='inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors'
				>
					View All Recipes
				</Link>
			</div>
		</Section>
	</Page>
)

export default Index
