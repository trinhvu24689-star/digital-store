// src/app/admin/create/page.js
'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProduct() {
  const router = useRouter();
  const inputFileRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '', price: '', category: 'Source Code', description: '', sourceCode: '', file3DUrl: '',
  });
  const [loading, setLoading] = useState(false);

  // Hàm upload file lên Vercel Blob
  const handleFileUpload = async () => {
    if (!inputFileRef.current?.files[0]) return null;
    const file = inputFileRef.current.files[0];

    const response = await fetch(`/api/upload?filename=${file.name}`, {
      method: 'POST',
      body: file,
    });
    const newBlob = await response.json();
    return newBlob.url; // Trả về link file online
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedUrl = formData.file3DUrl;
      
      // Nếu là 3D Model, thực hiện upload file trước
      if (formData.category === '3D Model') {
        const url = await handleFileUpload();
        if (url) uploadedUrl = url;
      }

      // Lưu vào Database
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, file3DUrl: uploadedUrl }),
      });

      if (res.ok) {
        alert('Đã đăng sản phẩm & Upload file thành công!');
        router.push('/');
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi khi đăng bán.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4 text-white"> 
    {/* Đổi nền tối để Neon nổi bật */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Upload Tài Sản Số
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Các input cơ bản */}
          <div className="grid grid-cols-2 gap-6">
            <input 
              placeholder="Tên sản phẩm" required
              className="bg-gray-700 border border-gray-600 p-3 rounded text-white focus:outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
             <input 
              placeholder="Giá (VND)" required type="number"
              className="bg-gray-700 border border-gray-600 p-3 rounded text-white focus:outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            />
          </div>
          
          <select 
            className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="Source Code">Source Code</option>
            <option value="3D Model">3D Model</option>
          </select>

          <textarea 
             placeholder="Mô tả ngắn..."
             className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
             onChange={(e) => setFormData({...formData, description: e.target.value})}
          ></textarea>

          {/* LOGIC NEON & UPLOAD */}
          {formData.category === 'Source Code' ? (
            <div className="mt-4">
              <label className="block text-cyan-400 font-bold mb-2">NHẬP MÃ NGUỒN (SOURCE CODE)</label>
              
              {/* --- VIỀN NEON Ở ĐÂY --- */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <textarea 
                  spellCheck="false"
                  className="relative w-full p-4 bg-black text-green-400 font-mono text-sm rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-96 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                  placeholder="// Paste your code here..."
                  onChange={(e) => setFormData({...formData, sourceCode: e.target.value})}
                ></textarea>
              </div>
              {/* ----------------------- */}

            </div>
          ) : (
            <div className="mt-4 border-2 border-dashed border-purple-500 rounded-lg p-10 text-center hover:bg-gray-700 transition">
              <p className="text-purple-300 mb-2">Upload File 3D (.zip, .fbx)</p>
              <input 
                ref={inputFileRef} 
                type="file" 
                className="text-gray-400"
              />
            </div>
          )}

          <button 
            type="submit" disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold text-white shadow-lg transform hover:scale-[1.02] transition"
          >
            {loading ? 'Đang Upload...' : 'ĐĂNG BÁN NGAY'}
          </button>
        </form>
      </div>
    </div>
  );
}