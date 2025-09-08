"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Laudos", href: "/laudos" },
  { name: "Calculadoras", href: "/calculadoras" },
  { name: "Fórmulas", href: "/formulas" },
  { name: "Protocolos", href: "/protocolos" },
  { name: "Artigos", href: "/artigos" },
  { name: "Links", href: "/links" },
  { name: "Contato", href: "/contato" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              transition: "all 0.3s ease",
            }}
          >
            R
          </div>
          <div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#1e293b",
                lineHeight: "1.2",
              }}
            >
              Radioluzzi
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
                lineHeight: "1.2",
              }}
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{ display: "flex", gap: "8px", alignItems: "center" }}
          className="hidden lg:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease",
                backgroundColor: isActive(item.href) ? "#2563eb" : "transparent",
                color: isActive(item.href) ? "white" : "#64748b",
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.backgroundColor = "#f1f5f9";
                  e.currentTarget.style.color = "#1e293b";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#64748b";
                }
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "block",
            padding: "8px",
            borderRadius: "8px",
            color: "#64748b",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          className="lg:hidden"
          aria-label="Abrir menu"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f1f5f9";
            e.currentTarget.style.color = "#1e293b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
          }}
          className="lg:hidden"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive(item.href) ? "#2563eb" : "transparent",
                  color: isActive(item.href) ? "white" : "#64748b",
                }}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
