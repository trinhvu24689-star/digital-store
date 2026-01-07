'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Lưu ý: params trong Next.js mới cần được xử lý cẩn thận, nhưng ở đây ta dùng cách đơn giản nhất
export default function CheckoutPage({ params }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Unwrap params (lấy ID sản phẩm từ URL)
  const productId = params.id;

  // --- THÔNG TIN TÀI KHOẢN CỦA BẠN (SỬA Ở ĐÂY) ---
  const BANK_ID = "MB Bank"; 
  const ACCOUNT_NO = "86869999269999"; 
  const ACCOUNT_NAME = "SAM BA VUONG - Đây là tài khoản bank của nhân viên đổi tiền RMB của tôi,hãy lưu ý!"; 
  // -----------------------------------------------

  useEffect(() => {
    if (!productId) return;

    // 1. Lấy thông tin sản phẩm
    fetch(`/api/products/${productId}`).then(res => res.json()).then(data => setProduct(data));
    
    // 2. Tạo đơn hàng nháp ngay khi vào trang
    fetch('/api/purchase', {
        method: 'POST',
        body: JSON.stringify({ productId: productId })
    }).then(res => res.json()).then(data => setPurchase(data));
  }, [productId]);

  const handleConfirmPayment = async () => {
    if (!purchase) return;
    setLoading(true);
    
    // Gọi API xác nhận đã thanh toán
    await fetch('/api/purchase', {
        method: 'PUT',
        body: JSON.stringify({ purchaseId: purchase.id })
    });

    alert("Thanh toán thành công!");
    router.push(`/product/${productId}`); 
  };

  if (!product || !purchase) return <div className="p-10 text-white bg-gray-900 h-screen">Đang tạo đơn hàng...</div>;

  // Link tạo mã QR tự động
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.jpg?amount=${product.price}&addInfo=MUA ${purchase.id.substring(0,8)}&accountName=${ACCOUNT_NAME}`;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-gray-800 rounded-2xl shadow-2xl flex flex-col md:flex-row border border-gray-700">
        
        {/* Cột QR Code */}
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center bg-blue-900">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">QUÉT MÃ QR</h2>
            <div className="bg-white p-2 rounded-lg">
                <img src={qrUrl} alt="VietQR" className="w-64 h-64 object-contain" />
            </div>
            <p className="mt-4 text-sm text-gray-300">Nội dung CK: MUA {purchase.id.substring(0,8)}</p>
        </div>

        {/* Cột Thông tin */}
        <div className="w-full md:w-1/2 p-8 text-gray-300">
            <h1 className="text-2xl font-bold mb-4 text-white">{product.name}</h1>
            <p className="mb-2">Giá: <span className="text-xl font-bold text-white">{product.price} VNĐ</span></p>
            
            <button 
                onClick={handleConfirmPayment}
                disabled={loading}
                className="w-full mt-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg"
            >
                {loading ? "Đang xử lý..." : "✅ TÔI ĐÃ CHUYỂN KHOẢN"}
            </button>
        </div>
      </div>
    </div>
  );
}