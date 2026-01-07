// src/app/api/products/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json(product);
}