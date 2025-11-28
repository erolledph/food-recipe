/**
 * Advanced useRecipes Hook with Performance Optimizations
 * Handles recipe data, caching, filtering, and user preferences
 * Provides memoized results for optimal React rendering
 */

import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { Recipe, SearchFilters, DifficultyLevel } from '@/lib/types'

// Local storage keys
const STORAGE_KEYS = {
	FAVORITES: 'recipe_favorites',
	COOKING_HISTORY: 'cooking_history',
	USER_PREFERENCES: 'user_preferences',
	LAST_VIEWED: 'last_viewed_recipes',
}

interface RecipeHookState {
	recipes: Recipe[]
	favorites: Set<string>
	cookingHistory: Record<string, Date>
	lastViewed: string[]
	preferences: UserPreferences
	loading: boolean
	error: Error | null
}

interface UserPreferences {
	vegan: boolean
	glutenFree: boolean
	spiceLevel: 'low' | 'medium' | 'high'
	preferredCookTime: number // in minutes
	preferredDifficulty: DifficultyLevel | null
}

const INITIAL_PREFERENCES: UserPreferences = {
	vegan: false,
	glutenFree: false,
	spiceLevel: 'medium',
	preferredCookTime: 30,
	preferredDifficulty: null,
}

export function useRecipes(initialRecipes: Recipe[] = []) {
	const [state, setState] = useState<RecipeHookState>({
		recipes: initialRecipes,
		favorites: new Set(),
		cookingHistory: {},
		lastViewed: [],
		preferences: INITIAL_PREFERENCES,
		loading: false,
		error: null,
	})

	// Use ref to track initialization
	const initialized = useRef(false)

	// Initialize from localStorage on mount
	useEffect(() => {
		if (initialized.current) return

		const favorites = new Set(
			JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]')
		)
		const cookingHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.COOKING_HISTORY) || '{}')
		const preferences = JSON.parse(
			localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES) || '{}'
		)
		const lastViewed = JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_VIEWED) || '[]')

		setState((prev) => ({
			...prev,
			favorites,
			cookingHistory,
			preferences: { ...INITIAL_PREFERENCES, ...preferences },
			lastViewed,
		}))

		initialized.current = true
	}, [])

	// Persist state changes
	const persistState = useCallback((key: string, value: any) => {
		localStorage.setItem(key, JSON.stringify(Array.from(value)))
	}, [])

	const toggleFavorite = useCallback((slug: string) => {
		setState((prev) => {
			const newFavorites = new Set(prev.favorites)
			if (newFavorites.has(slug)) {
				newFavorites.delete(slug)
			} else {
				newFavorites.add(slug)
			}

			persistState(STORAGE_KEYS.FAVORITES, newFavorites)
			return { ...prev, favorites: newFavorites }
		})
	}, [persistState])

	const isFavorite = useCallback((slug: string) => {
		return state.favorites.has(slug)
	}, [state.favorites])

	const addToHistory = useCallback((slug: string, rating?: number) => {
		setState((prev) => {
			const newHistory = { ...prev.cookingHistory }
			newHistory[slug] = new Date()

			persistState(STORAGE_KEYS.COOKING_HISTORY, newHistory)
			return { ...prev, cookingHistory: newHistory }
		})
	}, [persistState])

	const trackViewedRecipe = useCallback((slug: string) => {
		setState((prev) => {
			const newLastViewed = [slug, ...prev.lastViewed.filter((s) => s !== slug)].slice(0, 10)

			persistState(STORAGE_KEYS.LAST_VIEWED, newLastViewed)
			return { ...prev, lastViewed: newLastViewed }
		})
	}, [persistState])

	const updatePreferences = useCallback((prefs: Partial<UserPreferences>) => {
		setState((prev) => {
			const newPrefs = { ...prev.preferences, ...prefs }
			persistState(STORAGE_KEYS.USER_PREFERENCES, newPrefs)
			return { ...prev, preferences: newPrefs }
		})
	}, [persistState])

	const getFavoriteRecipes = useCallback((): Recipe[] => {
		return state.recipes.filter((r) => state.favorites.has(r.slug))
	}, [state.recipes, state.favorites])

	const getRecentlyViewed = useCallback((): Recipe[] => {
		return state.lastViewed
			.map((slug) => state.recipes.find((r) => r.slug === slug))
			.filter((r): r is Recipe => r !== undefined)
	}, [state.recipes, state.lastViewed])

	const getFilteredRecipes = useCallback(
		(filters: SearchFilters): Recipe[] => {
			let filtered = state.recipes

			if (filters.query) {
				const query = filters.query.toLowerCase()
				filtered = filtered.filter(
					(recipe) =>
						recipe.name.toLowerCase().includes(query) ||
						recipe.description.toLowerCase().includes(query) ||
						recipe.tags.ingredient.some((ing) => ing.toLowerCase().includes(query)) ||
						recipe.tags.meat.toLowerCase().includes(query) ||
						recipe.tags.taste.some((taste) => taste.toLowerCase().includes(query)) ||
						recipe.tags.country.toLowerCase().includes(query) ||
						recipe.tags.meal.toLowerCase().includes(query)
				)
			}

			if (filters.difficulty) {
				filtered = filtered.filter((r) => r.difficulty === filters.difficulty)
			}

			if (filters.mealType) {
				filtered = filtered.filter((r) => r.tags.meal === filters.mealType)
			}

			if (filters.cookTime?.max) {
				filtered = filtered.filter((r) => r.totalTime <= filters.cookTime!.max)
			}

			if (filters.cookTime?.min) {
				filtered = filtered.filter((r) => r.totalTime >= filters.cookTime!.min)
			}

			if (filters.ingredient?.length) {
				filtered = filtered.filter((r) =>
					filters.ingredient!.some((ing) =>
						r.tags.ingredient.some((i) => i.toLowerCase() === ing.toLowerCase())
					)
				)
			}

			if (filters.country) {
				filtered = filtered.filter((r) => r.tags.country === filters.country)
			}

			if (filters.isVegan) {
				filtered = filtered.filter((r) => r.isVegan === true)
			}

			if (filters.isGlutenFree) {
				filtered = filtered.filter((r) => r.isGlutenFree === true)
			}

			// Sort results
			if (filters.sortBy) {
				filtered.sort((a, b) => {
					let aVal: any = a[filters.sortBy as keyof Recipe]
					let bVal: any = b[filters.sortBy as keyof Recipe]

					if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1
					if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1
					return 0
				})
			}

			return filtered
		},
		[state.recipes]
	)

	const getRecommendedRecipes = useCallback(
		(limit: number = 5): Recipe[] => {
			// Score recipes based on user preferences
			const scored = state.recipes.map((recipe) => {
				let score = 0

				if (state.preferences.vegan && recipe.isVegan) score += 10
				if (state.preferences.glutenFree && recipe.isGlutenFree) score += 10
				if (recipe.totalTime <= state.preferences.preferredCookTime) score += 5
				if (recipe.difficulty === state.preferences.preferredDifficulty) score += 5
				if (recipe.rating && recipe.rating > 4) score += 3

				// Boost recently viewed recipes
				if (state.lastViewed.includes(recipe.slug)) score += 2

				return { recipe, score }
			})

			return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.recipe)
		},
		[state.recipes, state.preferences, state.lastViewed]
	)

	// Memoized tag extraction
	const getAllTags = useCallback(
		(): {
			meals: string[]
			ingredients: string[]
			meats: string[]
			tastes: string[]
			countries: string[]
		} => {
			const tags = {
				meals: new Set<string>(),
				ingredients: new Set<string>(),
				meats: new Set<string>(),
				tastes: new Set<string>(),
				countries: new Set<string>(),
			}

			state.recipes.forEach((recipe) => {
				tags.meals.add(recipe.tags.meal)
				recipe.tags.ingredient.forEach((ing) => tags.ingredients.add(ing))
				if (recipe.tags.meat && recipe.tags.meat !== 'None') {
					tags.meats.add(recipe.tags.meat)
				}
				recipe.tags.taste.forEach((taste) => tags.tastes.add(taste))
				tags.countries.add(recipe.tags.country)
			})

			return {
				meals: Array.from(tags.meals).sort(),
				ingredients: Array.from(tags.ingredients).sort(),
				meats: Array.from(tags.meats).sort(),
				tastes: Array.from(tags.tastes).sort(),
				countries: Array.from(tags.countries).sort(),
			}
		},
		[state.recipes]
	)

	const getRecipeStats = useMemo(() => {
		const stats = {
			total: state.recipes.length,
			avgCookTime: 0,
			avgRating: 0,
			byDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
			byCountry: {} as Record<string, number>,
		}

		state.recipes.forEach((recipe) => {
			stats.avgCookTime += recipe.totalTime
			stats.avgRating += recipe.rating || 0
			stats.byDifficulty[recipe.difficulty as DifficultyLevel]++
			stats.byCountry[recipe.tags.country] = (stats.byCountry[recipe.tags.country] || 0) + 1
		})

		stats.avgCookTime = Math.round(stats.avgCookTime / state.recipes.length)
		stats.avgRating = Math.round((stats.avgRating / state.recipes.length) * 10) / 10

		return stats
	}, [state.recipes])

	return {
		// Data
		recipes: state.recipes,
		favorites: Array.from(state.favorites),
		preferences: state.preferences,
		loading: state.loading,
		error: state.error,

		// Methods
		toggleFavorite,
		isFavorite,
		addToHistory,
		trackViewedRecipe,
		updatePreferences,
		getFavoriteRecipes,
		getRecentlyViewed,
		getFilteredRecipes,
		getRecommendedRecipes,
		getAllTags,
		getRecipeStats,
	}
}
