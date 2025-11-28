import { useState } from 'react'
import { useRouter } from 'next/router'
import { useRecipes } from '@/hooks/useRecipes'

interface HeroProps {
	onSearch?: (query: string) => void
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
	const [searchQuery, setSearchQuery] = useState('')
	const router = useRouter()
	const { getAllTags } = useRecipes()
	const tags = getAllTags()

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			if (onSearch) {
				onSearch(searchQuery)
			} else {
				router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
			}
		}
	}

	const handleTagClick = (tag: string) => {
		const tags = searchQuery
			.split(',')
			.map(t => t.trim())
			.filter(t => t !== '')
		
		if (!tags.includes(tag)) {
			tags.push(tag)
			setSearchQuery(tags.join(', '))
		}
	}

	return (
		<div className='relative bg-gradient-to-b from-orange-50 to-transparent dark:from-zinc-800 dark:to-transparent py-12 px-6'>
			<div className='mx-auto max-w-screen-md'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-3'>
						Welcome to The Cook Book
					</h1>
					<p className='text-lg text-zinc-600 dark:text-zinc-300 mb-8'>
						Discover delicious recipes for every occasion
					</p>
				</div>

				<form onSubmit={handleSearch} className='mb-10'>
					<div className='relative'>
						<input
							type='text'
							placeholder='Search for recipes (e.g., pasta, chicken, desserts)...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='w-full px-6 py-4 rounded-full bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 border-2 border-transparent hover:border-orange-300 focus:outline-none focus:border-orange-500 transition-colors shadow-lg'
						/>
						<button
							type='submit'
							className='absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors'
						>
							Search
						</button>
					</div>
				</form>

				{/* Category Tags */}
				<div className='space-y-4'>
					{/* Meals */}
					<div>
						<h3 className='text-xs font-semibold uppercase text-zinc-700 dark:text-zinc-400 mb-2'>
							Meal Type
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.meals.slice(0, 4).map((meal) => (
								<button
									key={meal}
									onClick={() => handleTagClick(meal)}
									className='px-3 py-1 rounded-full text-xs bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors border border-zinc-200 dark:border-zinc-600'
								>
									{meal}
								</button>
							))}
						</div>
					</div>

					{/* Popular Ingredients */}
					<div>
						<h3 className='text-xs font-semibold uppercase text-zinc-700 dark:text-zinc-400 mb-2'>
							Popular Ingredients
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.ingredients.slice(0, 5).map((ingredient) => (
								<button
									key={ingredient}
									onClick={() => handleTagClick(ingredient)}
									className='px-3 py-1 rounded-full text-xs bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors border border-zinc-200 dark:border-zinc-600'
								>
									{ingredient}
								</button>
							))}
						</div>
					</div>

					{/* Protein */}
					<div>
						<h3 className='text-xs font-semibold uppercase text-zinc-700 dark:text-zinc-400 mb-2'>
							Protein
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.meats.map((meat) => (
								<button
									key={meat}
									onClick={() => handleTagClick(meat)}
									className='px-3 py-1 rounded-full text-xs bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors border border-zinc-200 dark:border-zinc-600'
								>
									{meat}
								</button>
							))}
						</div>
					</div>

					{/* Taste */}
					<div>
						<h3 className='text-xs font-semibold uppercase text-zinc-700 dark:text-zinc-400 mb-2'>
							Taste
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.tastes.map((taste) => (
								<button
									key={taste}
									onClick={() => handleTagClick(taste)}
									className='px-3 py-1 rounded-full text-xs bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors border border-zinc-200 dark:border-zinc-600'
								>
									{taste}
								</button>
							))}
						</div>
					</div>

					{/* Countries */}
					<div>
						<h3 className='text-xs font-semibold uppercase text-zinc-700 dark:text-zinc-400 mb-2'>
							Country
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.countries.map((country) => (
								<button
									key={country}
									onClick={() => handleTagClick(country)}
									className='px-3 py-1 rounded-full text-xs bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors border border-zinc-200 dark:border-zinc-600'
								>
									{country}
								</button>
							))}
						</div>
					</div>
				</div>

				<div className='grid grid-cols-3 gap-4 text-center text-sm mt-8'>
					<div>
						<div className='text-2xl font-bold text-orange-500 mb-1'>10+</div>
						<div className='text-zinc-600 dark:text-zinc-400'>Recipes</div>
					</div>
					<div>
						<div className='text-2xl font-bold text-orange-500 mb-1'>Easy</div>
						<div className='text-zinc-600 dark:text-zinc-400'>To Follow</div>
					</div>
					<div>
						<div className='text-2xl font-bold text-orange-500 mb-1'>Quick</div>
						<div className='text-zinc-600 dark:text-zinc-400'>Cooking Time</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Hero
