/**
 * Recipe Service Layer
 * Handles all recipe-related business logic and data operations
 * Provides a clean abstraction between UI and API
 */

import { Recipe, SearchFilters, PaginatedResponse, ApiResponse } from '@/lib/types'
import { apiClient } from './api-client'

class RecipeService {
	private readonly cacheConfig = { ttl: 10 * 60 * 1000 } // 10 minutes

	/**
	 * Get all recipes with advanced filtering and pagination
	 */
	async getRecipes(
		filters?: SearchFilters,
		page: number = 1,
		pageSize: number = 12
	): Promise<PaginatedResponse<Recipe>> {
		const queryParams = new URLSearchParams()

		if (filters?.query) queryParams.append('q', filters.query)
		if (filters?.difficulty) queryParams.append('difficulty', filters.difficulty)
		if (filters?.mealType) queryParams.append('mealType', filters.mealType)
		if (filters?.country) queryParams.append('country', filters.country)
		if (filters?.isVegan) queryParams.append('vegan', 'true')
		if (filters?.isGlutenFree) queryParams.append('glutenFree', 'true')
		if (filters?.ingredient?.length) queryParams.append('ingredients', filters.ingredient.join(','))

		queryParams.append('page', page.toString())
		queryParams.append('pageSize', pageSize.toString())
		queryParams.append('sort', filters?.sortBy || 'name')
		queryParams.append('order', filters?.sortOrder || 'asc')

		return apiClient.get<PaginatedResponse<Recipe>>(`/api/recipes?${queryParams.toString()}`, {
			cache: this.cacheConfig,
		})
	}

	/**
	 * Get a single recipe by slug
	 */
	async getRecipeBySlug(slug: string): Promise<ApiResponse<Recipe>> {
		return apiClient.get<ApiResponse<Recipe>>(`/api/recipes/${slug}`, {
			cache: this.cacheConfig,
		})
	}

	/**
	 * Create a new recipe (admin only)
	 */
	async createRecipe(recipe: Omit<Recipe, 'slug'>): Promise<ApiResponse<Recipe>> {
		// Clear recipes cache when creating new one
		apiClient.clearCache()

		return apiClient.post<ApiResponse<Recipe>>('/api/recipes', recipe)
	}

	/**
	 * Update an existing recipe (admin only)
	 */
	async updateRecipe(slug: string, updates: Partial<Recipe>): Promise<ApiResponse<Recipe>> {
		apiClient.clearCache()

		return apiClient.put<ApiResponse<Recipe>>(`/api/recipes/${slug}`, updates)
	}

	/**
	 * Delete a recipe (admin only)
	 */
	async deleteRecipe(slug: string): Promise<ApiResponse<void>> {
		apiClient.clearCache()

		return apiClient.delete<ApiResponse<void>>(`/api/recipes/${slug}`)
	}

	/**
	 * Get recipe recommendations based on user preferences
	 */
	async getRecommendedRecipes(
		preferences: {
			difficulty?: string
			cookTime?: number
			ingredients?: string[]
		},
		limit: number = 5
	): Promise<ApiResponse<Recipe[]>> {
		return apiClient.get<ApiResponse<Recipe[]>>('/api/recipes/recommendations', {
			cache: this.cacheConfig,
		})
	}

	/**
	 * Search recipes with full-text search
	 */
	async searchRecipes(query: string): Promise<ApiResponse<Recipe[]>> {
		return apiClient.get<ApiResponse<Recipe[]>>(`/api/recipes/search?q=${encodeURIComponent(query)}`, {
			cache: { ttl: 5 * 60 * 1000 },
		})
	}

	/**
	 * Get trending recipes
	 */
	async getTrendingRecipes(limit: number = 10): Promise<ApiResponse<Recipe[]>> {
		return apiClient.get<ApiResponse<Recipe[]>>(`/api/recipes/trending?limit=${limit}`, {
			cache: { ttl: 30 * 60 * 1000 }, // 30 minutes
		})
	}

	/**
	 * Get recipes by category
	 */
	async getRecipesByCategory(category: string): Promise<ApiResponse<Recipe[]>> {
		return apiClient.get<ApiResponse<Recipe[]>>(`/api/recipes/category/${category}`, {
			cache: this.cacheConfig,
		})
	}

	/**
	 * Rate a recipe
	 */
	async rateRecipe(slug: string, rating: number, comment?: string): Promise<ApiResponse<Recipe>> {
		return apiClient.post<ApiResponse<Recipe>>(`/api/recipes/${slug}/rate`, {
			rating,
			comment,
		})
	}

	/**
	 * Get recipe statistics
	 */
	async getRecipeStats(): Promise<
		ApiResponse<{
			total: number
			byDifficulty: Record<string, number>
			byCountry: Record<string, number>
			avgCookTime: number
		}>
	> {
		return apiClient.get('/api/recipes/stats', {
			cache: { ttl: 1 * 60 * 60 * 1000 }, // 1 hour
		})
	}
}

export const recipeService = new RecipeService()
