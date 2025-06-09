// Helper function to convert snake_case to camelCase
export const snakeToCamel = (str: string) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())

// Function to transform object keys from snake_case to camelCase
export const transformToCamelCase = (obj: Record<string, unknown>): Record<string, unknown> => {
	const result: Record<string, unknown> = {}
	Object.keys(obj).forEach(key => {
		result[snakeToCamel(key)] = obj[key]
	})
	return result
} 