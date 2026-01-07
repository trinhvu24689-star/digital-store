// src/app/page.js
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

// Import component của Clerk
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const prisma = new PrismaClient();

async function getProducts() {
  return await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
}

export default async function Home() {
  const products = await getProducts();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Digital Market</h1>
          
          <div className="flex gap-4 items-center">
            {/* Nếu ĐÃ đăng nhập: Hiện nút Admin và Avatar */}
            <SignedIn>
              <Link href="/admin/create" className="text-sm font-medium hover:text-blue-600">
                Quản lý Admin
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            {/* Nếu CHƯA đăng nhập: Hiện nút Login */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition">
                  Đăng nhập
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>

// Khởi tạo Prisma (nên để file riêng trong thực tế, nhưng để đây cho gọn)
const prisma = new PrismaClient();

// Hàm lấy dữ liệu (Server Side)
async function getProducts() {
  // revalidate: 0 nghĩa là luôn lấy dữ liệu mới nhất, không cache
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return products;
}

export default async function Home() {
  const products = await getProducts();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Digital Market</h1>
          <Link href="/admin/create" className="bg-black text-white px-4 py-2 rounded text-sm">
            + Đăng bán
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm mới nhất</h2>
        
        {products.length === 0 ? (
          <p className="text-gray-500">Chưa có sản phẩm nào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-xl transition duration-300 border border-gray-100">
                <div className="h-40 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white">
                  {/* Nếu không có ảnh, hiện Icon dựa theo loại */}
                  <span className="text-4xl font-bold opacity-50">
                    {product.category === 'Source Code' ? '</>' : '3D'}
                  </span>
                </div>
                
                <div className="p-5">
                  <div className="text-xs font-bold text-blue-600 uppercase">
                    {product.category}
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-red-600">
                      {formatCurrency(product.price)}
                    </span>
                    {/* Link tới trang xem chi tiết (chúng ta sẽ làm trang này hiển thị code) */}
                    <Link 
                      href={`/product/${product.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Xem ngay &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}