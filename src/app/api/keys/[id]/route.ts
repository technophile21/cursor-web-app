import { NextRequest, NextResponse } from 'next/server';
import { UpdateApiKeyDto } from '@/types/apiKey';
import { supabaseApiKeyService } from '@/services/supabaseApiKeyService';

export async function PATCH(
  request: NextRequest,
  context: any // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  const { id } = context.params;  
  try {
    const data: UpdateApiKeyDto = await request.json();
    const updatedKey = await supabaseApiKeyService.update(id, data);

    return NextResponse.json(updatedKey);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update API key';
    const status = errorMessage.includes('not found') ? 404 : 
                  errorMessage.includes('unique') ? 400 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  context: any // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  const { id } = context.params;
  try {
    await supabaseApiKeyService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete API key';
    const status = errorMessage.includes('not found') ? 404 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
} 