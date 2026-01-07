// src/app/layout.js
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css' // Đảm bảo bạn vẫn import css

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="vi">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}