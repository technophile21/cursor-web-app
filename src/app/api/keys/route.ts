import { NextResponse } from 'next/server';
import { ApiKey, CreateApiKeyDto } from '@/types/apiKey';
import { apiKeyStorage } from '@/lib/apiKeyStorage';

export async function GET() {
  return NextResponse.json(apiKeyStorage.getAll());
}

export async function POST(request: Request) {
  try {
    const data: CreateApiKeyDto = await request.json();
    
    // Validate name uniqueness before creating the key
    if (!apiKeyStorage.isNameUnique(data.name)) {
      return NextResponse.json(
        { error: 'API key name must be unique' },
        { status: 400 }
      );
    }
    
    const newApiKey: ApiKey = {
      id: crypto.randomUUID(),
      name: data.name,
      key: `sk-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    const createdKey = apiKeyStorage.add(newApiKey);
    return NextResponse.json(createdKey);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create API key';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
} 