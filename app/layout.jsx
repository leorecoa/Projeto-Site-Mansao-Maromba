import '../styles/globals.css' // Ajuste o caminho conforme sua estrutura de CSS
import Navbar from '@/components/layout/Navbar.tsx'
import Footer from '@/components/layout/Footer.tsx'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}