import Image from 'next/image'
import Link from 'next/link'
import { Recipe } from '@/hooks/useRecipes'

interface RecipeCardProps {
	recipe: Recipe
	isFavorite: boolean
	onToggleFavorite: (recipeSlug: string) => void
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isFavorite, onToggleFavorite }) => {
	return (
		<div className='bg-white dark:bg-zinc-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow'>
			<div className='relative h-48 overflow-hidden bg-zinc-200 dark:bg-zinc-700'>
				<Image
					src={recipe.image}
					alt={recipe.name}
					fill
					className='object-cover'
				/>
			</div>
			<div className='p-4'>
				<div className='flex items-start justify-between mb-2'>
					<h3 className='text-lg font-semibold text-zinc-900 dark:text-white line-clamp-2'>
						{recipe.name}
					</h3>
					<button
						onClick={() => onToggleFavorite(recipe.slug)}
						className={`ml-2 text-2xl transition-colors flex-shrink-0 ${
							isFavorite ? 'text-red-500' : 'text-zinc-300 hover:text-red-500'
						}`}
					>
						♥
					</button>
				</div>
				<p className='text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2'>
					{recipe.description}
				</p>
				<div className='flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-3'>
					<span>⏱️ {recipe.totalTime} min</span>
					<span>👥 {recipe.servings} servings</span>
					<span className={`px-2 py-1 rounded-full ${
						recipe.difficulty === 'Easy'
							? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
							: recipe.difficulty === 'Medium'
								? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
								: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
					}`}>
						{recipe.difficulty}
					</span>
				</div>
				<Link
					href={`/recipe/${recipe.slug}`}
					className='block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors'
				>
					View Recipe
				</Link>
			</div>
		</div>
	)
}

export default RecipeCard
