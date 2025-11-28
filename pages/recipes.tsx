import { useState, useMemo } from 'react'
import Page from '@/components/page'
import Section from '@/components/section'
import RecipeCard from '@/components/recipe-card'
import { useRecipes } from '@/hooks/useRecipes'

const Recipes = () => {
	const [searchQuery, setSearchQuery] = useState('')
	const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
	const { recipes, toggleFavorite, isFavorite, getFavoriteRecipes, getAllTags } = useRecipes()

	const tags = getAllTags()

	const filteredRecipes = useMemo(() => {
		let results = showFavoritesOnly ? getFavoriteRecipes() : recipes

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			results = results.filter(
				(recipe) =>
					recipe.name.toLowerCase().includes(query) ||
					recipe.description.toLowerCase().includes(query) ||
					recipe.tags.ingredient.some((ing) => ing.toLowerCase().includes(query)) ||
					recipe.tags.meat.toLowerCase().includes(query) ||
					recipe.tags.taste.some((taste) => taste.toLowerCase().includes(query)) ||
					recipe.tags.country.toLowerCase().includes(query) ||
					recipe.tags.meal.toLowerCase().includes(query)
			)
		}

		return results
	}, [searchQuery, showFavoritesOnly, recipes, getFavoriteRecipes])

	const handleTagClick = (tag: string) => {
		setSearchQuery(tag)
	}

	return (
		<Page>
			<Section>
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-zinc-900 dark:text-white mb-6'>
						All Recipes
					</h1>

					{/* Search Bar */}
					<div className='mb-6'>
						<input
							type='text'
							placeholder='Search recipes by name, ingredient, taste, country...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
						/>
					</div>

					{/* Favorites Toggle */}
					<div className='mb-6 flex items-center gap-3'>
						<button
							onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
							className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
								showFavoritesOnly
									? 'bg-red-500 text-white'
									: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600'
							}`}
						>
							♥ {showFavoritesOnly ? 'Favorites Only' : 'Show All'}
						</button>
						<span className='text-sm text-zinc-600 dark:text-zinc-400'>
							{filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
						</span>
					</div>

					{/* Popular Tags */}
					<div className='mb-8 space-y-3'>
						<div>
							<h3 className='text-xs font-semibold uppercase text-zinc-700 dark:text-zinc-400 mb-2'>
								Browse by Meal Type
							</h3>
							<div className='flex flex-wrap gap-2'>
								{tags.meals.map((meal) => (
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

						<div>
							<h3 className='text-xs font-semibold uppercase text-zinc-700 dark:text-zinc-400 mb-2'>
								Browse by Ingredient
							</h3>
							<div className='flex flex-wrap gap-2'>
								{tags.ingredients.map((ingredient) => (
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

						<div>
							<h3 className='text-xs font-semibold uppercase text-zinc-700 dark:text-zinc-400 mb-2'>
								Browse by Country
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

					{/* Recipe Cards Grid */}
					{filteredRecipes.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{filteredRecipes.map((recipe) => (
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
							<p className='text-zinc-600 dark:text-zinc-400 mb-4'>
								No recipes found matching your criteria
							</p>
						</div>
					)}
				</div>
			</Section>
		</Page>
	)
}

export default Recipes