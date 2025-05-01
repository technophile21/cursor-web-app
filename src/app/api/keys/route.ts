import { NextResponse } from 'next/server';
import { ApiKey, CreateApiKeyDto } from '@/types/apiKey';

// In-memory storage for demo purposes
// In a real application, you would use a database
let apiKeys: ApiKey[] = [];

export async function GET() {
  return NextResponse.json(apiKeys);
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

    apiKeys.push(newApiKey);
    return NextResponse.json(newApiKey);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 400 }
    );
  }
} 