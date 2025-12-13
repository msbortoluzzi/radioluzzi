import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./navbar";

export const metadata: Metadata = {
  title: "Radioluzzi",
  description: "Ferramentas Inteligentes para Radiologistas",
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={`dark ${inter.className}`}>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#0a0a0a",
          color: "#e5e5e5",
          minHeight: "100vh",
          lineHeight: "1.6",
        }}
      >
        <Navbar />

        <main
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "24px 16px",
          }}
        >
          {children}
        </main>

        <footer
          style={{
            backgroundColor: "#111111",
            color: "#888888",
            textAlign: "center",
            padding: "32px 16px",
            marginTop: "48px",
            borderTop: "1px solid #222222",
          }}
        >
          <p style={{ margin: 0, fontSize: "14px" }}>
            (c) {new Date().getFullYear()} Radioluzzi - Ferramentas Inteligentes para Radiologistas
          </p>
        </footer>
      </body>
    </html>
  );
}
