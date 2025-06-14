import { NextRequest, NextResponse } from 'next/server';
import { supabaseApiKeyService } from '@/services/supabaseApiKeyService';
import { UpdateApiKeyDto, ApiKey } from '@/types/apiKey';
import { transformToCamelCase } from '@/utils/caseTransform';
import { validateUserSession } from '@/utils/validateUserSession';
import { supabase } from '@/lib/supabase';

type RouteParams = {
	params: Promise<{
		id: string
	}>
}

export async function GET(
	request: NextRequest,
	context: RouteParams
) {
	try {
		const { user, error } = await validateUserSession();
		if (error) return error;

		const { id } = await context.params;

		// Get API key by ID
		const { data: apiKey, error: apiKeyError } = await supabase
			.from('api_keys')
			.select('*')
			.eq('id', id)
			.single();

		if (apiKeyError || !apiKey) {
			return NextResponse.json(
				{ error: 'API key not found' },
				{ status: 404 }
			);
		}

		// Transform to camelCase
		const transformedApiKey = transformToCamelCase(apiKey) as unknown as ApiKey;

		// Check if the API key belongs to the user
		if (transformedApiKey.userId !== user.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		return NextResponse.json(transformedApiKey);
	} catch (error) {
		console.error('Error fetching API key:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function PATCH(
	request: NextRequest,
	context: RouteParams
) {
	try {
		const { user, error } = await validateUserSession();
		if (error) return error;

		const { id } = await context.params;

		// Get API key by ID
		const { data: apiKey, error: apiKeyError } = await supabase
			.from('api_keys')
			.select('*')
			.eq('id', id)
			.single();

		if (apiKeyError || !apiKey) {
			return NextResponse.json(
				{ error: 'API key not found' },
				{ status: 404 }
			);
		}

		// Transform to camelCase
		const transformedApiKey = transformToCamelCase(apiKey) as unknown as ApiKey;

		// Check if the API key belongs to the user
		if (transformedApiKey.userId !== user.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		// Parse request body
		const body = await request.json();
		const updateApiKeyDto: UpdateApiKeyDto = {
			name: body.name,
			isActive: body.isActive
		};

		// Update API key
		const updatedApiKey = await supabaseApiKeyService.update(id, updateApiKeyDto);

		return NextResponse.json(updatedApiKey);
	} catch (error) {
		console.error('Error updating API key:', error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	context: RouteParams
) {
	try {
		const { user, error } = await validateUserSession();
		if (error) return error;

		const { id } = await context.params;

		// Get API key by ID
		const { data: apiKey, error: apiKeyError } = await supabase
			.from('api_keys')
			.select('*')
			.eq('id', id)
			.single();

		if (apiKeyError || !apiKey) {
			return NextResponse.json(
				{ error: 'API key not found' },
				{ status: 404 }
			);
		}

		// Transform to camelCase
		const transformedApiKey = transformToCamelCase(apiKey) as unknown as ApiKey;

		// Check if the API key belongs to the user
		if (transformedApiKey.userId !== user.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		// Delete API key
		await supabaseApiKeyService.delete(id);

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error('Error deleting API key:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
} 