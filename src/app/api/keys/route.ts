import { NextRequest, NextResponse } from 'next/server'
import { supabaseApiKeyService } from '@/services/supabaseApiKeyService'
import { CreateApiKeyDto, ApiKey } from '@/types/apiKey'
import { transformToCamelCase } from '@/utils/caseTransform'
import { validateUserSession } from '@/utils/validateUserSession'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
	try {
		const { user, error } = await validateUserSession()
		if (error) return error

		// Get all API keys for the user
		const { data: apiKeys, error: apiKeysError } = await supabase
			.from('api_keys')
			.select('*')
			.eq('user_id', user.id)

		if (apiKeysError) {
			throw new Error('Failed to fetch API keys')
		}

		// Transform array of objects from snake_case to camelCase
		const transformedApiKeys = apiKeys
			? apiKeys.map((item: Record<string, unknown>) => transformToCamelCase(item) as unknown as ApiKey)
			: []

		return NextResponse.json(transformedApiKeys)
	} catch (error) {
		console.error('Error fetching API keys:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export async function POST(request: NextRequest) {
	try {
		const { user, error } = await validateUserSession()
		if (error) return error

		// Parse request body
		const body = await request.json()
		const createApiKeyDto: CreateApiKeyDto = {
			name: body.name
		}

		// Create new API key with user ID from token
		const newApiKey = await supabaseApiKeyService.create({
			...createApiKeyDto,
			userId: user.id
		})

		return NextResponse.json(newApiKey, { status: 201 })
	} catch (error) {
		console.error('Error creating API key:', error)
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Internal server error' },
			{ status: 500 }
		)
	}
} 