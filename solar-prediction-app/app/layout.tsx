import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider, ToastViewport } from "@/components/ui/toast"

export const metadata: Metadata = {
  title: 'Solar Prediction App',
  description: 'Sistema de predicción solar para Junín',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  )
}
