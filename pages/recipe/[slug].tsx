import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Page from '@/components/page'
import Section from '@/components/section'
import { useRecipes } from '@/hooks/useRecipes'

const RecipeDetail = () => {
	const router = useRouter()
	const { slug } = router.query
	const { recipes, toggleFavorite, isFavorite } = useRecipes()

	const recipe = recipes.find((r) => r.slug === slug)

	if (!recipe) {
		return (
			<Page>
				<Section>
					<div className='text-center py-12'>
						<h1 className='text-3xl font-bold text-zinc-900 dark:text-white mb-4'>
							Recipe Not Found
						</h1>
						<p className='text-zinc-600 dark:text-zinc-400 mb-6'>
							Sorry, we couldn&apos;t find the recipe you&apos;re looking for.
						</p>
						<Link
							href='/recipes'
							className='inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors'
						>
							Back to Recipes
						</Link>
					</div>
				</Section>
			</Page>
		)
	}

	const isFav = isFavorite(recipe.slug)

	return (
		<Page>
			<Section>
				{/* Hero Image */}
				<div className='relative h-96 w-full mb-8 rounded-lg overflow-hidden'>
					<Image
						src={recipe.image}
						alt={recipe.name}
						fill
						className='object-cover'
					/>
				</div>

				{/* Header */}
				<div className='flex items-start justify-between mb-6'>
					<div>
						<h1 className='text-4xl font-bold text-zinc-900 dark:text-white mb-2'>
							{recipe.name}
						</h1>
						<p className='text-lg text-zinc-600 dark:text-zinc-400'>
							{recipe.description}
						</p>
					</div>
					<button
						onClick={() => toggleFavorite(recipe.slug)}
						className={`text-4xl transition-colors flex-shrink-0 ${
							isFav ? 'text-red-500' : 'text-zinc-300 hover:text-red-500'
						}`}
					>
						♥
					</button>
				</div>

				{/* Recipe Info */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg'>
					<div>
						<div className='text-sm font-semibold text-zinc-600 dark:text-zinc-400'>
							Difficulty
						</div>
						<div className={`text-lg font-bold mt-1 ${
							recipe.difficulty === 'Easy'
								? 'text-green-600'
								: recipe.difficulty === 'Medium'
									? 'text-yellow-600'
									: 'text-red-600'
						}`}>
							{recipe.difficulty}
						</div>
					</div>
					<div>
						<div className='text-sm font-semibold text-zinc-600 dark:text-zinc-400'>
							Prep Time
						</div>
						<div className='text-lg font-bold text-orange-600 mt-1'>
							{recipe.prepTime} min
						</div>
					</div>
					<div>
						<div className='text-sm font-semibold text-zinc-600 dark:text-zinc-400'>
							Cook Time
						</div>
						<div className='text-lg font-bold text-orange-600 mt-1'>
							{recipe.cookTime} min
						</div>
					</div>
					<div>
						<div className='text-sm font-semibold text-zinc-600 dark:text-zinc-400'>
							Servings
						</div>
						<div className='text-lg font-bold text-orange-600 mt-1'>
							{recipe.servings} people
						</div>
					</div>
				</div>

				{/* Tags */}
				<div className='mb-8 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg'>
					<div className='space-y-3'>
						<div>
							<h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
								Meal Type
							</h3>
							<span className='inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100 rounded-full text-sm'>
								{recipe.tags.meal}
							</span>
						</div>
						<div>
							<h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
								Protein
							</h3>
							<span className='inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm'>
								{recipe.tags.meat}
							</span>
						</div>
						<div>
							<h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
								Country
							</h3>
							<span className='inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-full text-sm'>
								{recipe.tags.country}
							</span>
						</div>
						<div>
							<h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
								Taste
							</h3>
							<div className='flex flex-wrap gap-2'>
								{recipe.tags.taste.map((taste) => (
									<span
										key={taste}
										className='inline-block px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-100 rounded-full text-sm'
									>
										{taste}
									</span>
								))}
							</div>
						</div>
						<div>
							<h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
								Ingredients
							</h3>
							<div className='flex flex-wrap gap-2'>
								{recipe.tags.ingredient.map((ingredient) => (
									<span
										key={ingredient}
										className='inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm'
									>
										{ingredient}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Ingredients Section */}
				<div className='mb-8'>
					<h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-4'>
						Ingredients
					</h2>
					<div className='bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg'>
						<ul className='space-y-2'>
							{recipe.ingredients.map((ingredient, index) => (
								<li
									key={index}
									className='flex items-start text-zinc-800 dark:text-zinc-200'
								>
									<span className='mr-3 text-orange-500 font-bold'>•</span>
									<span>{ingredient}</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Instructions Section */}
				<div className='mb-8'>
					<h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-4'>
						Instructions
					</h2>
					<div className='bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg'>
						<ol className='space-y-3'>
							{recipe.instructions.map((instruction, index) => (
								<li
									key={index}
									className='flex items-start text-zinc-800 dark:text-zinc-200'
								>
									<span className='mr-3 w-6 h-6 flex items-center justify-center bg-orange-500 text-white font-bold text-sm rounded-full flex-shrink-0'>
										{index + 1}
									</span>
									<span className='pt-0.5'>{instruction}</span>
								</li>
							))}
						</ol>
					</div>
				</div>

				{/* Back Button */}
				<Link
					href='/recipes'
					className='inline-block px-6 py-3 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white font-semibold rounded-lg transition-colors'
				>
					← Back to Recipes
				</Link>
			</Section>
		</Page>
	)
}

export default RecipeDetail
