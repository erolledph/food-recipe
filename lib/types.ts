/**
 * Core Type Definitions
 * Enterprise-grade type safety and consistency
 */

export interface Recipe {
	slug: string
	name: string
	description: string
	servings: number
	cookTime: number
	prepTime: number
	totalTime: number
	difficulty: DifficultyLevel
	image: string
	tags: RecipeTags
	ingredients: Ingredient[]
	instructions: CookingStep[]
	author?: string
	createdAt?: Date
	updatedAt?: Date
	rating?: number
	reviews?: RecipeReview[]
	nutritionInfo?: NutritionInfo
	isVegan?: boolean
	isGlutenFree?: boolean
	isSpicy?: boolean
}

export interface RecipeTags {
	meal: string
	ingredient: string[]
	meat: string
	sideDish: boolean
	taste: string[]
	country: string
}

export interface Ingredient {
	name: string
	amount: number
	unit: string
	notes?: string
}

export interface CookingStep {
	order: number
	instruction: string
	timeInMinutes?: number
	tips?: string[]
}

export interface NutritionInfo {
	calories: number
	protein: number
	carbs: number
	fat: number
	fiber: number
}

export interface RecipeReview {
	id: string
	rating: number
	comment: string
	author: string
	createdAt: Date
}

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard'

export interface User {
	id: string
	email: string
	name: string
	role: UserRole
	createdAt: Date
	favorites: string[]
	cookingHistory: CookingHistory[]
}

export type UserRole = 'admin' | 'user' | 'guest'

export interface CookingHistory {
	recipeSlug: string
	cookedAt: Date
	rating?: number
	notes?: string
}

export interface SearchFilters {
	query?: string
	difficulty?: DifficultyLevel
	mealType?: string
	cookTime?: {
		min: number
		max: number
	}
	ingredient?: string[]
	country?: string
	isVegan?: boolean
	isGlutenFree?: boolean
	isSpicy?: boolean
	sortBy?: 'name' | 'cookTime' | 'rating' | 'createdAt'
	sortOrder?: 'asc' | 'desc'
}

export interface ApiResponse<T> {
	success: boolean
	data?: T
	error?: ApiError
	meta?: {
		timestamp: number
		requestId: string
	}
}

export interface ApiError {
	code: string
	message: string
	details?: Record<string, any>
	statusCode: number
}

export interface PaginationMeta {
	total: number
	page: number
	pageSize: number
	totalPages: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
	pagination?: PaginationMeta
}
