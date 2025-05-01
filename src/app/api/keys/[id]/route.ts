import { NextResponse } from 'next/server';
import { UpdateApiKeyDto } from '@/types/apiKey';

// In-memory storage for demo purposes
// In a real application, you would use a database
let apiKeys: any[] = [];

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data: UpdateApiKeyDto = await request.json();
    const apiKey = apiKeys.find(key => key.id === params.id);

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    Object.assign(apiKey, data);
    return NextResponse.json(apiKey);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const index = apiKeys.findIndex(key => key.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    apiKeys.splice(index, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 400 }
    );
  }
} 