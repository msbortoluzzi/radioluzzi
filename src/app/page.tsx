"use client";

import { useState, useEffect } from "react";

// Simulação de artigos
const artigosSimulados = [
  {
    id: 1,
    titulo: "Novas Diretrizes para BI-RADS 2024",
    resumo: "Atualização das classificações BI-RADS com novos critérios para mamografia digital e tomossíntese.",
    fonte: "American College of Radiology",
    data: "2024-01-15",
    categoria: "Mamografia",
    link: "#"
  },
  {
    id: 2,
    titulo: "IA na Detecção de Nódulos Pulmonares",
    resumo: "Estudo multicêntrico demonstra eficácia de algoritmos de IA na detecção precoce de câncer de pulmão.",
    fonte: "Radiology Journal",
    data: "2024-01-12",
    categoria: "Tórax",
    link: "#"
  },
  {
    id: 3,
    titulo: "Protocolo Atualizado para TC de Abdome",
    resumo: "Novos protocolos de contraste para TC abdominal visando redução de dose e melhoria diagnóstica.",
    fonte: "European Society of Radiology",
    data: "2024-01-10",
    categoria: "Tomografia",
    link: "#"
  },
  {
    id: 4,
    titulo: "TI-RADS: Critérios Revisados",
    resumo: "Revisão dos critérios TI-RADS para ultrassonografia de tireoide com novos parâmetros de elastografia.",
    fonte: "Thyroid Imaging Society",
    data: "2024-01-08",
    categoria: "Ultrassom",
    link: "#"
  },
  {
    id: 5,
    titulo: "Ressonância Cardíaca: Novas Sequências",
    resumo: "Implementação de novas sequências de RM cardíaca para avaliação de fibrose miocárdica.",
    fonte: "Society for Cardiovascular MR",
    data: "2024-01-05",
    categoria: "Ressonância",
    link: "#"
  },
  {
    id: 6,
    titulo: "Radioproteção: Diretrizes 2024",
    resumo: "Novas diretrizes internacionais para radioproteção em procedimentos diagnósticos e intervencionistas.",
    fonte: "ICRP - International Commission",
    data: "2024-01-03",
    categoria: "Radioproteção",
    link: "#"
  }
];

const categorias = ["Todos", "Mamografia", "Tórax", "Tomografia", "Ultrassom", "Ressonância", "Radioproteção"];

export default function HomePage() {
  const [artigos, setArtigos] = useState(artigosSimulados);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [carregando, setCarregando] = useState(false);

  // Simular carregamento de novos artigos
  const atualizarArtigos = async () => {
    setCarregando(true);
    setTimeout(() => {
      setArtigos([...artigosSimulados]);
      setCarregando(false);
    }, 1000);
  };

  // Filtrar artigos por categoria
  const artigosFiltrados = categoriaFiltro === "Todos" 
    ? artigos 
    : artigos.filter(artigo => artigo.categoria === categoriaFiltro);

  // Atualizar artigos ao carregar a página
  useEffect(() => {
    atualizarArtigos();
  }, []);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      color: '#1e293b',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      
      {/* Header */}
      <section style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: '700',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: '1.2'
        }}>
          📰 Artigos e Atualizações
        </h1>
        <p style={{ 
          fontSize: '18px', 
          maxWidth: '800px', 
          margin: '0 auto 32px auto', 
          color: '#64748b',
          lineHeight: '1.6',
          fontWeight: '400'
        }}>
          Mantenha-se atualizado com as últimas novidades, diretrizes e avanços em radiologia.
          Conteúdo atualizado automaticamente de fontes confiáveis.
        </p>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '32px'
        }}>
          <button 
            onClick={atualizarArtigos}
            disabled={carregando}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: carregando ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: carregando ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}
          >
            {carregando ? "🔄 Atualizando..." : "🔄 Atualizar Artigos"}
          </button>
          <div style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '400' }}>
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </section>

      {/* Filtros de Categoria */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px', 
          justifyContent: 'center'
        }}>
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaFiltro(categoria)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                backgroundColor: categoriaFiltro === categoria ? '#2563eb' : '#ffffff',
                color: categoriaFiltro === categoria ? 'white' : '#64748b',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: categoriaFiltro === categoria ? '0 2px 8px rgba(37, 99, 235, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              {categoria}
            </button>
          ))}
        </div>
      </section>

      {/* Lista de Artigos */}
      <section>
        <div style={{ display: 'grid', gap: '24px' }}>
          {artigosFiltrados.map((artigo) => (
            <article 
              key={artigo.id} 
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  marginBottom: '12px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    fontSize: '12px',
                    borderRadius: '12px',
                    fontWeight: '500'
                  }}>
                    {artigo.categoria}
                  </span>
                  <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '400' }}>
                    {formatarData(artigo.data)}
                  </span>
                </div>
                
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#1e293b', 
                  marginBottom: '12px',
                  lineHeight: '1.4',
                  margin: '0 0 12px 0'
                }}>
                  {artigo.titulo}
                </h3>
                
                <p style={{ 
                  color: '#64748b', 
                  lineHeight: '1.6', 
                  marginBottom: '16px',
                  fontSize: '16px',
                  fontWeight: '400',
                  margin: '0 0 16px 0'
                }}>
                  {artigo.resumo}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#94a3b8', 
                    fontStyle: 'italic',
                    fontWeight: '400'
                  }}>
                    Fonte: {artigo.fonte}
                  </span>
                  <button 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 16px',
                      backgroundColor: '#f8fafc',
                      color: '#2563eb',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.color = '#2563eb';
                    }}
                  >
                    📖 Ler Mais
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {artigosFiltrados.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px 0',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📰</div>
            <h3 style={{ marginBottom: '8px', color: '#1e293b', fontWeight: '600' }}>Nenhum artigo encontrado</h3>
            <p style={{ color: '#64748b', fontWeight: '400' }}>
              Não há artigos disponíveis para a categoria "{categoriaFiltro}".
            </p>
          </div>
        )}
      </section>

      {/* Estatísticas do Feed */}
      <section style={{ marginTop: '48px' }}>
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '24px', color: '#1e293b', fontWeight: '600' }}>📊 Estatísticas do Feed</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '24px'
          }}>
            <div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#2563eb', 
                marginBottom: '8px' 
              }}>
                {artigos.length}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                Artigos Disponíveis
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#059669', 
                marginBottom: '8px' 
              }}>
                {categorias.length - 1}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                Categorias
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#d97706', 
                marginBottom: '8px' 
              }}>
                Diário
              </div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                Frequência de Atualização
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#dc2626', 
                marginBottom: '8px' 
              }}>
                15+
              </div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                Fontes Confiáveis
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informações sobre Fontes */}
      <section style={{ marginTop: '32px' }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ marginBottom: '16px', color: '#1e293b', fontWeight: '600' }}>📚 Sobre as Fontes</h3>
          <p style={{ 
            marginBottom: '16px', 
            lineHeight: '1.6',
            color: '#64748b',
            fontWeight: '400'
          }}>
            Os artigos são coletados automaticamente de fontes confiáveis e atualizados diariamente:
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <h4 style={{ 
                fontSize: '16px', 
                color: '#1e293b', 
                marginBottom: '8px',
                fontWeight: '600'
              }}>
                🏥 Sociedades Médicas
              </h4>
              <ul style={{ 
                color: '#64748b', 
                fontSize: '14px', 
                lineHeight: '1.6',
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontWeight: '400'
              }}>
                <li>• American College of Radiology (ACR)</li>
                <li>• European Society of Radiology (ESR)</li>
                <li>• Colégio Brasileiro de Radiologia (CBR)</li>
              </ul>
            </div>
            <div>
              <h4 style={{ 
                fontSize: '16px', 
                color: '#1e293b', 
                marginBottom: '8px',
                fontWeight: '600'
              }}>
                📖 Journals Científicos
              </h4>
              <ul style={{ 
                color: '#64748b', 
                fontSize: '14px', 
                lineHeight: '1.6',
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontWeight: '400'
              }}>
                <li>• Radiology Journal</li>
                <li>• European Radiology</li>
                <li>• Journal of Medical Imaging</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
