import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Page from '@/components/page'
import Section from '@/components/section'
import RecipeCard from '@/components/recipe-card'
import { useRecipes } from '@/hooks/useRecipes'

const SearchPage = () => {
	const router = useRouter()
	const { q } = router.query
	const { getFilteredRecipes, toggleFavorite, isFavorite } = useRecipes()
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [searchInput, setSearchInput] = useState('')

	// Initialize selectedTags from query on mount
	useEffect(() => {
		if (typeof q === 'string' && q) {
			setSelectedTags([q])
		}
	}, [q])

	const handleAddTag = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchInput.trim() && !selectedTags.includes(searchInput.trim())) {
			const newTags = [...selectedTags, searchInput.trim()]
			setSelectedTags(newTags)
			setSearchInput('')
			// Update URL with all tags
			const queryString = newTags.join(',')
			router.push(`/search?q=${encodeURIComponent(queryString)}`)
		}
	}

	const handleRemoveTag = (tagToRemove: string) => {
		const newTags = selectedTags.filter(tag => tag !== tagToRemove)
		setSelectedTags(newTags)
		if (newTags.length === 0) {
			router.push('/search')
		} else {
			const queryString = newTags.join(',')
			router.push(`/search?q=${encodeURIComponent(queryString)}`)
		}
	}

	// Get results for all selected tags
	const results = selectedTags.length > 0 
		? getFilteredRecipes(selectedTags.join(' '))
		: []

	return (
		<Page>
			<Section>
				{/* Header */}
				<div className='mb-8'>
					<Link href='/' className='text-orange-500 hover:text-orange-600 font-semibold mb-4 inline-block'>
						← Back to Home
					</Link>
					<h1 className='text-4xl font-bold text-zinc-900 dark:text-white mb-2'>
						Search Results
					</h1>
					<p className='text-lg text-zinc-600 dark:text-zinc-400'>
						{selectedTags.length > 0 ? `Showing results for: ${selectedTags.join(', ')}` : 'Add tags to search for recipes'}
					</p>
				</div>

				{/* Search Input with Tag Selection */}
				<form onSubmit={handleAddTag} className='mb-6'>
					<div className='relative'>
						<input
							type='text'
							placeholder='Add a tag (meal type, ingredient, cuisine, etc.)...'
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							className='w-full px-6 py-3 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 border-2 border-zinc-200 dark:border-zinc-600 hover:border-orange-300 focus:outline-none focus:border-orange-500 transition-colors'
						/>
						<button
							type='submit'
							className='absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors text-sm'
						>
							Add Tag
						</button>
					</div>
				</form>

				{/* Selected Tags with Remove Button */}
				{selectedTags.length > 0 && (
					<div className='mb-6 flex flex-wrap gap-2'>
						{selectedTags.map((tag) => (
							<div
								key={tag}
								className='flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100 rounded-full text-sm font-medium'
							>
								<span>{tag}</span>
								<button
									onClick={() => handleRemoveTag(tag)}
									className='ml-1 text-lg font-bold leading-none hover:text-orange-700 dark:hover:text-orange-300 transition-colors'
									title='Remove tag'
								>
									×
								</button>
							</div>
						))}
					</div>
				)}

				{/* Results Count */}
				<div className='mb-6 text-sm text-zinc-600 dark:text-zinc-400'>
					Found {results.length} recipe{results.length !== 1 ? 's' : ''}
				</div>

				{/* Results Grid */}
				{results.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{results.map((recipe) => (
							<RecipeCard
								key={recipe.slug}
								recipe={recipe}
								isFavorite={isFavorite(recipe.slug)}
								onToggleFavorite={toggleFavorite}
							/>
						))}
					</div>
				) : (
					<div className='text-center py-12'>
						<p className='text-zinc-600 dark:text-zinc-400 mb-6'>
							{selectedTags.length > 0
								? "No recipes found matching your tags. Try different tags!"
								: 'Add a tag to search for recipes'}
						</p>
						<Link
							href='/'
							className='inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors'
						>
							Back to Home
						</Link>
					</div>
				)}
			</Section>
		</Page>
	)
}

export default SearchPage
