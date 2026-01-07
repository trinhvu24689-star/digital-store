// src/app/api/upload/route.js
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  // Lấy file từ body request
  const blob = await put(filename, request.body, {
    access: 'public', // File này ai cũng có thể tải nếu có link
  });

  return NextResponse.json(blob);
}