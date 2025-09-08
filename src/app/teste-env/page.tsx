export default function TesteEnv() {
  return (
    <div style={{ 
      padding: '32px', 
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          🧪 Teste Variáveis de Ambiente
        </h1>
        
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h3 style={{ 
            color: '#1e293b', 
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            📊 Status das Configurações
          </h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            
            <div>
              <strong style={{ color: '#374151' }}>NEXT_PUBLIC_SUPABASE_URL:</strong>
              <div style={{ 
                padding: '12px', 
                backgroundColor: process.env.NEXT_PUBLIC_SUPABASE_URL ? '#dcfce7' : '#fee2e2',
                marginTop: '8px',
                borderRadius: '8px',
                border: `1px solid ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '#22c55e' : '#ef4444'}`,
                fontFamily: 'monospace',
                fontSize: '14px'
              }}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ NÃO CONFIGURADA'}
              </div>
            </div>

            <div>
              <strong style={{ color: '#374151' }}>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>
              <div style={{ 
                padding: '12px', 
                backgroundColor: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '#dcfce7' : '#fee2e2',
                marginTop: '8px',
                borderRadius: '8px',
                border: `1px solid ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '#22c55e' : '#ef4444'}`,
                fontFamily: 'monospace',
                fontSize: '14px'
              }}>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
                  `✅ Configurada (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 30)}...)` : 
                  '❌ NÃO CONFIGURADA'
                }
              </div>
            </div>

            <div>
              <strong style={{ color: '#374151' }}>OPENAI_API_KEY:</strong>
              <div style={{ 
                padding: '12px', 
                backgroundColor: process.env.OPENAI_API_KEY ? '#dcfce7' : '#fef3c7',
                marginTop: '8px',
                borderRadius: '8px',
                border: `1px solid ${process.env.OPENAI_API_KEY ? '#22c55e' : '#f59e0b'}`,
                fontFamily: 'monospace',
                fontSize: '14px'
              }}>
                {process.env.OPENAI_API_KEY ? 
                  `✅ Configurada (${process.env.OPENAI_API_KEY.substring(0, 15)}...)` : 
                  '⚠️ NÃO CONFIGURADA (opcional)'
                }
              </div>
            </div>

          </div>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '#dcfce7' : '#fee2e2',
          border: `2px solid ${process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '#22c55e' : '#ef4444'}`,
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'}
          </div>
          <h3 style={{ 
            color: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '#166534' : '#dc2626',
            marginBottom: '8px',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            {process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              ? 'Configuração Completa!'
              : 'Configuração Incompleta'
            }
          </h3>
          <p style={{ 
            color: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '#166534' : '#dc2626',
            margin: 0,
            fontSize: '16px'
          }}>
            {process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              ? 'Todas as variáveis necessárias estão configuradas!'
              : 'Crie o arquivo .env.local na raiz do projeto com as chaves do Supabase.'
            }
          </p>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
          marginTop: '24px'
        }}>
          <h3 style={{ 
            color: '#1e293b', 
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            📋 Como Corrigir
          </h3>
          
          <div style={{ color: '#64748b', lineHeight: '1.6' }}>
            <p><strong>1. Crie o arquivo .env.local na raiz do projeto:</strong></p>
            <div style={{
              backgroundColor: '#1e293b',
              color: '#f1f5f9',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              C:\Projetos\radioluzzi\.env.local
            </div>
            
            <p><strong>2. Adicione as variáveis:</strong></p>
            <div style={{
              backgroundColor: '#1e293b',
              color: '#f1f5f9',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '12px',
              marginBottom: '16px'
            }}>
              NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co<br/>
              NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...<br/>
              SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...<br/>
              OPENAI_API_KEY=sk-proj-...
            </div>
            
            <p><strong>3. Reinicie o servidor:</strong></p>
            <div style={{
              backgroundColor: '#1e293b',
              color: '#f1f5f9',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}>
              npm run dev
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
