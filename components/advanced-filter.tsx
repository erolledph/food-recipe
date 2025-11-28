/**
 * Advanced Filter Component
 * Multi-select filters, sorting, and view mode options
 */

import React, { useState } from 'react'

export interface FilterOptions {
	mealTypes: string[]
	cuisines: string[]
	ingredients: string[]
	tastes: string[]
	difficulty: 'easy' | 'medium' | 'hard' | ''
	cookTimeMax: number
	prepTimeMax: number
	dietary: {
		vegetarian: boolean
		vegan: boolean
		glutenFree: boolean
		dairyFree: boolean
	}
}

export interface SortOption {
	field: 'name' | 'cookTime' | 'prepTime' | 'difficulty' | 'rating'
	direction: 'asc' | 'desc'
}

interface AdvancedFilterProps {
	onFilterChange: (filters: FilterOptions) => void
	onSortChange: (sort: SortOption) => void
	availableTags: {
		meals: string[]
		countries: string[]
		ingredients: string[]
		tastes: string[]
	}
	viewMode?: 'grid' | 'list'
	onViewModeChange?: (mode: 'grid' | 'list') => void
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
	onFilterChange,
	onSortChange,
	availableTags,
	viewMode = 'grid',
	onViewModeChange,
}) => {
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

	const [sortOption, setSortOption] = useState<SortOption>({
		field: 'name',
		direction: 'asc',
	})

	const [expandedSections, setExpandedSections] = useState({
		mealTypes: true,
		cuisines: false,
		ingredients: false,
		difficulty: false,
		time: false,
		dietary: false,
		sort: false,
	})

	const toggleSection = (section: keyof typeof expandedSections) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}))
	}

	const handleFilterChange = (newFilters: FilterOptions) => {
		setFilters(newFilters)
		onFilterChange(newFilters)
	}

	const handleSortChange = (newSort: SortOption) => {
		setSortOption(newSort)
		onSortChange(newSort)
	}

	const toggleArrayFilter = (key: keyof Pick<FilterOptions, 'mealTypes' | 'cuisines' | 'ingredients' | 'tastes'>, value: string) => {
		const currentValues = filters[key]
		const newValues = currentValues.includes(value)
			? currentValues.filter((v) => v !== value)
			: [...currentValues, value]

		handleFilterChange({
			...filters,
			[key]: newValues,
		})
	}

	const toggleDietary = (key: keyof FilterOptions['dietary']) => {
		handleFilterChange({
			...filters,
			dietary: {
				...filters.dietary,
				[key]: !filters.dietary[key],
			},
		})
	}

	const resetFilters = () => {
		const defaultFilters: FilterOptions = {
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
		}
		setFilters(defaultFilters)
		onFilterChange(defaultFilters)
	}

	const activeFilterCount = [
		filters.mealTypes.length,
		filters.cuisines.length,
		filters.ingredients.length,
		filters.tastes.length,
		filters.difficulty ? 1 : 0,
		Object.values(filters.dietary).filter(Boolean).length,
	].reduce((a, b) => a + b, 0)

	return (
		<div className='bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700'>
			{/* Filter Header */}
			<div className='p-6 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<h2 className='font-bold text-zinc-900 dark:text-white'>Filters</h2>
					{activeFilterCount > 0 && (
						<span className='px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full'>
							{activeFilterCount}
						</span>
					)}
				</div>
				{activeFilterCount > 0 && (
					<button
						onClick={resetFilters}
						className='text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 font-semibold transition-colors'
					>
						Reset All
					</button>
				)}
			</div>

			{/* View Mode Toggle */}
			{onViewModeChange && (
				<div className='px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 flex gap-2'>
					<button
						onClick={() => onViewModeChange('grid')}
						className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
							viewMode === 'grid'
								? 'bg-orange-500 text-white'
								: 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-200'
						}`}
					>
						Grid
					</button>
					<button
						onClick={() => onViewModeChange('list')}
						className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
							viewMode === 'list'
								? 'bg-orange-500 text-white'
								: 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-200'
						}`}
					>
						List
					</button>
				</div>
			)}

			<div className='space-y-0'>
				{/* Meal Types */}
				<FilterSection
					title='Meal Type'
					expanded={expandedSections.mealTypes}
					onToggle={() => toggleSection('mealTypes')}
					count={filters.mealTypes.length}
				>
					<div className='grid grid-cols-2 gap-2'>
						{availableTags.meals.map((meal) => (
							<label key={meal} className='flex items-center gap-2 cursor-pointer'>
								<input
									type='checkbox'
									checked={filters.mealTypes.includes(meal)}
									onChange={() => toggleArrayFilter('mealTypes', meal)}
									className='w-4 h-4 rounded text-orange-500'
								/>
								<span className='text-sm text-zinc-700 dark:text-zinc-300'>{meal}</span>
							</label>
						))}
					</div>
				</FilterSection>

				{/* Cuisines */}
				<FilterSection
					title='Cuisine'
					expanded={expandedSections.cuisines}
					onToggle={() => toggleSection('cuisines')}
					count={filters.cuisines.length}
				>
					<div className='grid grid-cols-2 gap-2'>
						{availableTags.countries.map((country) => (
							<label key={country} className='flex items-center gap-2 cursor-pointer'>
								<input
									type='checkbox'
									checked={filters.cuisines.includes(country)}
									onChange={() => toggleArrayFilter('cuisines', country)}
									className='w-4 h-4 rounded text-orange-500'
								/>
								<span className='text-sm text-zinc-700 dark:text-zinc-300'>{country}</span>
							</label>
						))}
					</div>
				</FilterSection>

				{/* Difficulty */}
				<FilterSection
					title='Difficulty'
					expanded={expandedSections.difficulty}
					onToggle={() => toggleSection('difficulty')}
					count={filters.difficulty ? 1 : 0}
				>
					<div className='space-y-2'>
						{(['easy', 'medium', 'hard'] as const).map((level) => (
							<label key={level} className='flex items-center gap-2 cursor-pointer'>
								<input
									type='radio'
									name='difficulty'
									checked={filters.difficulty === level}
									onChange={() => handleFilterChange({ ...filters, difficulty: level })}
									className='w-4 h-4 text-orange-500'
								/>
								<span className='text-sm text-zinc-700 dark:text-zinc-300 capitalize'>{level}</span>
							</label>
						))}
						<label className='flex items-center gap-2 cursor-pointer'>
							<input
								type='radio'
								name='difficulty'
								checked={filters.difficulty === ''}
								onChange={() => handleFilterChange({ ...filters, difficulty: '' })}
								className='w-4 h-4 text-orange-500'
							/>
							<span className='text-sm text-zinc-700 dark:text-zinc-300'>All Levels</span>
						</label>
					</div>
				</FilterSection>

				{/* Cook Time */}
				<FilterSection
					title='Cook Time'
					expanded={expandedSections.time}
					onToggle={() => toggleSection('time')}
				>
					<div className='space-y-3'>
						<div>
							<label className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 block mb-2'>
								Max Cook Time: {filters.cookTimeMax} minutes
							</label>
							<input
								type='range'
								min='5'
								max='180'
								step='5'
								value={filters.cookTimeMax}
								onChange={(e) =>
									handleFilterChange({ ...filters, cookTimeMax: parseInt(e.target.value) })
								}
								className='w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500'
							/>
						</div>
					</div>
				</FilterSection>

				{/* Dietary */}
				<FilterSection
					title='Dietary'
					expanded={expandedSections.dietary}
					onToggle={() => toggleSection('dietary')}
					count={Object.values(filters.dietary).filter(Boolean).length}
				>
					<div className='space-y-2'>
						{(['vegetarian', 'vegan', 'glutenFree', 'dairyFree'] as const).map((dietary) => (
							<label key={dietary} className='flex items-center gap-2 cursor-pointer'>
								<input
									type='checkbox'
									checked={filters.dietary[dietary]}
									onChange={() => toggleDietary(dietary)}
									className='w-4 h-4 rounded text-orange-500'
								/>
								<span className='text-sm text-zinc-700 dark:text-zinc-300 capitalize'>
									{dietary.replace(/([A-Z])/g, ' $1').trim()}
								</span>
							</label>
						))}
					</div>
				</FilterSection>

				{/* Sort */}
				<FilterSection
					title='Sort By'
					expanded={expandedSections.sort}
					onToggle={() => toggleSection('sort')}
				>
					<div className='space-y-2'>
						{(['name', 'cookTime', 'prepTime', 'difficulty', 'rating'] as const).map((field) => (
							<label key={field} className='flex items-center gap-2 cursor-pointer'>
								<input
									type='radio'
									name='sort'
									checked={sortOption.field === field}
									onChange={() => handleSortChange({ field, direction: 'asc' })}
									className='w-4 h-4 text-orange-500'
								/>
								<span className='text-sm text-zinc-700 dark:text-zinc-300 capitalize'>
									{field.replace(/([A-Z])/g, ' $1').trim()}
								</span>
							</label>
						))}
					</div>
				</FilterSection>
			</div>
		</div>
	)
}

interface FilterSectionProps {
	title: string
	children: React.ReactNode
	expanded: boolean
	onToggle: () => void
	count?: number
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, expanded, onToggle, count }) => (
	<div className='border-b border-zinc-200 dark:border-zinc-700 last:border-b-0'>
		<button
			onClick={onToggle}
			className='w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors'
		>
			<div className='flex items-center gap-2'>
				<h3 className='font-semibold text-zinc-900 dark:text-white'>{title}</h3>
				{count !== undefined && count > 0 && (
					<span className='text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full'>
						{count}
					</span>
				)}
			</div>
			<span className={`text-zinc-600 dark:text-zinc-400 transition-transform ${expanded ? 'rotate-180' : ''}`}>
				▼
			</span>
		</button>

		{expanded && <div className='px-6 py-4 bg-zinc-50 dark:bg-zinc-700/30'>{children}</div>}
	</div>
)

export default AdvancedFilter
