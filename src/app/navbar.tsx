'use client'

import React from 'react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{
      backgroundColor: '#2563eb',
      padding: '16px 24px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '32px'
      }}>
        {/* Logo */}
        <Link 
          href="/" 
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#ffffff',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{
            fontSize: '28px',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            ⚡
          </span>
          Radioluzzi
        </Link>

        {/* Menu */}
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center'
        }}>
          <Link 
            href="/" 
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 500,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Início
          </Link>
          
          <Link 
            href="/laudos" 
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 500,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Laudos
          </Link>
          
          <Link 
            href="/calculadoras" 
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 500,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Calculadoras
          </Link>
          
          <Link 
            href="/protocolos" 
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 500,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Protocolos
          </Link>
          
          <Link 
            href="/links" 
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 500,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Links
          </Link>
        </div>
      </div>
    </nav>
  )
}
