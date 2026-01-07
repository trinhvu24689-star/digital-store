// src/middleware.js
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Định nghĩa các route cần bảo vệ
// Ở đây mình bảo vệ trang Admin và trang xem chi tiết sản phẩm
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)', 
  '/product(.*)' 
]);

export default clerkMiddleware((auth, req) => {
  // Nếu người dùng cố vào trang được bảo vệ mà chưa đăng nhập -> Đẩy về trang Login
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};