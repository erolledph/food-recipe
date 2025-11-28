import Link from 'next/link'
import Page from '@/components/page'
import HeroEnhanced from '@/components/hero-enhanced'
import Section from '@/components/section'
import { useRecipes } from '@/hooks/useRecipes'
import RecipeCard from '@/components/recipe-card'
import Image from 'next/image'

const Index = () => {
	const { recipes, toggleFavorite, isFavorite } = useRecipes()
	const featuredRecipes = recipes.slice(0, 3)
	const randomRecipes = recipes.sort(() => Math.random() - 0.5).slice(0, 4)

	return (
		<Page>
			<HeroEnhanced featuredRecipeCount={4} />

			{/* Featured Section */}
			<Section>
				<div className='mb-12'>
					<div className='mb-8'>
						<h2 className='text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-3'>
							Featured Recipes
						</h2>
						<p className='text-lg text-zinc-600 dark:text-zinc-400'>
							Handpicked recipes to inspire your next meal
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{featuredRecipes.map((recipe) => (
							<RecipeCard
								key={recipe.slug}
								recipe={recipe}
								isFavorite={isFavorite(recipe.slug)}
								onToggleFavorite={() => toggleFavorite(recipe.slug)}
								onTrackViewed={() => {}}
								variant='detailed'
							/>
						))}
					</div>
				</div>

				<div className='text-center pt-8'>
					<Link
						href='/recipes'
						className='inline-block px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all hover:shadow-lg transform hover:scale-105'
					>
						View All Recipes →
					</Link>
				</div>
			</Section>

			{/* How It Works Section */}
			<Section>
				<div className='mb-12'>
					<h2 className='text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-8 text-center'>
						How It Works
					</h2>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						<div className='text-center space-y-4'>
							<div className='w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-2xl mx-auto shadow-lg'>
								🔍
							</div>
							<h3 className='text-xl font-bold text-zinc-900 dark:text-white'>
								Discover
							</h3>
							<p className='text-zinc-600 dark:text-zinc-400'>
								Browse through our curated collection of recipes from around the world
							</p>
						</div>

						<div className='text-center space-y-4'>
							<div className='w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-2xl mx-auto shadow-lg'>
								❤️
							</div>
							<h3 className='text-xl font-bold text-zinc-900 dark:text-white'>
								Save
							</h3>
							<p className='text-zinc-600 dark:text-zinc-400'>
								Create collections and save your favorite recipes for later
							</p>
						</div>

						<div className='text-center space-y-4'>
							<div className='w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-2xl mx-auto shadow-lg'>
								👨‍🍳
							</div>
							<h3 className='text-xl font-bold text-zinc-900 dark:text-white'>
								Cook
							</h3>
							<p className='text-zinc-600 dark:text-zinc-400'>
								Follow step-by-step instructions and create delicious meals at home
							</p>
						</div>
					</div>
				</div>
			</Section>

			{/* Trending Recipes */}
			<Section>
				<div className='mb-12'>
					<div className='mb-8'>
						<h2 className='text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-3'>
							🔥 Trending Now
						</h2>
						<p className='text-lg text-zinc-600 dark:text-zinc-400'>
							Popular recipes our community is cooking
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						{randomRecipes.map((recipe) => (
							<Link
								key={recipe.slug}
								href={`/recipe/${recipe.slug}`}
								className='group rounded-lg overflow-hidden hover:shadow-lg transition-all transform hover:scale-105'
							>
								<div className='relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-700'>
									<Image
										src={recipe.image}
										alt={recipe.name}
										fill
										className='object-cover group-hover:scale-110 transition-transform'
									/>
									<div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
									<button
										onClick={(e) => {
											e.preventDefault()
											toggleFavorite(recipe.slug)
										}}
										className={`absolute top-2 right-2 text-2xl transition-transform transform hover:scale-125 ${
											isFavorite(recipe.slug) ? '❤️' : '🤍'
										}`}
									/>
								</div>
								<div className='p-4 bg-white dark:bg-zinc-800'>
									<h3 className='font-semibold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors'>
										{recipe.name}
									</h3>
									<p className='text-xs text-zinc-600 dark:text-zinc-400 mt-2 flex items-center gap-2'>
										<span>⏱ {recipe.totalTime} min</span>
										<span>•</span>
										<span>{recipe.difficulty}</span>
									</p>
								</div>
							</Link>
						))}
					</div>
				</div>
			</Section>

			{/* Stats Section */}
			<Section className='bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					<div className='text-center'>
						<div className='text-4xl md:text-5xl font-bold text-orange-600 dark:text-orange-400'>
							{recipes.length}+
						</div>
						<p className='text-lg text-zinc-600 dark:text-zinc-400 mt-2'>Recipes</p>
					</div>
					<div className='text-center'>
						<div className='text-4xl md:text-5xl font-bold text-orange-600 dark:text-orange-400'>
							50K+
						</div>
						<p className='text-lg text-zinc-600 dark:text-zinc-400 mt-2'>Servings Cooked</p>
					</div>
					<div className='text-center'>
						<div className='text-4xl md:text-5xl font-bold text-orange-600 dark:text-orange-400'>
							10K+
						</div>
						<p className='text-lg text-zinc-600 dark:text-zinc-400 mt-2'>Happy Cooks</p>
					</div>
					<div className='text-center'>
						<div className='text-4xl md:text-5xl font-bold text-orange-600 dark:text-orange-400'>
							⭐ 4.8
						</div>
						<p className='text-lg text-zinc-600 dark:text-zinc-400 mt-2'>Average Rating</p>
					</div>
				</div>
			</Section>

			{/* CTA Section */}
			<Section>
				<div className='bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-12 text-center'>
					<h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
						Ready to Start Cooking?
					</h2>
					<p className='text-orange-100 mb-8 text-lg'>
						Join our community and discover thousands of delicious recipes
					</p>
					<Link
						href='/recipes'
						className='inline-block px-8 py-3 bg-white hover:bg-zinc-100 text-orange-600 font-semibold rounded-lg transition-all hover:shadow-lg transform hover:scale-105'
					>
						Explore Recipes
					</Link>
				</div>
			</Section>
		</Page>
	)
}

export default Index
