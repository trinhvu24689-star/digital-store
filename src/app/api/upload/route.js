import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  // Upload file lên Vercel Blob Storage
  // access: 'public' để ai cũng tải được (khách mua hàng)
  const blob = await put(filename, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}