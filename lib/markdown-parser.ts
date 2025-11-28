export interface RecipeContent {
  ingredients: string[]
  instructions: string[]
}

export function parseRecipeMarkdown(markdownContent: string): RecipeContent {
  const sections = markdownContent.split('## ')
  let ingredients: string[] = []
  let instructions: string[] = []

  sections.forEach((section) => {
    if (section.startsWith('Ingredients')) {
      const content = section.substring('Ingredients'.length).trim()
      const lines = content.split('\n').filter((line) => line.trim())
      ingredients = lines
        .filter((line) => line.trim().startsWith('-'))
        .map((line) => line.trim().substring(1).trim())
    } else if (section.startsWith('Instructions')) {
      const content = section.substring('Instructions'.length).trim()
      const lines = content.split('\n').filter((line) => line.trim())
      instructions = lines
        .filter((line) => /^\d+\./.test(line.trim()))
        .map((line) => line.trim().substring(line.trim().indexOf('.') + 1).trim())
    }
  })

  return { ingredients, instructions }
}

export function getFrontmatter(markdownContent: string): Record<string, any> {
  const frontmatterMatch = markdownContent.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch) return {}

  const frontmatterText = frontmatterMatch[1]
  const frontmatter: Record<string, any> = {}

  // Parse YAML-like frontmatter
  frontmatterText.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim()
      frontmatter[key.trim()] = parseYamlValue(value)
    }
  })

  return frontmatter
}

function parseYamlValue(value: string): any {
  // Remove quotes
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }
  // Parse numbers
  if (!isNaN(Number(value))) {
    return Number(value)
  }
  // Parse booleans
  if (value === 'true') return true
  if (value === 'false') return false
  // Parse arrays
  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => parseYamlValue(item.trim()))
  }
  return value
}
