// src/app/product/[id]/page.js
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export default async function ProductDetail({ params }) {
  const user = await currentUser();
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  // KIỂM TRA QUYỀN SỞ HỮU
  let hasPurchased = false;
  
  if (user) {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: parseInt(params.id),
        },
      },
    });
    // Chỉ cho xem khi trạng thái là COMPLETED
    if (purchase && purchase.status === 'COMPLETED') {
        hasPurchased = true;
    }
  }

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="text-gray-400 hover:text-white">&larr; Quay lại</Link>
        <div className="text-sm">
           {user ? `Xin chào, ${user.firstName}` : <Link href="/sign-in" className="text-cyan-400">Đăng nhập</Link>}
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-400 mb-8">{product.description}</p>

        {/* --- LOGIC HIỂN THỊ QUAN TRỌNG --- */}
        
        {hasPurchased ? (
            // TRƯỜNG HỢP 1: ĐÃ MUA -> HIỆN CODE / DOWNLOAD
            <div className="animate-fade-in">
                <div className="bg-green-900/20 border border-green-500/50 p-4 rounded mb-6 text-green-400 flex items-center">
                    <span className="mr-2">✓</span> Bạn đã sở hữu sản phẩm này.
                </div>

                {product.category === 'Source Code' ? (
                     <div className="relative">
                        <h2 className="text-cyan-400 font-mono mb-2 text-sm">:: SOURCE_CODE_VIEWER ::</h2>
                        <div className="absolute -inset-1 bg-cyan-500 rounded-lg blur opacity-30"></div>
                        <div className="relative bg-black rounded-lg border border-cyan-500/50 p-6 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                          <code className="text-green-400 font-mono whitespace-pre-wrap text-sm">
                            {product.sourceCode}
                          </code>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-800 rounded-xl border border-gray-700">
                        <a href={product.file3DUrl} download className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg">
                            ⬇ Tải xuống Model Assets
                        </a>
                    </div>
                )}
            </div>
        ) : (
            // TRƯỜNG HỢP 2: CHƯA MUA -> HIỆN NÚT MUA
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center shadow-2xl max-w-xl mx-auto">
                <p className="text-gray-400 mb-4">Nội dung này bị khóa.</p>
                <div className="text-4xl font-bold text-white mb-6">{formatCurrency(product.price)}</div>
                
                {user ? (
                    <Link 
                        href={`/checkout/${product.id}`}
                        className="block w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg font-bold text-black hover:scale-105 transition transform text-lg"
                    >
                        MUA NGAY ĐỂ MỞ KHÓA 🔓
                    </Link>
                ) : (
                    // Nếu chưa đăng nhập thì nút Mua sẽ chuyển hướng sang trang Login
                    <Link 
                        href="/sign-in"
                        className="block w-full py-4 bg-gray-600 hover:bg-gray-500 rounded-lg font-bold text-white transition"
                    >
                        Đăng nhập để Mua
                    </Link>
                )}
                
                <p className="mt-4 text-xs text-gray-500">Thanh toán an toàn qua VietQR. Nhận hàng ngay lập tức.</p>
            </div>
        )}
      </div>
    </div>
  );
}