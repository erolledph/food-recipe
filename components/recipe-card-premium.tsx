/**
 * Premium Recipe Card Component
 * Enhanced version with animations, better UX, and accessibility
 */

import Image from 'next/image'
import Link from 'next/link'
import { Recipe } from '@/hooks/useRecipes'
import { Badge, Button } from '@/components/ui'

interface RecipeCardProps {
	recipe: Recipe
	isFavorite: boolean
	onToggleFavorite: (recipeSlug: string) => void
	onTrackViewed?: (recipeSlug: string) => void
	variant?: 'compact' | 'detailed'
}

const RecipeCardPremium: React.FC<RecipeCardProps> = ({
	recipe,
	isFavorite,
	onToggleFavorite,
	onTrackViewed,
	variant = 'compact',
}) => {
	const handleViewRecipe = () => {
		onTrackViewed?.(recipe.slug)
	}

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case 'Easy':
				return 'success'
			case 'Medium':
				return 'warning'
			case 'Hard':
				return 'danger'
			default:
				return 'default'
		}
	}

	if (variant === 'detailed') {
		return (
			<div className='group bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-zinc-200 dark:border-zinc-700'>
				{/* Image Container */}
				<div className='relative h-64 overflow-hidden bg-gradient-to-br from-orange-200 to-orange-100 dark:from-orange-900 dark:to-orange-800'>
					<Image
						src={recipe.image}
						alt={recipe.name}
						fill
						className='object-cover group-hover:scale-110 transition-transform duration-500'
						priority={false}
						sizes='(max-width: 768px) 100vw, 50vw'
					/>

					{/* Overlay Badge */}
					<div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4'>
						<div className='w-full'>
							{recipe.tags.taste.length > 0 && (
								<div className='flex flex-wrap gap-2'>
									{recipe.tags.taste.slice(0, 2).map((taste) => (
										<Badge key={taste} variant='default' className='text-white'>
											{taste}
										</Badge>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Favorite Button */}
					<button
						onClick={() => onToggleFavorite(recipe.slug)}
						className={`absolute top-4 right-4 text-3xl transition-transform duration-300 hover:scale-125 ${
							isFavorite ? 'text-red-500 drop-shadow-lg' : 'text-white/80 hover:text-white drop-shadow-md'
						}`}
						aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
						aria-pressed={isFavorite}
					>
						♥
					</button>
				</div>

				{/* Content */}
				<div className='p-5'>
					{/* Header */}
					<div className='mb-3'>
						<h3 className='text-xl font-bold text-zinc-900 dark:text-white line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors'>
							{recipe.name}
						</h3>
						<p className='text-sm text-zinc-600 dark:text-zinc-400 mt-1'>
							{recipe.tags.country}
						</p>
					</div>

					{/* Description */}
					<p className='text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed'>
						{recipe.description}
					</p>

					{/* Stats Grid */}
					<div className='grid grid-cols-3 gap-3 mb-4 p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg'>
						<div className='text-center'>
							<div className='text-2xl'>⏱️</div>
							<p className='text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-1'>
								{recipe.totalTime}m
							</p>
						</div>
						<div className='text-center'>
							<div className='text-2xl'>👥</div>
							<p className='text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-1'>
								{recipe.servings}
							</p>
						</div>
						<div className='text-center'>
							<div className='text-2xl'>📊</div>
							<p className='text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-1'>
								{recipe.difficulty}
							</p>
						</div>
					</div>

					{/* Tags */}
					<div className='flex flex-wrap gap-2 mb-4'>
						<Badge variant={getDifficultyColor(recipe.difficulty)}>
							{recipe.difficulty}
						</Badge>
						{recipe.isVegan && <Badge variant='success'>Vegan</Badge>}
						{recipe.isGlutenFree && <Badge variant='info'>GF</Badge>}
					</div>

					{/* Button */}
					<Link href={`/recipe/${recipe.slug}`} onClick={handleViewRecipe} className='block'>
						<Button
							variant='primary'
							size='md'
							className='w-full group-hover:shadow-lg'
						>
							View Recipe →
						</Button>
					</Link>
				</div>

				{/* Rating Bar */}
				{recipe.rating && (
					<div className='h-1 bg-gradient-to-r from-orange-400 to-orange-600 relative' style={{ width: `${Math.min(recipe.rating * 20, 100)}%` }} />
				)}
			</div>
		)
	}

	// Compact variant
	return (
		<div className='group flex gap-3 p-3 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all hover:shadow-md'>
			{/* Thumbnail */}
			<div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-700'>
				<Image
					src={recipe.image}
					alt={recipe.name}
					fill
					className='object-cover'
					sizes='80px'
				/>
			</div>

			{/* Content */}
			<div className='flex-1 min-w-0'>
				<h4 className='font-semibold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-orange-600'>
					{recipe.name}
				</h4>
				<p className='text-xs text-zinc-600 dark:text-zinc-400 mt-0.5'>
					{recipe.tags.country} · ⏱️ {recipe.totalTime}m
				</p>
				<div className='flex gap-1.5 mt-2'>
					<Badge variant='default' className='text-xs'>
						{recipe.difficulty}
					</Badge>
					{recipe.isVegan && <Badge variant='success' className='text-xs'>V</Badge>}
				</div>
			</div>

			{/* Action */}
			<button
				onClick={() => onToggleFavorite(recipe.slug)}
				className={`text-2xl transition-transform hover:scale-125 ${
					isFavorite ? 'text-red-500' : 'text-zinc-300 hover:text-red-500'
				}`}
				aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
			>
				♥
			</button>
		</div>
	)
}

export default RecipeCardPremium
