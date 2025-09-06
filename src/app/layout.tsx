import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./navbar";

export const metadata: Metadata = {
  title: "Radioluzzi",
  description: "Calculadoras Radiológicas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
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
        backgroundColor: '#ffffff',
        color: '#1e293b',
        minHeight: '100vh',
        lineHeight: '1.6'
      }}>
        <Navbar />

        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            minHeight: 'calc(100vh - 200px)',
            padding: '32px'
          }}>
            {children}
          </div>
        </main>

        <footer style={{
          backgroundColor: '#f8fafc',
          color: '#64748b',
          textAlign: 'center',
          padding: '32px 16px',
          marginTop: '48px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            © {new Date().getFullYear()} Radioluzzi — Ferramentas para Radiologistas
          </p>
        </footer>
      </body>
    </html>
  );
}
