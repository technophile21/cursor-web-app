import { NextResponse } from 'next/server';
import { ApiKey, CreateApiKeyDto } from '@/types/apiKey';
import { apiKeyStorage } from '@/lib/apiKeyStorage';

export async function GET() {
  return NextResponse.json(apiKeyStorage.getAll());
}

export async function POST(request: Request) {
  try {
    const data: CreateApiKeyDto = await request.json();
    
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
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 400 }
    );
  }
} 