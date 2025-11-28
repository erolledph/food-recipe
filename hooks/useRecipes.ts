import { useEffect, useState } from 'react'

export interface Recipe {
	slug: string
	name: string
	description: string
	servings: number
	cookTime: number
	prepTime: number
	totalTime: number
	difficulty: string
	image: string
	tags: {
		meal: string
		ingredient: string[]
		meat: string
		sideDish: boolean
		taste: string[]
		country: string
	}
	ingredients: string[]
	instructions: string[]
}

const RECIPES: Recipe[] = [
	{
		slug: 'korean-kimchi-fermented-vegetables',
		name: 'Kimchi',
		description: 'Korean fermented vegetable dish with spicy kick',
		servings: 4,
		cookTime: 20,
		prepTime: 30,
		totalTime: 50,
		difficulty: 'Easy',
		image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=60',
		tags: {
			meal: 'Side Dish',
			ingredient: ['Cabbage', 'Garlic', 'Ginger'],
			meat: 'None',
			sideDish: true,
			taste: ['Spicy', 'Salty'],
			country: 'Korea',
		},
		ingredients: [
			'1 kg napa cabbage',
			'4 tbsp gochugaru (Korean red chili powder)',
			'6 cloves garlic, minced',
			'1 tbsp ginger, minced',
			'3 tbsp fish sauce',
			'2 tbsp salt',
			'2 green onions, chopped',
		],
		instructions: [
			'Cut cabbage into quarters and soak in salt water for 2 hours',
			'Rinse thoroughly and drain',
			'Mix gochugaru, garlic, ginger, fish sauce, and green onions',
			'Apply mixture between cabbage leaves',
			'Pack into jar and let ferment at room temperature for 3-5 days',
		],
	},
	{
		slug: 'filipino-chicken-adobo-the-easy-way',
		name: 'Filipino Chicken Adobo',
		description: 'Traditional Filipino stew with chicken, soy sauce, and vinegar',
		servings: 4,
		cookTime: 40,
		prepTime: 15,
		totalTime: 55,
		difficulty: 'Easy',
		image: 'https://images.unsplash.com/photo-1611339555312-e607c90352fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=60',
		tags: {
			meal: 'Lunch',
			ingredient: ['Soy Sauce', 'Vinegar', 'Garlic'],
			meat: 'Chicken',
			sideDish: false,
			taste: ['Savory', 'Tangy'],
			country: 'Philippines',
		},
		ingredients: [
			'1 kg chicken, cut into pieces',
			'1/2 cup soy sauce',
			'1/4 cup vinegar',
			'8 cloves garlic, minced',
			'1 onion, sliced',
			'4 bay leaves',
			'1 tsp black pepper',
			'2 tbsp oil',
			'1 cup water',
		],
		instructions: [
			'Heat oil in a pan and sauté garlic and onion',
			'Add chicken and brown on all sides',
			'Add soy sauce, vinegar, bay leaves, and pepper',
			'Add water and bring to boil',
			'Lower heat and simmer for 30 minutes until chicken is tender',
		],
	},
	{
		slug: 'thai-pad-thai-stir-fried-noodles',
		name: 'Pad Thai',
		description: 'Popular Thai stir-fried noodles with shrimp and peanuts',
		servings: 2,
		cookTime: 15,
		prepTime: 20,
		totalTime: 35,
		difficulty: 'Easy',
		image: 'https://images.unsplash.com/photo-1559314809-0d2706b612fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=60',
		tags: {
			meal: 'Lunch',
			ingredient: ['Shrimp', 'Peanuts', 'Lime'],
			meat: 'Shrimp',
			sideDish: false,
			taste: ['Sweet', 'Salty', 'Tangy'],
			country: 'Thailand',
		},
		ingredients: [
			'250g rice noodles',
			'200g shrimp',
			'2 eggs',
			'3 tbsp tamarind paste',
			'3 tbsp fish sauce',
			'2 tbsp palm sugar',
			'3 cloves garlic, minced',
			'2 cups beansprouts',
			'3 green onions, chopped',
			'1/4 cup peanuts, crushed',
			'3 tbsp vegetable oil',
		],
		instructions: [
			'Soak rice noodles in warm water until soft, then drain',
			'Heat oil in a wok and stir-fry garlic',
			'Add shrimp and cook until pink',
			'Push ingredients to side, crack egg into wok and scramble',
			'Add noodles, tamarind paste, fish sauce, and sugar',
			'Toss everything together for 3-4 minutes',
			'Add beansprouts and green onions, toss lightly',
		],
	},
	{
		slug: 'thai-tom-yum-goong-spicy-soup',
		name: 'Tom Yum Goong',
		description: 'Spicy and sour Thai shrimp soup',
		servings: 4,
		cookTime: 20,
		prepTime: 15,
		totalTime: 35,
		difficulty: 'Medium',
		image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=60',
		tags: {
			meal: 'Lunch',
			ingredient: ['Shrimp', 'Lemongrass', 'Galangal'],
			meat: 'Shrimp',
			sideDish: false,
			taste: ['Spicy', 'Sour'],
			country: 'Thailand',
		},
		ingredients: [
			'1 liter chicken broth',
			'400g shrimp',
			'4 lemongrass stalks, bruised',
			'3 galangal slices',
			'4 kaffir lime leaves',
			'3-5 Thai red chilies',
			'3 tbsp fish sauce',
			'4 tbsp lime juice',
			'200g mushrooms, sliced',
			'1 onion, sliced',
			'Cilantro for garnish',
		],
		instructions: [
			'Bring broth to boil',
			'Add lemongrass, galangal, lime leaves, and chilies',
			'Simmer for 5 minutes',
			'Add mushrooms and onion, simmer for 5 minutes',
			'Add shrimp and cook for 3 minutes',
			'Add fish sauce and lime juice',
			'Taste and adjust seasonings',
		],
	},
	{
		slug: 'japanese-gyoza-pan-fried-dumplings',
		name: 'Gyoza - Japanese Dumplings',
		description: 'Pan-fried Japanese dumplings with pork and cabbage',
		servings: 4,
		cookTime: 20,
		prepTime: 30,
		totalTime: 50,
		difficulty: 'Medium',
		image: 'https://images.unsplash.com/photo-1563339158-8fd0a1aba55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=60',
		tags: {
			meal: 'Lunch',
			ingredient: ['Pork', 'Cabbage', 'Soy Sauce'],
			meat: 'Pork',
			sideDish: false,
			taste: ['Savory', 'Salty'],
			country: 'Japan',
		},
		ingredients: [
			'24 gyoza wrappers',
			'200g ground pork',
			'1 cup cabbage, finely chopped',
			'3 cloves garlic, minced',
			'1 tbsp soy sauce',
			'1 tsp sesame oil',
			'1 green onion, chopped',
			'Water for sealing and cooking',
			'Vegetable oil for pan-frying',
		],
		instructions: [
			'Mix pork, cabbage, garlic, soy sauce, sesame oil, and green onion',
			'Place 1 tsp filling on each wrapper',
			'Wet edge with water, fold and pleat',
			'Heat oil in a pan and place gyoza flat side down',
			'Cook until golden (about 3 minutes)',
			'Add 1/4 cup water and cover with lid',
			'Steam for 6-8 minutes until wrappers are translucent',
		],
	},
	{
		slug: 'korean-bibimbap-rice-bowl',
		name: 'Bibimbap',
		description: 'Korean rice bowl with vegetables, meat, and egg',
		servings: 2,
		cookTime: 20,
		prepTime: 20,
		totalTime: 40,
		difficulty: 'Medium',
		image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=60',
		tags: {
			meal: 'Lunch',
			ingredient: ['Beef', 'Egg', 'Spinach'],
			meat: 'Beef',
			sideDish: false,
			taste: ['Savory', 'Spicy'],
			country: 'Korea',
		},
		ingredients: [
			'2 cups cooked rice',
			'200g ground beef',
			'2 cups spinach',
			'1 cup carrots, julienned',
			'1 cup zucchini, julienned',
			'1 cup mushrooms, sliced',
			'2 eggs',
			'3 tbsp gochujang (Korean red chili paste)',
			'1 tbsp sesame oil',
			'2 tbsp soy sauce',
			'2 cloves garlic, minced',
		],
		instructions: [
			'Heat oil and stir-fry beef with garlic and 1 tbsp soy sauce until cooked',
			'Blanch spinach and drain well',
			'Stir-fry each vegetable separately with a pinch of salt',
			'Fry eggs sunny-side up',
			'Arrange rice in bowls, top with vegetables and beef',
			'Mix gochujang with sesame oil and remaining soy sauce',
			'Place fried egg on top and drizzle sauce',
		],
	},
	{
		slug: 'indonesian-satay-grilled-skewers',
		name: 'Satay - Indonesian Skewers',
		description: 'Grilled meat skewers with peanut sauce',
		servings: 4,
		cookTime: 15,
		prepTime: 30,
		totalTime: 45,
		difficulty: 'Easy',
		image: 'https://images.unsplash.com/photo-1585238341710-4913cc00d82a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=60',
		tags: {
			meal: 'Lunch',
			ingredient: ['Chicken', 'Peanut', 'Turmeric'],
			meat: 'Chicken',
			sideDish: false,
			taste: ['Savory', 'Spicy'],
			country: 'Indonesia',
		},
		ingredients: [
			'600g chicken breast, cut into strips',
			'3 tbsp soy sauce',
			'2 tbsp lime juice',
			'2 tbsp brown sugar',
			'1 tsp turmeric',
			'3 cloves garlic, minced',
			'Wooden skewers, soaked',
			'1 cup peanut butter',
			'1/2 cup coconut milk',
			'1 tbsp chili paste',
		],
		instructions: [
			'Mix soy sauce, lime juice, sugar, turmeric, and garlic',
			'Marinate chicken for 30 minutes',
			'Thread chicken onto skewers',
			'Grill or broil for 8-10 minutes, turning occasionally',
			'Mix peanut butter, coconut milk, soy sauce, lime juice, sugar, garlic, and chili paste',
			'Serve skewers with peanut sauce',
		],
	},
	{
		slug: 'japanese-miso-soup-comfort',
		name: 'Miso Soup',
		description: 'Japanese comfort soup with tofu and seaweed',
		servings: 2,
		cookTime: 10,
		prepTime: 10,
		totalTime: 20,
		difficulty: 'Easy',
		image: 'https://images.unsplash.com/photo-1585518419759-4ba479db6b92?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=60',
		tags: {
			meal: 'Breakfast',
			ingredient: ['Tofu', 'Miso', 'Seaweed'],
			meat: 'None',
			sideDish: true,
			taste: ['Salty', 'Umami'],
			country: 'Japan',
		},
		ingredients: [
			'4 cups dashi broth',
			'3 tbsp miso paste',
			'150g tofu, cubed',
			'1 sheet nori (seaweed), cut into strips',
			'2 green onions, sliced',
			'Small handful of wakame seaweed',
		],
		instructions: [
			'Heat dashi broth in a pot (don&apos;t boil)',
			'Add tofu and wakame, heat gently',
			'Dissolve miso paste in a small ladle with warm broth',
			'Pour miso mixture into the pot and stir gently',
			'Do not boil after adding miso',
			'Add green onions just before serving',
		],
	},
	{
		slug: 'malaysian-laksa-curry-noodles',
		name: 'Laksa',
		description: 'Malaysian coconut curry noodle soup with rich flavors',
		servings: 4,
		cookTime: 30,
		prepTime: 20,
		totalTime: 50,
		difficulty: 'Medium',
		image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=60',
		tags: {
			meal: 'Lunch',
			ingredient: ['Coconut Milk', 'Shrimp', 'Noodles'],
			meat: 'Shrimp',
			sideDish: false,
			taste: ['Spicy', 'Creamy'],
			country: 'Malaysia',
		},
		ingredients: [
			'400g rice noodles',
			'400ml coconut milk',
			'500ml chicken broth',
			'300g shrimp',
			'4 tbsp laksa paste',
			'2 tbsp vegetable oil',
			'100g fish cake, sliced',
			'2 cups beansprouts',
			'Cilantro for garnish',
			'Lime for serving',
		],
		instructions: [
			'Heat oil and fry laksa paste for 2 minutes',
			'Add coconut milk and broth, simmer for 10 minutes',
			'Add fish cake and shrimp, cook for 5 minutes',
			'Cook noodles separately and divide into bowls',
			'Pour hot laksa broth over noodles',
			'Top with beansprouts and cilantro',
			'Serve with lime wedge',
		],
	},
	{
		slug: 'filipino-lumpia-spring-rolls',
		name: 'Lumpia - Filipino Spring Rolls',
		description: 'Crispy Filipino egg rolls filled with meat and vegetables',
		servings: 4,
		cookTime: 20,
		prepTime: 25,
		totalTime: 45,
		difficulty: 'Medium',
		image: 'https://images.unsplash.com/photo-1559329007-40790c9fdf4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=60',
		tags: {
			meal: 'Appetizer',
			ingredient: ['Pork', 'Cabbage', 'Carrot'],
			meat: 'Pork',
			sideDish: true,
			taste: ['Savory', 'Crispy'],
			country: 'Philippines',
		},
		ingredients: [
			'16 lumpia wrappers',
			'200g ground pork',
			'1 cup cabbage, finely chopped',
			'1/2 cup carrot, julienned',
			'4 cloves garlic, minced',
			'1 onion, finely chopped',
			'2 tbsp soy sauce',
			'Oil for frying',
			'Water for sealing',
		],
		instructions: [
			'Heat oil and sauté garlic and onion',
			'Add ground pork and cook until done',
			'Add cabbage and carrot, stir-fry for 3 minutes',
			'Add soy sauce and let cool',
			'Place filling on wrapper, roll tightly, seal edge with water',
			'Deep fry in hot oil until golden brown',
			'Drain on paper towels',
		],
	},
]

export const useRecipes = () => {
	const [favorites, setFavorites] = useState<string[]>([])
	const [mounted, setMounted] = useState(false)

	// Load favorites from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem('favorite_recipes')
		if (stored) {
			setFavorites(JSON.parse(stored))
		}
		setMounted(true)
	}, [])

	// Save favorites to localStorage whenever they change
	useEffect(() => {
		if (mounted) {
			localStorage.setItem('favorite_recipes', JSON.stringify(favorites))
		}
	}, [favorites, mounted])

	const toggleFavorite = (recipeSlug: string) => {
		setFavorites((prev) =>
			prev.includes(recipeSlug) ? prev.filter((slug) => slug !== recipeSlug) : [...prev, recipeSlug]
		)
	}

	const isFavorite = (recipeSlug: string) => favorites.includes(recipeSlug)

	const getFilteredRecipes = (searchQuery: string) => {
		if (!searchQuery.trim()) return RECIPES

		const query = searchQuery.toLowerCase()
		return RECIPES.filter(
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

	const getFavoriteRecipes = () => {
		return RECIPES.filter((recipe) => favorites.includes(recipe.slug))
	}

	const getAllTags = () => {
		const tags = {
			meals: new Set<string>(),
			ingredients: new Set<string>(),
			meats: new Set<string>(),
			tastes: new Set<string>(),
			countries: new Set<string>(),
		}

		RECIPES.forEach((recipe) => {
			tags.meals.add(recipe.tags.meal)
			recipe.tags.ingredient.forEach((ing) => tags.ingredients.add(ing))
			if (recipe.tags.meat !== 'None') tags.meats.add(recipe.tags.meat)
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
	}

	return {
		recipes: RECIPES,
		favorites,
		toggleFavorite,
		isFavorite,
		getFilteredRecipes,
		getFavoriteRecipes,
		getAllTags,
	}
}
