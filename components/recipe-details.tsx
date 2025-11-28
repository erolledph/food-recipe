/**
 * Enhanced Recipe Details Component
 * Comprehensive recipe view with ingredients, instructions, nutrition, and more
 */

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Recipe } from '@/lib/types'
import { Badge, Button } from '@/components/ui'

interface RecipeDetailsProps {
	recipe: Recipe
	isFavorite: boolean
	onToggleFavorite: () => void
	relatedRecipes?: Recipe[]
	onRateRecipe?: (rating: number) => void
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({
	recipe,
	isFavorite,
	onToggleFavorite,
	relatedRecipes = [],
	onRateRecipe,
}) => {
	const [activeTab, setActiveTab] = useState<'overview' | 'instructions' | 'nutrition' | 'reviews'>('overview')
	const [servingSize, setServingSize] = useState(recipe.servings)
	const [userRating, setUserRating] = useState(0)

	const scalingFactor = servingSize / recipe.servings

	return (
		<div className='space-y-12'>
			{/* Hero Section */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Image */}
				<div className='lg:col-span-2'>
					<div className='relative aspect-video rounded-xl overflow-hidden shadow-xl'>
						<Image
							src={recipe.image}
							alt={recipe.name}
							fill
							className='object-cover'
							priority
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
					</div>
				</div>

				{/* Quick Info */}
				<div className='space-y-6'>
					{/* Title */}
					<div>
						<h1 className='text-4xl font-bold text-zinc-900 dark:text-white mb-3'>
							{recipe.name}
						</h1>
						<p className='text-lg text-zinc-600 dark:text-zinc-300'>
							{recipe.description}
						</p>
					</div>

					{/* Stats Grid */}
					<div className='grid grid-cols-2 gap-4'>
						<StatBox label='Prep' value={`${recipe.prepTime} min`} icon='🔪' />
						<StatBox label='Cook' value={`${recipe.cookTime} min`} icon='🍳' />
						<StatBox label='Total' value={`${recipe.totalTime} min`} icon='⏱' />
						<StatBox label='Difficulty' value={recipe.difficulty} icon='📊' />
					</div>

					{/* Tags */}
					<div className='space-y-3'>
						<div className='flex flex-wrap gap-2'>
							{recipe.isVegan && <Badge variant='success'>🌱 Vegan</Badge>}
							{recipe.isGlutenFree && <Badge variant='info'>🌾 GF</Badge>}
							{recipe.isSpicy && <Badge variant='warning'>🌶️ Spicy</Badge>}
						</div>
					</div>

					{/* Actions */}
					<div className='space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-700'>
						<button
							onClick={onToggleFavorite}
							className={`w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
								isFavorite
									? 'bg-red-500 text-white hover:bg-red-600'
									: 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-200'
							}`}
						>
							{isFavorite ? '❤️ Saved' : '🤍 Save Recipe'}
						</button>
						<Button className='w-full' variant='outline'>
							📋 Add to Meal Plan
						</Button>
					</div>

					{/* Servings */}
					<div className='bg-zinc-50 dark:bg-zinc-700 p-4 rounded-lg'>
						<label className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 block mb-2'>
							Servings
						</label>
						<div className='flex items-center gap-2'>
							<button
								onClick={() => setServingSize(Math.max(1, servingSize - 1))}
								className='w-8 h-8 rounded-lg bg-white dark:bg-zinc-600 border border-zinc-200 dark:border-zinc-500 hover:bg-orange-100 transition-colors'
							>
								−
							</button>
							<input
								type='number'
								value={servingSize}
								onChange={(e) => setServingSize(Math.max(1, parseInt(e.target.value) || 1))}
								className='flex-1 text-center rounded-lg border border-zinc-200 dark:border-zinc-600 px-2 py-1 dark:bg-zinc-600'
								min='1'
							/>
							<button
								onClick={() => setServingSize(servingSize + 1)}
								className='w-8 h-8 rounded-lg bg-white dark:bg-zinc-600 border border-zinc-200 dark:border-zinc-500 hover:bg-orange-100 transition-colors'
							>
								+
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className='border-b border-zinc-200 dark:border-zinc-700'>
				<div className='flex gap-8 overflow-x-auto'>
					{(['overview', 'instructions', 'nutrition', 'reviews'] as const).map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`px-4 py-3 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${
								activeTab === tab
									? 'border-orange-500 text-orange-600 dark:text-orange-400'
									: 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300'
							}`}
						>
							{tab.charAt(0).toUpperCase() + tab.slice(1)}
						</button>
					))}
				</div>
			</div>

			{/* Tab Content */}
			<div>
				{activeTab === 'overview' && (
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						{/* Ingredients */}
						<div className='lg:col-span-2'>
							<h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-6'>
								Ingredients
							</h2>
							<div className='space-y-3'>
								{recipe.ingredients.map((ingredient, idx) => (
									<div key={idx} className='flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors'>
										<input type='checkbox' className='w-4 h-4 rounded text-orange-500' />
										<span className='text-zinc-700 dark:text-zinc-300'>
											{ingredient.quantity && (
												<span className='font-semibold'>
													{(ingredient.quantity * scalingFactor).toFixed(2)} {ingredient.unit}
												</span>
											)}
											<span className='ml-2'>{ingredient.name}</span>
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Summary */}
						<div className='space-y-6'>
							{recipe.nutritionInfo && (
								<div className='bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-lg'>
									<h3 className='font-bold text-zinc-900 dark:text-white mb-4'>Per Serving</h3>
									<div className='space-y-2 text-sm'>
										<div className='flex justify-between'>
											<span className='text-zinc-600 dark:text-zinc-400'>Calories</span>
											<span className='font-semibold text-zinc-900 dark:text-white'>
												{recipe.nutritionInfo.calories}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-zinc-600 dark:text-zinc-400'>Protein</span>
											<span className='font-semibold text-zinc-900 dark:text-white'>
												{recipe.nutritionInfo.protein}g
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-zinc-600 dark:text-zinc-400'>Carbs</span>
											<span className='font-semibold text-zinc-900 dark:text-white'>
												{recipe.nutritionInfo.carbs}g
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-zinc-600 dark:text-zinc-400'>Fat</span>
											<span className='font-semibold text-zinc-900 dark:text-white'>
												{recipe.nutritionInfo.fat}g
											</span>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				)}

				{activeTab === 'instructions' && (
					<div className='max-w-3xl'>
						<h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-6'>
							Instructions
						</h2>
						<div className='space-y-6'>
							{recipe.instructions.map((step, idx) => (
								<div key={idx} className='flex gap-4'>
									<div className='flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold'>
										{idx + 1}
									</div>
									<div className='flex-1 pt-1'>
										<p className='text-zinc-700 dark:text-zinc-300 leading-relaxed'>
											{step.instruction}
										</p>
										{step.tip && (
											<p className='mt-2 text-sm text-orange-600 dark:text-orange-400'>
												💡 Tip: {step.tip}
											</p>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{activeTab === 'nutrition' && recipe.nutritionInfo && (
					<div className='max-w-2xl'>
						<h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-6'>
							Nutrition Information
						</h2>
						<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
							<NutritionCard label='Calories' value={recipe.nutritionInfo.calories} unit='kcal' />
							<NutritionCard label='Protein' value={recipe.nutritionInfo.protein} unit='g' />
							<NutritionCard label='Carbs' value={recipe.nutritionInfo.carbs} unit='g' />
							<NutritionCard label='Fat' value={recipe.nutritionInfo.fat} unit='g' />
							<NutritionCard label='Fiber' value={recipe.nutritionInfo.fiber} unit='g' />
							<NutritionCard label='Sugar' value={recipe.nutritionInfo.sugar} unit='g' />
						</div>
					</div>
				)}

				{activeTab === 'reviews' && (
					<div className='max-w-2xl'>
						<h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-6'>
							Rate This Recipe
						</h2>
						<div className='flex gap-2 mb-6'>
							{[1, 2, 3, 4, 5].map((rating) => (
								<button
									key={rating}
									onClick={() => {
										setUserRating(rating)
										onRateRecipe?.(rating)
									}}
									className={`text-3xl transition-transform hover:scale-125 ${
										rating <= userRating ? '⭐' : '☆'
									}`}
								>
									{rating <= userRating ? '⭐' : '☆'}
								</button>
							))}
						</div>
						{recipe.reviews && recipe.reviews.length > 0 && (
							<div className='space-y-4'>
								<h3 className='font-semibold text-zinc-900 dark:text-white'>
									Recent Reviews
								</h3>
								{recipe.reviews.map((review, idx) => (
									<div
										key={idx}
										className='p-4 rounded-lg bg-zinc-50 dark:bg-zinc-700'
									>
										<div className='flex items-center gap-2 mb-2'>
											<span className='font-semibold text-zinc-900 dark:text-white'>
												{'⭐'.repeat(review.rating)}
											</span>
											<span className='text-sm text-zinc-600 dark:text-zinc-400'>
												{review.reviewer}
											</span>
										</div>
										<p className='text-zinc-700 dark:text-zinc-300'>
											{review.comment}
										</p>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>

			{/* Related Recipes */}
			{relatedRecipes.length > 0 && (
				<div className='pt-8 border-t border-zinc-200 dark:border-zinc-700'>
					<h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-6'>
						You Might Also Like
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
						{relatedRecipes.slice(0, 4).map((relatedRecipe) => (
							<Link
								key={relatedRecipe.slug}
								href={`/recipe/${relatedRecipe.slug}`}
								className='group rounded-lg overflow-hidden hover:shadow-lg transition-all'
							>
								<div className='relative aspect-square overflow-hidden'>
									<Image
										src={relatedRecipe.image}
										alt={relatedRecipe.name}
										fill
										className='object-cover group-hover:scale-110 transition-transform'
									/>
								</div>
								<div className='p-4 bg-white dark:bg-zinc-700'>
									<h3 className='font-semibold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors'>
										{relatedRecipe.name}
									</h3>
									<p className='text-xs text-zinc-600 dark:text-zinc-400 mt-2'>
										⏱ {relatedRecipe.totalTime} min
									</p>
								</div>
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

const StatBox: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
	<div className='bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-lg'>
		<div className='text-2xl mb-2'>{icon}</div>
		<div className='text-xs text-zinc-600 dark:text-zinc-400'>{label}</div>
		<div className='text-lg font-bold text-zinc-900 dark:text-white'>{value}</div>
	</div>
)

const NutritionCard: React.FC<{ label: string; value: number; unit: string }> = ({
	label,
	value,
	unit,
}) => (
	<div className='bg-zinc-50 dark:bg-zinc-700 p-4 rounded-lg text-center'>
		<div className='text-sm text-zinc-600 dark:text-zinc-400'>{label}</div>
		<div className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
			{value}
			<span className='text-sm text-zinc-600 dark:text-zinc-400 ml-1'>{unit}</span>
		</div>
	</div>
)

export default RecipeDetails
