"use client";

import { useState, useEffect } from "react";

// Simulação de mais artigos para a página dedicada
const todosArtigos = [
  {
    id: 1,
    titulo: "Novas Diretrizes para BI-RADS 2024",
    resumo: "Atualização das classificações BI-RADS com novos critérios para mamografia digital e tomossíntese. Inclui mudanças significativas na categorização de lesões suspeitas.",
    fonte: "American College of Radiology",
    data: "2024-01-15",
    categoria: "Mamografia",
    link: "#",
    destaque: true
  },
  {
    id: 2,
    titulo: "IA na Detecção de Nódulos Pulmonares",
    resumo: "Estudo multicêntrico demonstra eficácia de algoritmos de IA na detecção precoce de câncer de pulmão, com sensibilidade superior a 95%.",
    fonte: "Radiology Journal",
    data: "2024-01-12",
    categoria: "Tórax",
    link: "#",
    destaque: true
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
  },
  {
    id: 7,
    titulo: "Elastografia Hepática: Novos Valores de Referência",
    resumo: "Atualização dos valores de referência para elastografia hepática em diferentes populações.",
    fonte: "Hepatology Radiology",
    data: "2024-01-01",
    categoria: "Ultrassom",
    link: "#"
  },
  {
    id: 8,
    titulo: "RM de Próstata: PI-RADS v2.1",
    resumo: "Lançamento da versão 2.1 do PI-RADS com refinamentos na avaliação de lesões prostáticas.",
    fonte: "European Society of Urogenital Radiology",
    data: "2023-12-28",
    categoria: "Ressonância",
    link: "#"
  }
];

const categorias = ["Todos", "Mamografia", "Tórax", "Tomografia", "Ultrassom", "Ressonância", "Radioproteção"];

export default function ArtigosPage() {
  const [artigos, setArtigos] = useState(todosArtigos);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [carregando, setCarregando] = useState(false);
  const [busca, setBusca] = useState("");

  // Simular carregamento de novos artigos
  const atualizarArtigos = async () => {
    setCarregando(true);
    setTimeout(() => {
      setArtigos([...todosArtigos]);
      setCarregando(false);
    }, 1500);
  };

  // Filtrar artigos por categoria e busca
  const artigosFiltrados = artigos.filter(artigo => {
    const matchCategoria = categoriaFiltro === "Todos" || artigo.categoria === categoriaFiltro;
    const matchBusca = busca === "" || 
      artigo.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      artigo.resumo.toLowerCase().includes(busca.toLowerCase()) ||
      artigo.fonte.toLowerCase().includes(busca.toLowerCase());
    
    return matchCategoria && matchBusca;
  });

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 style={{ fontSize: '36px', marginBottom: '16px' }}>
          📰 Central de Artigos
        </h1>
        <p style={{ fontSize: '18px', maxWidth: '800px', margin: '0 auto', color: '#94a3b8' }}>
          Biblioteca completa de artigos, diretrizes e atualizações em radiologia.
          Conteúdo curado de fontes científicas confiáveis.
        </p>
      </section>

      {/* Controles */}
      <section className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Busca */}
          <div>
            <input
              type="text"
              placeholder="🔍 Buscar artigos por título, conteúdo ou fonte..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="input-modern"
              style={{ 
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* Filtros e Atualizar */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  onClick={() => setCategoriaFiltro(categoria)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid #64748b',
                    backgroundColor: categoriaFiltro === categoria ? '#2563eb' : 'rgba(51, 65, 85, 0.5)',
                    color: categoriaFiltro === categoria ? 'white' : '#cbd5e1',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {categoria}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={atualizarArtigos}
                className="btn-primary"
                disabled={carregando}
                style={{ 
                  opacity: carregando ? 0.7 : 1,
                  padding: '8px 16px',
                  fontSize: '14px'
                }}
              >
                {carregando ? "🔄 Atualizando..." : "🔄 Atualizar"}
              </button>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {artigosFiltrados.length} artigo(s) encontrado(s)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artigos em Destaque */}
      {categoriaFiltro === "Todos" && busca === "" && (
        <section>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#f1f5f9' }}>
            ⭐ Artigos em Destaque
          </h2>
          <div className="grid grid-2" style={{ gap: '24px', marginBottom: '32px' }}>
            {artigos.filter(artigo => artigo.destaque).map((artigo) => (
              <article key={artigo.id} className="card" style={{ 
                padding: '24px',
                border: '2px solid #2563eb',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(30, 41, 59, 0.5))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>⭐</span>
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
                  <span style={{ fontSize: '14px', color: '#64748b' }}>
                    {formatarData(artigo.data)}
                  </span>
                </div>
                
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#f1f5f9', 
                  marginBottom: '12px',
                  lineHeight: '1.4'
                }}>
                  {artigo.titulo}
                </h3>
                
                <p style={{ 
                  color: '#cbd5e1', 
                  lineHeight: '1.6', 
                  marginBottom: '16px',
                  fontSize: '16px'
                }}>
                  {artigo.resumo}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid #334155'
                }}>
                  <span style={{ fontSize: '14px', color: '#94a3b8', fontStyle: 'italic' }}>
                    {artigo.fonte}
                  </span>
                  <button 
                    className="btn-primary"
                    style={{ padding: '6px 16px', fontSize: '14px' }}
                  >
                    📖 Ler Artigo
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Lista Completa de Artigos */}
      <section>
        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#f1f5f9' }}>
          📚 Todos os Artigos
        </h2>
        <div className="grid" style={{ gap: '16px' }}>
          {artigosFiltrados.filter(artigo => !artigo.destaque || categoriaFiltro !== "Todos" || busca !== "").map((artigo) => (
            <article key={artigo.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: '#475569',
                      color: 'white',
                      fontSize: '12px',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      {artigo.categoria}
                    </span>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>
                      {formatarData(artigo.data)}
                    </span>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: '#f1f5f9', 
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}>
                    {artigo.titulo}
                  </h3>
                  
                  <p style={{ 
                    color: '#cbd5e1', 
                    lineHeight: '1.6', 
                    marginBottom: '12px',
                    fontSize: '14px'
                  }}>
                    {artigo.resumo}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                      {artigo.fonte}
                    </span>
                    <button 
                      className="btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '12px' }}
                    >
                      📖 Ler
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {artigosFiltrados.length === 0 && (
          <div className="text-center" style={{ padding: '48px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ marginBottom: '8px' }}>Nenhum artigo encontrado</h3>
            <p style={{ color: '#94a3b8' }}>
              Tente ajustar os filtros ou termos de busca.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
