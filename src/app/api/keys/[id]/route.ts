import { NextResponse } from 'next/server';
import { UpdateApiKeyDto } from '@/types/apiKey';
import { apiKeyStorage } from '@/lib/apiKeyStorage';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data: UpdateApiKeyDto = await request.json();

    // Validate name uniqueness if name is being updated
    if (data.name && !apiKeyStorage.isNameUnique(data.name, params.id)) {
      return NextResponse.json(
        { error: 'API key name must be unique' },
        { status: 400 }
      );
    }

    const updatedKey = apiKeyStorage.update(params.id, data);

    if (!updatedKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedKey);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update API key';
    return NextResponse.json(
      { error: errorMessage },
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
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete API key';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
} 