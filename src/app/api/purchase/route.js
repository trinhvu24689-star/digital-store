import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// API tạo đơn hàng mới
export async function POST(request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await request.json();

  // 1. Kiểm tra xem đã mua chưa
  const existingPurchase = await prisma.purchase.findUnique({
    where: {
      userId_productId: {
        userId: user.id,
        productId: parseInt(productId),
      },
    },
  });

  if (existingPurchase) {
      return NextResponse.json(existingPurchase);
  }

  // 2. Tạo đơn hàng mới (Trạng thái PENDING)
  const newPurchase = await prisma.purchase.create({
    data: {
      userId: user.id,
      productId: parseInt(productId),
      status: 'PENDING', 
    },
  });

  return NextResponse.json(newPurchase);
}

// API cập nhật trạng thái đã thanh toán
export async function PUT(request) {
    const { purchaseId } = await request.json();
    
    // Cập nhật trạng thái thành COMPLETED
    const updated = await prisma.purchase.update({
        where: { id: purchaseId },
        data: { status: 'COMPLETED' }
    });
    
    return NextResponse.json(updated);
}