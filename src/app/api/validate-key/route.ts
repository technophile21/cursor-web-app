import { NextRequest, NextResponse } from 'next/server';
import { supabaseApiKeyService } from '@/services/supabaseApiKeyService';

export async function POST(req: NextRequest) {
  try {
    const { apiKey } = await req.json();
    if (!apiKey) {
      return NextResponse.json({ valid: false, error: 'API key is required' }, { status: 400 });
    }
    const isValid = await supabaseApiKeyService.validateKey(apiKey);
    return NextResponse.json({ valid: isValid });
  } catch (error) {
    return NextResponse.json({ valid: false, error: 'Server error' }, { status: 500 });
  }
} 