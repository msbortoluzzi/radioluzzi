'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Artigos' },
    { href: '/laudos', label: 'Laudos' },
    { href: '/formulas', label: 'Fórmulas' },
    { href: '/protocolos', label: 'Protocolos' },
    { href: '/links', label: 'Links' },
  ]

  return (
    <nav style={{
      backgroundColor: '#111111',
      borderBottom: '1px solid #222222',
      padding: '12px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '32px'
      }}>
        {/* Logo */}
        <Link 
          href="/" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: '#e5e5e5'
          }}
        >
          {/* Logo R Azul */}
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#3b82f6',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 700,
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            R
          </div>
          
          <span style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#e5e5e5'
          }}>
            Radioluzzi
          </span>
        </Link>

        {/* Menu */}
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link 
                key={item.href}
                href={item.href} 
                style={{
                  color: isActive ? '#3b82f6' : '#a3a3a3',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: isActive ? 600 : 500,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  transition: 'all 0.2s',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.color = '#e5e5e5'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#a3a3a3'
                  }
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
