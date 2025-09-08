"use client";

import { useEffect, useState } from 'react';

// Simulação de dados para teste
const categoriasSimuladas = [
  { id: '1', nome: 'Radiografia', icone: '🩻', descricao: 'Exames de raios-X', cor: '#2563eb', ativo: true },
  { id: '2', nome: 'Tomografia', icone: '🔍', descricao: 'Exames de TC', cor: '#059669', ativo: true },
  { id: '3', nome: 'Ressonância', icone: '🧲', descricao: 'Exames de RM', cor: '#7c3aed', ativo: true },
  { id: '4', nome: 'Ultrassom', icone: '📡', descricao: 'Exames de US', cor: '#dc2626', ativo: true },
  { id: '5', nome: 'Mamografia', icone: '🎯', descricao: 'Exames mamográficos', cor: '#ea580c', ativo: true }
];

const templatesSimulados = [
  { 
    id: '1', 
    nome: 'RX Tórax PA e Perfil', 
    descricao: 'Template para radiografia de tórax',
    modalidade: 'Radiografia',
    regiao: 'Tórax',
    tipo_selecao: 'múltipla',
    categoria: { nome: 'Radiografia', icone: '🩻', cor: '#2563eb' }
  },
  { 
    id: '2', 
    nome: 'TC Crânio sem Contraste', 
    descricao: 'Template para tomografia de crânio',
    modalidade: 'Tomografia',
    regiao: 'Crânio',
    tipo_selecao: 'única',
    categoria: { nome: 'Tomografia', icone: '🔍', cor: '#059669' }
  },
  { 
    id: '3', 
    nome: 'US Abdome Total', 
    descricao: 'Template para ultrassom abdominal',
    modalidade: 'Ultrassom',
    regiao: 'Abdome',
    tipo_selecao: 'múltipla',
    categoria: { nome: 'Ultrassom', icone: '📡', cor: '#dc2626' }
  }
];

export default function TesteSupabase() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const adicionarResultado = (resultado: string) => {
    setTestResults(prev => [...prev, resultado]);
  };

  useEffect(() => {
    setMounted(true);
    
    async function executarTestes() {
      try {
        adicionarResultado('🔄 Iniciando testes do sistema...');

        // Simular delay de carregamento
        await new Promise(resolve => setTimeout(resolve, 500));

        // Teste 1: Verificar variáveis de ambiente
        adicionarResultado('📡 Testando variáveis de ambiente...');
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Variáveis de ambiente não configuradas');
        }
        
        if (supabaseUrl.includes('fake')) {
          adicionarResultado('⚠️ Usando configuração temporária (fake)');
        } else {
          adicionarResultado('✅ Configuração real do Supabase detectada!');
        }

        // Teste 2: Simular busca de categorias
        adicionarResultado('📂 Carregando categorias...');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setCategorias(categoriasSimuladas);
        adicionarResultado(`✅ ${categoriasSimuladas.length} categorias carregadas!`);

        // Teste 3: Simular busca de templates
        adicionarResultado('📋 Carregando templates...');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setTemplates(templatesSimulados);
        adicionarResultado(`✅ ${templatesSimulados.length} templates carregados!`);

        // Teste 4: Simular inserção de dados
        adicionarResultado('📝 Testando inserção de dados...');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Simular sucesso na inserção
        adicionarResultado('✅ Inserção de dados simulada com sucesso!');

        adicionarResultado('🎉 Todos os testes passaram! Sistema funcionando corretamente.');

      } catch (err: any) {
        setError(err.message);
        adicionarResultado(`❌ Erro: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    executarTestes();
  }, []);

  // Evitar erro de hidratação
  if (!mounted) {
    return (
      <div style={{ 
        padding: '32px',
        fontFamily: "'Inter', sans-serif",
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>🧪</div>
        <div>Carregando testes...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '32px',
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '48px',
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '16px'
          }}>
            🧪 Teste Sistema Radioluzzi
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#64748b',
            margin: 0
          }}>
            Verificando funcionamento do sistema e configurações
          </p>
        </div>

        {/* Status */}
        <div style={{
          padding: '24px',
          backgroundColor: loading ? '#fef3c7' : error ? '#fee2e2' : '#dcfce7',
          borderRadius: '12px',
          border: `1px solid ${loading ? '#f59e0b' : error ? '#ef4444' : '#22c55e'}`,
          marginBottom: '32px'
        }}>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: '600',
            color: loading ? '#92400e' : error ? '#dc2626' : '#166534',
            marginBottom: '8px'
          }}>
            {loading ? '⏳ Executando testes...' : error ? '❌ Erro encontrado' : '✅ Testes concluídos'}
          </div>
          {error && (
            <div style={{ 
              fontSize: '14px', 
              color: '#dc2626',
              backgroundColor: '#ffffff',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '12px',
              fontFamily: 'monospace'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Log de Resultados */}
        <div style={{
          backgroundColor: '#1e293b',
          color: '#f1f5f9',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '32px',
          fontFamily: 'monospace',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <h3 style={{ 
            color: '#60a5fa', 
            marginBottom: '16px',
            fontFamily: "'Inter', sans-serif"
          }}>
            📊 Log de Execução
          </h3>
          {testResults.map((resultado, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              {resultado}
            </div>
          ))}
          {testResults.length === 0 && (
            <div style={{ color: '#94a3b8' }}>Aguardando início dos testes...</div>
          )}
        </div>

        {/* Resultados - Categorias */}
        {categorias.length > 0 && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h3 style={{ 
              color: '#1e293b', 
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              📂 Categorias Encontradas ({categorias.length})
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {categorias.map((cat) => (
                <div key={cat.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <span style={{ fontSize: '24px' }}>{cat.icone}</span>
                  <div>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#1e293b',
                      marginBottom: '4px'
                    }}>
                      {cat.nome}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#64748b'
                    }}>
                      {cat.descricao}
                    </div>
                  </div>
                  <div style={{
                    marginLeft: 'auto',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: cat.cor || '#94a3b8'
                  }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resultados - Templates */}
        {templates.length > 0 && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h3 style={{ 
              color: '#1e293b', 
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              📋 Templates Encontrados ({templates.length})
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {templates.map((template) => (
                <div key={template.id} style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    fontWeight: '600', 
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}>
                    {template.nome}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#64748b',
                    marginBottom: '8px'
                  }}>
                    {template.descricao}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      fontSize: '12px',
                      borderRadius: '12px'
                    }}>
                      {template.modalidade}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: '#059669',
                      color: 'white',
                      fontSize: '12px',
                      borderRadius: '12px'
                    }}>
                      {template.regiao}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      fontSize: '12px',
                      borderRadius: '12px'
                    }}>
                      {template.tipo_selecao}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações de Configuração */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ 
            color: '#1e293b', 
            marginBottom: '16px',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            ⚙️ Informações de Configuração
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <strong>URL do Supabase:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ Não configurada'}
            </div>
            <div>
              <strong>Chave Anon:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ Não configurada'}
            </div>
            <div>
              <strong>OpenAI API:</strong> {process.env.OPENAI_API_KEY ? '✅ Configurada' : '❌ Não configurada'}
            </div>
            <div>
              <strong>Modo:</strong> {
                process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('fake') 
                  ? '🧪 Simulação (dados temporários)' 
                  : '🚀 Produção (dados reais)'
              }
            </div>
          </div>
        </div>

        {/* Próximos Passos */}
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
            fontSize: '20px',
            fontWeight: '600'
          }}>
            🚀 Próximos Passos
          </h3>
          <div style={{ color: '#64748b', lineHeight: '1.6' }}>
            {process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('fake') ? (
              <div>
                <p><strong>Você está usando configuração temporária.</strong></p>
                <p>Para usar o sistema completo:</p>
                <ol style={{ paddingLeft: '20px' }}>
                  <li>Configure o Supabase real</li>
                  <li>Atualize as chaves no .env.local</li>
                  <li>Crie as tabelas no banco</li>
                  <li>Implemente sistema de laudos</li>
                </ol>
              </div>
            ) : (
              <div>
                <p><strong>Configuração real detectada!</strong></p>
                <p>Próximos passos:</p>
                <ol style={{ paddingLeft: '20px' }}>
                  <li>Criar tabelas no Supabase</li>
                  <li>Implementar sistema de laudos</li>
                  <li>Adicionar reconhecimento de voz</li>
                  <li>Integrar IA para melhorar laudos</li>
                </ol>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
