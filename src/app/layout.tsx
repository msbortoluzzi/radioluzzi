import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./navbar";

export const metadata: Metadata = {
  title: "Radioluzzi",
  description: "Ferramentas Inteligentes para Radiologistas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        backgroundColor: '#0a0a0a',
        color: '#e5e5e5',
        minHeight: '100vh',
        lineHeight: '1.6'
      }}>
        <Navbar />

        <main style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '24px 16px'
        }}>
          {children}
        </main>

        <footer style={{
          backgroundColor: '#111111',
          color: '#888888',
          textAlign: 'center',
          padding: '32px 16px',
          marginTop: '48px',
          borderTop: '1px solid #222222'
        }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            © {new Date().getFullYear()} Radioluzzi — Ferramentas Inteligentes para Radiologistas
          </p>
        </footer>
      </body>
    </html>
  );
}
