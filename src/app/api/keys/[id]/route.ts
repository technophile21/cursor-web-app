import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabaseApiKeyService } from '@/services/supabaseApiKeyService';
import { UpdateApiKeyDto, ApiKey } from '@/types/apiKey';
import { transformToCamelCase } from '@/utils/caseTransform';
import { getSessionUser } from '@/utils/auth';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { user, error } = await getSessionUser(request);
		if (error) return error;
		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		// Initialize Supabase client
		const supabase = createRouteHandlerClient({ cookies });

		// Get API key by ID
		const { data: apiKey, error: apiKeyError } = await supabase
			.from('api_keys')
			.select('*')
			.eq('id', params.id)
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
	{ params }: { params: { id: string } }
) {
	try {
		const { user, error } = await getSessionUser(request);
		if (error) return error;
		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		// Initialize Supabase client
		const supabase = createRouteHandlerClient({ cookies });

		// Get API key by ID
		const { data: apiKey, error: apiKeyError } = await supabase
			.from('api_keys')
			.select('*')
			.eq('id', params.id)
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
		const updatedApiKey = await supabaseApiKeyService.update(params.id, updateApiKeyDto);

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
	{ params }: { params: { id: string } }
) {
	try {
		const { user, error } = await getSessionUser(request);
		if (error) return error;
		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		// Initialize Supabase client
		const supabase = createRouteHandlerClient({ cookies });

		// Get API key by ID
		const { data: apiKey, error: apiKeyError } = await supabase
			.from('api_keys')
			.select('*')
			.eq('id', params.id)
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
		await supabaseApiKeyService.delete(params.id);

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error('Error deleting API key:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
} 