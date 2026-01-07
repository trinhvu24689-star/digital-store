import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function Home() {
  // Lấy danh sách sản phẩm từ Database
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-cyan-400">Digital Store</h1>
        
        {products.length === 0 ? (
          <p className="text-gray-400">Chưa có sản phẩm nào.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-cyan-500 transition">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-400">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </span>
                    <Link 
                      href={`/checkout/${product.id}`}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                      Mua Ngay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}