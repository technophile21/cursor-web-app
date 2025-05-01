import { NextResponse } from 'next/server';
import { UpdateApiKeyDto } from '@/types/apiKey';
import { apiKeyStorage } from '@/lib/apiKeyStorage';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data: UpdateApiKeyDto = await request.json();
    const updatedKey = apiKeyStorage.update(params.id, data);

    if (!updatedKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedKey);
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
    const success = apiKeyStorage.delete(params.id);

    if (!success) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 400 }
    );
  }
} 