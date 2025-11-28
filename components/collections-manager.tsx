/**
 * Collections Management Component
 * Create, manage, and organize recipe collections
 */

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Recipe } from '@/lib/types'
import { Badge, Button, Input, Modal } from '@/components/ui'

export interface RecipeCollection {
	id: string
	name: string
	description: string
	recipes: string[] // recipe slugs
	icon?: string
	color?: string
	createdAt: Date
	updatedAt: Date
}

interface CollectionsManagerProps {
	collections: RecipeCollection[]
	recipes: Recipe[]
	onCreateCollection: (collection: Omit<RecipeCollection, 'id' | 'createdAt' | 'updatedAt'>) => void
	onDeleteCollection: (collectionId: string) => void
	onAddRecipeToCollection: (collectionId: string, recipeSlug: string) => void
	onRemoveRecipeFromCollection: (collectionId: string, recipeSlug: string) => void
}

const CollectionsManager: React.FC<CollectionsManagerProps> = ({
	collections,
	recipes,
	onCreateCollection,
	onDeleteCollection,
	onAddRecipeToCollection,
	onRemoveRecipeFromCollection,
}) => {
	const [activeCollection, setActiveCollection] = useState<string | null>(collections[0]?.id || null)
	const [showCreateModal, setShowCreateModal] = useState(false)
	const [showAddRecipeModal, setShowAddRecipeModal] = useState(false)
	const [newCollectionName, setNewCollectionName] = useState('')
	const [newCollectionDesc, setNewCollectionDesc] = useState('')
	const [newCollectionIcon, setNewCollectionIcon] = useState('📚')

	const currentCollection = collections.find((c) => c.id === activeCollection)
	const collectionRecipes = currentCollection
		? recipes.filter((r) => currentCollection.recipes.includes(r.slug))
		: []

	const handleCreateCollection = () => {
		if (newCollectionName.trim()) {
			onCreateCollection({
				name: newCollectionName,
				description: newCollectionDesc,
				recipes: [],
				icon: newCollectionIcon,
				color: 'orange',
			})
			setNewCollectionName('')
			setNewCollectionDesc('')
			setNewCollectionIcon('📚')
			setShowCreateModal(false)
		}
	}

	const icons = ['📚', '❤️', '🌟', '🎯', '🔥', '🍽️', '👨‍🍳', '🎉', '🌙', '⚡']

	return (
		<div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
			{/* Sidebar */}
			<div className='lg:col-span-1'>
				<div className='bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden'>
					{/* Create Button */}
					<button
						onClick={() => setShowCreateModal(true)}
						className='w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors flex items-center justify-center gap-2'
					>
						➕ New Collection
					</button>

					{/* Collections List */}
					<div className='divide-y divide-zinc-200 dark:divide-zinc-700'>
						{collections.map((collection) => (
							<button
								key={collection.id}
								onClick={() => setActiveCollection(collection.id)}
								className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
									activeCollection === collection.id
										? 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500'
										: 'hover:bg-zinc-50 dark:hover:bg-zinc-700'
								}`}
							>
								<span className='text-xl'>{collection.icon || '📚'}</span>
								<div className='flex-1 min-w-0'>
									<p className='font-semibold text-zinc-900 dark:text-white truncate'>
										{collection.name}
									</p>
									<p className='text-xs text-zinc-600 dark:text-zinc-400'>
										{collection.recipes.length} recipes
									</p>
								</div>
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='lg:col-span-3'>
				{currentCollection ? (
					<div className='space-y-6'>
						{/* Collection Header */}
						<div className='bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6'>
							<div className='flex items-start justify-between gap-4'>
								<div>
									<div className='flex items-center gap-3 mb-3'>
										<span className='text-4xl'>{currentCollection.icon || '📚'}</span>
										<div>
											<h1 className='text-3xl font-bold text-zinc-900 dark:text-white'>
												{currentCollection.name}
											</h1>
											<p className='text-sm text-zinc-600 dark:text-zinc-400'>
												{currentCollection.description}
											</p>
										</div>
									</div>
								</div>
								<button
									onClick={() => onDeleteCollection(currentCollection.id)}
									className='px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-semibold'
								>
									🗑️ Delete
								</button>
							</div>

							{/* Stats */}
							<div className='mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700 flex gap-4'>
								<div>
									<div className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
										{collectionRecipes.length}
									</div>
									<div className='text-sm text-zinc-600 dark:text-zinc-400'>Recipes</div>
								</div>
								<div>
									<div className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
										{Math.round(
											collectionRecipes.reduce((sum, r) => sum + r.totalTime, 0) /
												collectionRecipes.length
										) || 0}
									</div>
									<div className='text-sm text-zinc-600 dark:text-zinc-400'>Avg Cook Time</div>
								</div>
							</div>

							{/* Add Recipe Button */}
							{collectionRecipes.length < recipes.length && (
								<button
									onClick={() => setShowAddRecipeModal(true)}
									className='mt-6 px-4 py-2 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg transition-colors font-semibold flex items-center gap-2'
								>
									➕ Add Recipe
								</button>
							)}
						</div>

						{/* Recipes Grid */}
						{collectionRecipes.length > 0 ? (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{collectionRecipes.map((recipe) => (
									<div
										key={recipe.slug}
										className='group bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-lg transition-all'
									>
										<Link href={`/recipe/${recipe.slug}`} className='relative aspect-video block overflow-hidden'>
											<Image
												src={recipe.image}
												alt={recipe.name}
												fill
												className='object-cover group-hover:scale-110 transition-transform'
											/>
										</Link>
										<div className='p-4'>
											<Link
												href={`/recipe/${recipe.slug}`}
												className='font-semibold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors'
											>
												{recipe.name}
											</Link>
											<p className='text-xs text-zinc-600 dark:text-zinc-400 mt-1'>
												⏱ {recipe.totalTime} min • {recipe.difficulty}
											</p>
											<button
												onClick={() =>
													onRemoveRecipeFromCollection(currentCollection.id, recipe.slug)
												}
												className='mt-3 w-full px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium'
											>
												Remove from Collection
											</button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className='text-center py-12'>
								<p className='text-lg text-zinc-600 dark:text-zinc-400 mb-4'>
									No recipes in this collection yet
								</p>
								<button
									onClick={() => setShowAddRecipeModal(true)}
									className='px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-semibold'
								>
									Add First Recipe
								</button>
							</div>
						)}
					</div>
				) : (
					<div className='text-center py-12'>
						<p className='text-lg text-zinc-600 dark:text-zinc-400 mb-4'>
							Create your first collection to get started
						</p>
						<button
							onClick={() => setShowCreateModal(true)}
							className='px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-semibold'
						>
							Create Collection
						</button>
					</div>
				)}
			</div>

			{/* Modals */}
			<Modal
				open={showCreateModal}
				onClose={() => setShowCreateModal(false)}
				title='Create New Collection'
			>
				<div className='space-y-4'>
					<div>
						<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
							Collection Name
						</label>
						<Input
							value={newCollectionName}
							onChange={(e) => setNewCollectionName(e.target.value)}
							placeholder='e.g., Weekend Dinners'
						/>
					</div>
					<div>
						<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
							Description
						</label>
						<textarea
							value={newCollectionDesc}
							onChange={(e) => setNewCollectionDesc(e.target.value)}
							placeholder='Describe this collection...'
							className='w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white'
							rows={3}
						/>
					</div>
					<div>
						<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
							Icon
						</label>
						<div className='flex gap-2 flex-wrap'>
							{icons.map((icon) => (
								<button
									key={icon}
									onClick={() => setNewCollectionIcon(icon)}
									className={`text-2xl p-2 rounded-lg transition-colors ${
										newCollectionIcon === icon
											? 'bg-orange-100 dark:bg-orange-900'
											: 'hover:bg-zinc-100 dark:hover:bg-zinc-700'
									}`}
								>
									{icon}
								</button>
							))}
						</div>
					</div>
					<div className='flex gap-3 pt-4'>
						<Button onClick={handleCreateCollection} variant='primary'>
							Create Collection
						</Button>
						<Button onClick={() => setShowCreateModal(false)} variant='outline'>
							Cancel
						</Button>
					</div>
				</div>
			</Modal>

			<Modal
				open={showAddRecipeModal}
				onClose={() => setShowAddRecipeModal(false)}
				title='Add Recipe to Collection'
			>
				<div className='max-h-96 overflow-y-auto space-y-2'>
					{recipes
						.filter((r) => !currentCollection || !currentCollection.recipes.includes(r.slug))
						.map((recipe) => (
							<button
								key={recipe.slug}
								onClick={() => {
									if (currentCollection) {
										onAddRecipeToCollection(currentCollection.id, recipe.slug)
									}
									setShowAddRecipeModal(false)
								}}
								className='w-full text-left p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors flex items-center gap-3 border border-zinc-200 dark:border-zinc-700'
							>
								<div className='relative w-12 h-12 rounded overflow-hidden flex-shrink-0'>
									<Image
										src={recipe.image}
										alt={recipe.name}
										fill
										className='object-cover'
									/>
								</div>
								<div className='flex-1 min-w-0'>
									<p className='font-semibold text-zinc-900 dark:text-white truncate'>
										{recipe.name}
									</p>
									<p className='text-xs text-zinc-600 dark:text-zinc-400'>
										⏱ {recipe.totalTime} min
									</p>
								</div>
								<span className='text-lg'>➕</span>
							</button>
						))}
				</div>
			</Modal>
		</div>
	)
}

export default CollectionsManager
