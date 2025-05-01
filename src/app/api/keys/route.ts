import { NextResponse } from 'next/server';
import { CreateApiKeyDto } from '@/types/apiKey';
import { supabaseApiKeyService } from '@/services/supabaseApiKeyService';

export async function GET() {
  try {
    const apiKeys = await supabaseApiKeyService.getAll();
    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data: CreateApiKeyDto = await request.json();
    
    const newApiKey = await supabaseApiKeyService.create(data);
    return NextResponse.json(newApiKey);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create API key';
    const status = errorMessage.includes('unique') ? 400 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
} 