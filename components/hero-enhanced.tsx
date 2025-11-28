/**
 * Enhanced Hero Component
 * Premium landing section with animations, featured recipes, and call-to-action
 */

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRecipes } from '@/hooks/useRecipes'

interface HeroEnhancedProps {
	onSearch?: (query: string) => void
	featuredRecipeCount?: number
}

const HeroEnhanced: React.FC<HeroEnhancedProps> = ({ 
	onSearch, 
	featuredRecipeCount = 4 
}) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [activeTab, setActiveTab] = useState<'meals' | 'ingredients' | 'tastes'>('meals')
	const router = useRouter()
	const { recipes, getAllTags } = useRecipes()
	const tags = getAllTags()

	// Get featured recipes (top rated)
	const featuredRecipes = useMemo(() => {
		return recipes.slice(0, featuredRecipeCount)
	}, [recipes, featuredRecipeCount])

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
		setSearchQuery(tag)
	}

	const tabData = {
		meals: tags.meals.slice(0, 6),
		ingredients: tags.ingredients.slice(0, 6),
		tastes: tags.tastes.slice(0, 6),
	}

	return (
		<div className='relative overflow-hidden'>
			{/* Animated background gradient */}
			<div className='absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-zinc-800 dark:via-zinc-900 dark:to-orange-950 -z-10' />
			<div className='absolute top-0 right-0 w-96 h-96 bg-orange-200 dark:bg-orange-900 rounded-full blur-3xl opacity-20 -z-10 animate-pulse' />
			<div className='absolute bottom-0 left-0 w-96 h-96 bg-amber-200 dark:bg-amber-900 rounded-full blur-3xl opacity-20 -z-10 animate-pulse' />

			<div className='relative px-6 py-16 md:py-24'>
				<div className='mx-auto max-w-6xl'>
					{/* Main Hero Content */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16'>
						{/* Text Content */}
						<div className='space-y-6 animate-fade-in'>
							<div className='space-y-3'>
								<div className='inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold'>
									✨ Culinary Excellence
								</div>
								<h1 className='text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white leading-tight'>
									Discover Your Next
									<span className='block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500'>
										Favorite Recipe
									</span>
								</h1>
							</div>

							<p className='text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-lg'>
								Explore thousands of delicious recipes handpicked for every taste. From quick weeknight dinners to impressive dishes for entertaining, find your culinary inspiration.
							</p>

							{/* CTA Buttons */}
							<div className='flex flex-col sm:flex-row gap-4 pt-4'>
								<Link
									href='/recipes'
									className='inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-orange-500/50 transform hover:scale-105'
								>
									Browse Recipes
									<span className='ml-2'>→</span>
								</Link>
								<Link
									href='/search'
									className='inline-flex items-center justify-center px-8 py-3 border-2 border-orange-500 text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-semibold rounded-lg transition-all'
								>
									Advanced Search
								</Link>
							</div>

							{/* Quick Stats */}
							<div className='flex gap-8 pt-6 border-t border-zinc-200 dark:border-zinc-700'>
								<div>
									<div className='text-2xl font-bold text-orange-500'>{recipes.length}+</div>
									<div className='text-sm text-zinc-600 dark:text-zinc-400'>Recipes</div>
								</div>
								<div>
									<div className='text-2xl font-bold text-orange-500'>{tags.meals.length}</div>
									<div className='text-sm text-zinc-600 dark:text-zinc-400'>Meal Types</div>
								</div>
								<div>
									<div className='text-2xl font-bold text-orange-500'>{tags.countries.length}</div>
									<div className='text-sm text-zinc-600 dark:text-zinc-400'>Cuisines</div>
								</div>
							</div>
						</div>

						{/* Featured Recipe Showcase */}
						<div className='hidden lg:grid grid-cols-2 gap-4'>
							{featuredRecipes.slice(0, 4).map((recipe, idx) => (
								<Link
									key={recipe.slug}
									href={`/recipe/${recipe.slug}`}
									className='group relative rounded-lg overflow-hidden aspect-square hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in'
									style={{ animationDelay: `${idx * 100}ms` }}
								>
									<Image
										src={recipe.image}
										alt={recipe.name}
										fill
										className='object-cover group-hover:scale-110 transition-transform duration-300'
									/>
									<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
									<div className='absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform'>
										<p className='text-white font-semibold text-sm truncate'>{recipe.name}</p>
										<p className='text-orange-300 text-xs'>⏱ {recipe.totalTime} min</p>
									</div>
								</Link>
							))}
						</div>
					</div>

					{/* Search Section */}
					<div className='mb-16'>
						<form onSubmit={handleSearch} className='mb-8'>
							<div className='relative group'>
								<input
									type='text'
									placeholder='Search recipes, ingredients, cuisines...'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className='w-full px-6 py-4 text-lg rounded-xl bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 border-2 border-transparent hover:border-orange-300 focus:outline-none focus:border-orange-500 transition-all shadow-lg group-hover:shadow-xl'
								/>
								<button
									type='submit'
									className='absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg transition-all hover:shadow-lg'
								>
									🔍 Search
								</button>
							</div>
						</form>

						{/* Category Tabs */}
						<div className='space-y-4'>
							<div className='flex gap-2 border-b border-zinc-200 dark:border-zinc-700'>
								{(['meals', 'ingredients', 'tastes'] as const).map((tab) => (
									<button
										key={tab}
										onClick={() => setActiveTab(tab)}
										className={`px-4 py-3 font-semibold text-sm transition-all border-b-2 ${
											activeTab === tab
												? 'border-orange-500 text-orange-600 dark:text-orange-400'
												: 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300'
										}`}
									>
										{tab.charAt(0).toUpperCase() + tab.slice(1)}
									</button>
								))}
							</div>

							{/* Tag Grid */}
							<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3'>
								{tabData[activeTab].map((tag) => (
									<button
										key={tag}
										onClick={() => handleTagClick(tag)}
										className='px-4 py-3 rounded-lg text-sm font-medium bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-600 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all transform hover:scale-105'
									>
										{tag}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				@keyframes fade-in {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fade-in {
					animation: fade-in 0.8s ease-out forwards;
				}
			`}</style>
		</div>
	)
}

export default HeroEnhanced
