/**
 * Transforms an object's keys from snake_case to camelCase
 */
export function transformToCamelCase(obj: Record<string, unknown>): Record<string, unknown> {
	const result: Record<string, unknown> = {}
	
	for (const [key, value] of Object.entries(obj)) {
		const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
		result[camelKey] = value
	}
	
	return result
}

/**
 * Transforms an object's keys from camelCase to snake_case
 */
export function transformToSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
	const result: Record<string, unknown> = {}
	
	for (const [key, value] of Object.entries(obj)) {
		const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
		result[snakeKey] = value
	}
	
	return result
} 