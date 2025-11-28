'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Page from '@/components/page'
import Section from '@/components/section'
import { useAdmin } from '@/contexts/AdminContext'
import { useRecipes } from '@/hooks/useRecipes'

interface NewRecipeForm {
	name: string
	slug: string
	description: string
	servings: number
	cookTime: number
	prepTime: number
	difficulty: 'Easy' | 'Medium' | 'Hard'
	image: string
	mealType: string
	protein: string
	country: string
	ingredients: string
	instructions: string
	tastes: string
	ingredients_tags: string
}

export const DashboardContent = () => {
	const router = useRouter()
	const { isLoggedIn, logout } = useAdmin()
	const { recipes } = useRecipes()
	const [activeTab, setActiveTab] = useState<'recipes' | 'create'>('recipes')
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState('')
	const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

	useEffect(() => {
		// Redirect if not logged in
		if (!isLoggedIn) {
			router.push('/login')
		}
	}, [isLoggedIn, router])

	const [formData, setFormData] = useState<NewRecipeForm>({
		name: '',
		slug: '',
		description: '',
		servings: 2,
		cookTime: 30,
		prepTime: 15,
		difficulty: 'Easy',
		image: '',
		mealType: 'Lunch',
		protein: 'None',
		country: '',
		ingredients: '',
		instructions: '',
		tastes: '',
		ingredients_tags: '',
	})

	const generateSlug = (name: string) => {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target

		setFormData((prev) => {
			const updated = { ...prev, [name]: value }

			// Auto-generate slug from name
			if (name === 'name') {
				updated.slug = generateSlug(value)
			}

			return updated
		})
	}

	const handleCreateRecipe = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setMessage('')

		try {
			// Validate required fields
			if (!formData.name || !formData.slug || !formData.country || !formData.ingredients || !formData.instructions) {
				setMessage('Please fill in all required fields')
				setMessageType('error')
				setLoading(false)
				return
			}

			// Create markdown content for the recipe file
			const markdownContent = `---
name: "${formData.name}"
slug: "${formData.slug}"
description: "${formData.description || ''}"
servings: ${formData.servings}
cookTime: ${formData.cookTime}
prepTime: ${formData.prepTime}
totalTime: ${formData.cookTime + formData.prepTime}
difficulty: "${formData.difficulty}"
image: "${formData.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=60'}"
tags:
  meal: "${formData.mealType}"
  ingredient: ${JSON.stringify(
	formData.ingredients_tags
		.split(',')
		.map((i) => i.trim())
		.filter((i) => i)
)}
  meat: "${formData.protein}"
  sideDish: false
  taste: ${JSON.stringify(
	formData.tastes
		.split(',')
		.map((t) => t.trim())
		.filter((t) => t)
)}
  country: "${formData.country}"
---

## Ingredients

${formData.ingredients
	.split('\n')
	.map((i) => i.trim())
	.filter((i) => i)
	.map((i) => `- ${i}`)
	.join('\n')}

## Instructions

${formData.instructions
	.split('\n')
	.map((i) => i.trim())
	.filter((i) => i)
	.map((i, idx) => `${idx + 1}. ${i}`)
	.join('\n')}
`

			// Push to GitHub
			const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER
			const repo = process.env.NEXT_PUBLIC_GITHUB_REPO
			const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
			const filePath = `app/recipes/${formData.slug}.md`

			if (!owner || !repo || !token) {
				setMessage('GitHub configuration missing. Please check environment variables.')
				setMessageType('error')
				setLoading(false)
				return
			}

			// Get current file to check if it exists
			let sha: string | undefined

			try {
				const getResponse = await fetch(
					`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
					{
						headers: {
							Authorization: `token ${token}`,
						},
					}
				)

				if (getResponse.ok) {
					const data = await getResponse.json()
					sha = data.sha
				}
			} catch {
				// File doesn't exist, which is fine for a new recipe
			}

			// Create or update the file
			const response = await fetch(
				`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
				{
					method: 'PUT',
					headers: {
						Authorization: `token ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						message: `Add recipe: ${formData.name}`,
						content: Buffer.from(markdownContent).toString('base64'),
						...(sha && { sha }),
					}),
				}
			)

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || 'Failed to push to GitHub')
			}

			setMessage(`✅ Recipe "${formData.name}" created and pushed to GitHub! Vercel will auto-deploy shortly.`)
			setMessageType('success')

			// Reset form
			setFormData({
				name: '',
				slug: '',
				description: '',
				servings: 2,
				cookTime: 30,
				prepTime: 15,
				difficulty: 'Easy',
				image: '',
				mealType: 'Lunch',
				protein: 'None',
				country: '',
				ingredients: '',
				instructions: '',
				tastes: '',
				ingredients_tags: '',
			})
		} catch (error) {
			setMessage('Error creating recipe: ' + (error instanceof Error ? error.message : 'Unknown error'))
			setMessageType('error')
		}

		setLoading(false)
	}

	return (
		<Page>
			<Section>
				<div className='mb-8'>
					{/* Header */}
					<div className='flex items-center justify-between mb-8'>
						<h1 className='text-3xl font-bold text-zinc-900 dark:text-white'>Admin Dashboard</h1>
						<button
							onClick={() => {
								logout()
								router.push('/')
							}}
							className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors'
						>
							Logout
						</button>
					</div>

					{/* Tabs */}
					<div className='flex gap-4 mb-8 border-b border-zinc-300 dark:border-zinc-700'>
						<button
							onClick={() => setActiveTab('recipes')}
							className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
								activeTab === 'recipes'
									? 'border-orange-500 text-orange-500'
									: 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
							}`}
						>
							All Recipes ({recipes.length})
						</button>
						<button
							onClick={() => setActiveTab('create')}
							className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
								activeTab === 'create'
									? 'border-orange-500 text-orange-500'
									: 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
							}`}
						>
							Create Recipe
						</button>
					</div>

					{/* Recipes List Tab */}
					{activeTab === 'recipes' && (
						<div>
							<h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-6'>Recipes</h2>
							<div className='space-y-3'>
								{recipes.length > 0 ? (
									recipes.map((recipe) => (
										<div
											key={recipe.slug}
											className='p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-between'
										>
											<div>
												<h3 className='font-semibold text-zinc-900 dark:text-white'>{recipe.name}</h3>
												<p className='text-sm text-zinc-600 dark:text-zinc-400'>{recipe.description}</p>
												<p className='text-xs text-zinc-500 dark:text-zinc-500 mt-1'>/{recipe.slug}</p>
											</div>
											<div className='flex gap-2'>
												<Link
													href={`/recipe/${recipe.slug}`}
													className='px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded transition-colors'
												>
													View
												</Link>
											</div>
										</div>
									))
								) : (
									<p className='text-zinc-600 dark:text-zinc-400'>No recipes yet</p>
								)}
							</div>
						</div>
					)}

					{/* Create Recipe Tab */}
					{activeTab === 'create' && (
						<div>
							<h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-6'>Create New Recipe</h2>

							{message && (
								<div
									className={`p-4 rounded-lg mb-6 ${
										messageType === 'success'
											? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
											: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
									}`}
								>
									{message}
								</div>
							)}

							<form onSubmit={handleCreateRecipe} className='space-y-6'>
								{/* Basic Info */}
								<div className='bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg space-y-4'>
									<h3 className='font-semibold text-zinc-900 dark:text-white'>Basic Information</h3>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Recipe Name *
										</label>
										<input
											type='text'
											name='name'
											value={formData.name}
											onChange={handleInputChange}
											placeholder='e.g., Thai Green Curry'
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
											required
										/>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											URL Slug (auto-generated)
										</label>
										<input
											type='text'
											name='slug'
											value={formData.slug}
											readOnly
											className='w-full px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-600 cursor-not-allowed'
										/>
										<p className='text-xs text-zinc-500 dark:text-zinc-400 mt-1'>Auto-generated from recipe name</p>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Description
										</label>
										<textarea
											name='description'
											value={formData.description}
											onChange={handleInputChange}
											placeholder='Brief description of the recipe'
											rows={3}
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
										/>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Image URL
										</label>
										<input
											type='url'
											name='image'
											value={formData.image}
											onChange={handleInputChange}
											placeholder='https://...'
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
										/>
									</div>
								</div>

								{/* Recipe Details */}
								<div className='bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg space-y-4'>
									<h3 className='font-semibold text-zinc-900 dark:text-white'>Recipe Details</h3>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
												Servings
											</label>
											<input
												type='number'
												name='servings'
												value={formData.servings}
												onChange={handleInputChange}
												min='1'
												className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
											/>
										</div>

										<div>
											<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
												Prep Time (min)
											</label>
											<input
												type='number'
												name='prepTime'
												value={formData.prepTime}
												onChange={handleInputChange}
												min='0'
												className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
											/>
										</div>

										<div>
											<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
												Cook Time (min)
											</label>
											<input
												type='number'
												name='cookTime'
												value={formData.cookTime}
												onChange={handleInputChange}
												min='0'
												className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
											/>
										</div>

										<div>
											<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
												Difficulty
											</label>
											<select
												name='difficulty'
												value={formData.difficulty}
												onChange={handleInputChange}
												className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
											>
												<option>Easy</option>
												<option>Medium</option>
												<option>Hard</option>
											</select>
										</div>
									</div>
								</div>

								{/* Tags & Categories */}
								<div className='bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg space-y-4'>
									<h3 className='font-semibold text-zinc-900 dark:text-white'>Tags & Categories</h3>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Meal Type *
										</label>
										<select
											name='mealType'
											value={formData.mealType}
											onChange={handleInputChange}
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
										>
											<option>Breakfast</option>
											<option>Lunch</option>
											<option>Dinner</option>
											<option>Snack</option>
											<option>Appetizer</option>
											<option>Side Dish</option>
											<option>Dessert</option>
										</select>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Protein/Meat
										</label>
										<select
											name='protein'
											value={formData.protein}
											onChange={handleInputChange}
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
										>
											<option>None</option>
											<option>Chicken</option>
											<option>Beef</option>
											<option>Pork</option>
											<option>Shrimp</option>
											<option>Fish</option>
											<option>Tofu</option>
										</select>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Country/Cuisine *
										</label>
										<input
											type='text'
											name='country'
											value={formData.country}
											onChange={handleInputChange}
											placeholder='e.g., Thailand, Japan, Mexico'
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
											required
										/>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Key Ingredients (comma-separated)
										</label>
										<input
											type='text'
											name='ingredients_tags'
											value={formData.ingredients_tags}
											onChange={handleInputChange}
											placeholder='e.g., Chicken, Garlic, Ginger'
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
										/>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Taste Profile (comma-separated)
										</label>
										<input
											type='text'
											name='tastes'
											value={formData.tastes}
											onChange={handleInputChange}
											placeholder='e.g., Spicy, Sweet, Sour'
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
										/>
									</div>
								</div>

								{/* Recipe Content */}
								<div className='bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg space-y-4'>
									<h3 className='font-semibold text-zinc-900 dark:text-white'>Recipe Content</h3>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Ingredients (one per line) *
										</label>
										<textarea
											name='ingredients'
											value={formData.ingredients}
											onChange={handleInputChange}
											placeholder='1 kg chicken, cut into pieces&#10;4 tbsp soy sauce&#10;2 tbsp oil'
											rows={5}
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500 font-mono text-sm'
											required
										/>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Instructions (one per line) *
										</label>
										<textarea
											name='instructions'
											value={formData.instructions}
											onChange={handleInputChange}
											placeholder='Heat oil in a pan&#10;Add chicken and brown on all sides&#10;Add remaining ingredients&#10;Simmer for 30 minutes'
											rows={5}
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500 font-mono text-sm'
											required
										/>
									</div>
								</div>

								{/* Submit Button */}
								<button
									type='submit'
									disabled={loading}
									className='w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors'
								>
									{loading ? 'Creating Recipe...' : 'Create Recipe'}
								</button>
							</form>

							<div className='mt-6 p-4 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-lg text-sm'>
								<p className='font-semibold mb-2'>💡 Note:</p>
								<p>Recipes created here are stored locally. To permanently save them, export the data and add it to the GitHub repository.</p>
							</div>
						</div>
					)}
				</div>

				{/* Back to Home */}
				<div className='mt-8 text-center'>
					<Link href='/' className='text-orange-500 hover:text-orange-600 font-semibold'>
						← Back to Home
					</Link>
				</div>
			</Section>
		</Page>
	)
}
