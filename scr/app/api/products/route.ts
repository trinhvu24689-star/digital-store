// src/app/api/products/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Tạo sản phẩm mới trong Neon DB
    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
        category: body.category,
        sourceCode: body.sourceCode, // Lưu đoạn code dài
        file3DUrl: body.file3DUrl,   // Lưu link file (giả lập)
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Lỗi tạo sản phẩm:", error);
    return NextResponse.json({ error: 'Không thể tạo sản phẩm' }, { status: 500 });
  }
}