/**
 * Enhanced Recipes Page
 * With advanced filtering, sorting, and multiple view modes
 */

import { useState, useMemo } from 'react'
import Page from '@/components/page'
import Section from '@/components/section'
import RecipeCard from '@/components/recipe-card'
import AdvancedFilter, { FilterOptions, SortOption } from '@/components/advanced-filter'
import { useRecipes } from '@/hooks/useRecipes'

const RecipesEnhanced = () => {
	const [filters, setFilters] = useState<FilterOptions>({
		mealTypes: [],
		cuisines: [],
		ingredients: [],
		tastes: [],
		difficulty: '',
		cookTimeMax: 120,
		prepTimeMax: 60,
		dietary: {
			vegetarian: false,
			vegan: false,
			glutenFree: false,
			dairyFree: false,
		},
	})

	const [sort, setSort] = useState<SortOption>({
		field: 'name',
		direction: 'asc',
	})

	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
	const [searchQuery, setSearchQuery] = useState('')

	const { recipes, toggleFavorite, isFavorite, getAllTags } = useRecipes()
	const tags = getAllTags()

	// Apply filters and sorting
	const filteredRecipes = useMemo(() => {
		let results = [...recipes]

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			results = results.filter(
				(recipe) =>
					recipe.name.toLowerCase().includes(query) ||
					recipe.description.toLowerCase().includes(query) ||
					recipe.tags.ingredient.some((ing) => ing.toLowerCase().includes(query)) ||
					recipe.tags.taste.some((taste) => taste.toLowerCase().includes(query))
			)
		}

		// Meal type filter
		if (filters.mealTypes.length > 0) {
			results = results.filter((recipe) =>
				filters.mealTypes.includes(recipe.tags.meal)
			)
		}

		// Cuisine filter
		if (filters.cuisines.length > 0) {
			results = results.filter((recipe) =>
				filters.cuisines.includes(recipe.tags.country)
			)
		}

		// Difficulty filter
		if (filters.difficulty) {
			results = results.filter((recipe) => recipe.difficulty === filters.difficulty)
		}

		// Cook time filter
		results = results.filter((recipe) => recipe.cookTime <= filters.cookTimeMax)

		// Prep time filter
		results = results.filter((recipe) => recipe.prepTime <= filters.prepTimeMax)

		// Dietary filters
		if (filters.dietary.vegetarian) {
			results = results.filter((recipe) => recipe.tags.meat.toLowerCase() === 'vegetarian')
		}
		if (filters.dietary.vegan) {
			results = results.filter((recipe) => recipe.isVegan)
		}
		if (filters.dietary.glutenFree) {
			results = results.filter((recipe) => recipe.isGlutenFree)
		}

		// Ingredient filters
		if (filters.ingredients.length > 0) {
			results = results.filter((recipe) =>
				filters.ingredients.some((ing) =>
					recipe.tags.ingredient.some((recipeIng) =>
						recipeIng.toLowerCase().includes(ing.toLowerCase())
					)
				)
			)
		}

		// Taste filters
		if (filters.tastes.length > 0) {
			results = results.filter((recipe) =>
				filters.tastes.some((taste) =>
					recipe.tags.taste.includes(taste)
				)
			)
		}

		// Sorting
		results.sort((a, b) => {
			let aValue, bValue

			switch (sort.field) {
				case 'name':
					aValue = a.name.toLowerCase()
					bValue = b.name.toLowerCase()
					break
				case 'cookTime':
					aValue = a.cookTime
					bValue = b.cookTime
					break
				case 'prepTime':
					aValue = a.prepTime
					bValue = b.prepTime
					break
				case 'difficulty': {
					const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
					aValue = difficultyOrder[a.difficulty as keyof typeof difficultyOrder]
					bValue = difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
					break
				}
				case 'rating':
					aValue = a.rating || 0
					bValue = b.rating || 0
					break
				default:
					aValue = a.name.toLowerCase()
					bValue = b.name.toLowerCase()
			}

			if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1
			if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1
			return 0
		})

		return results
	}, [recipes, filters, sort, searchQuery])

	return (
		<Page>
			<Section>
				<div className='mb-8'>
					<h1 className='text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-3'>
						All Recipes
					</h1>
					<p className='text-lg text-zinc-600 dark:text-zinc-400'>
						Explore {recipes.length}+ delicious recipes. Use filters to find exactly what you're looking for.
					</p>
				</div>

				{/* Search Bar */}
				<div className='mb-8'>
					<input
						type='text'
						placeholder='Search recipes by name, ingredient, or cuisine...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='w-full px-6 py-4 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 border-2 border-zinc-200 dark:border-zinc-600 focus:outline-none focus:border-orange-500 text-lg shadow-lg'
					/>
				</div>

				{/* Main Content */}
				<div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
					{/* Filters Sidebar */}
					<div className='lg:col-span-1'>
						<AdvancedFilter
							onFilterChange={setFilters}
							onSortChange={setSort}
							availableTags={tags}
							viewMode={viewMode}
							onViewModeChange={setViewMode}
						/>
					</div>

					{/* Recipes Grid/List */}
					<div className='lg:col-span-3'>
						{/* Results Count */}
						<div className='mb-6 flex items-center justify-between'>
							<p className='text-sm font-semibold text-zinc-600 dark:text-zinc-400'>
								Showing {filteredRecipes.length} of {recipes.length} recipes
							</p>
						</div>

						{/* Recipes */}
						{filteredRecipes.length > 0 ? (
							<div
								className={
									viewMode === 'grid'
										? 'grid grid-cols-1 md:grid-cols-2 gap-6'
										: 'space-y-4'
								}
							>
								{filteredRecipes.map((recipe) => (
									<RecipeCard
										key={recipe.slug}
										recipe={recipe}
										isFavorite={isFavorite(recipe.slug)}
										onToggleFavorite={() => toggleFavorite(recipe.slug)}
										onTrackViewed={() => {}}
										variant={viewMode === 'list' ? 'compact' : 'detailed'}
									/>
								))}
							</div>
						) : (
							<div className='text-center py-12'>
								<p className='text-xl text-zinc-600 dark:text-zinc-400 mb-4'>
									No recipes match your filters
								</p>
								<button
									onClick={() => setFilters({
										mealTypes: [],
										cuisines: [],
										ingredients: [],
										tastes: [],
										difficulty: '',
										cookTimeMax: 120,
										prepTimeMax: 60,
										dietary: {
											vegetarian: false,
											vegan: false,
											glutenFree: false,
											dairyFree: false,
										},
									})}
									className='px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-semibold'
								>
									Clear Filters
								</button>
							</div>
						)}
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default RecipesEnhanced
