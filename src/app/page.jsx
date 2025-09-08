// src/app/page.jsx
"use client";

import { useEffect, useState, useMemo } from "react";

export default function HomePage() {
  const [artigos, setArtigos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function carregar() {
      setCarregando(true);
      setAviso(null);
      try {
        // Mesmos parâmetros de relevância usados na sua página de artigos
        const res = await fetch("/api/artigos?perFeed=6&max=36&minScore=70&windowDays=120", {
          cache: "no-store",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (!ignore) {
            setAviso(data?.error ?? `Falha (${res.status}) ao buscar artigos`);
            setArtigos([]);
          }
          return;
        }
        if (!ignore) {
          setArtigos(Array.isArray(data.items) ? data.items : []);
          if (data?.source === "fallback")
            setAviso("Mostrando lista alternativa (feeds indisponíveis).");
        }
      } catch {
        if (!ignore) {
          setAviso("Falha ao buscar artigos");
          setArtigos([]);
        }
      } finally {
        if (!ignore) setCarregando(false);
      }
    }
    carregar(); // atualiza ao abrir a página
    return () => {
      ignore = true;
    };
  }, []);

  const formatarData = (iso) =>
    new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const dominio = (url) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  };

  // Métricas simples para o bloco "Estatísticas"
  const { totalFontes } = useMemo(() => {
    const setHosts = new Set(artigos.map((a) => dominio(a.link)).filter(Boolean));
    return { totalFontes: setHosts.size };
  }, [artigos]);

  return (
    <div className="space-y-8 text-slate-900">
      {/* Header */}
      <section className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-semibold">📰 </h1>
        <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto">"It only takes one win to change your trajectory"
        </p>
        {aviso && <p className="text-amber-600 text-sm">⚠️ {aviso}</p>}
      </section>

      {carregando && (
        <div className="text-center text-slate-600">🔄 Carregando artigos...</div>
      )}

      {/* Lista de Artigos */}
      <section>
        <div className="grid grid-cols-1 gap-4">
          {artigos.map((artigo) => (
            <article key={artigo.id} className="card p-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-3 py-1">
                    {artigo.categoria}
                  </span>
                  <span className="text-slate-500">{formatarData(artigo.data)}</span>
                </div>

                <h3 className="text-lg md:text-xl font-semibold leading-snug">
                  {artigo.titulo}
                </h3>

                {artigo.resumo && (
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {artigo.resumo}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs italic text-slate-500">
                    {artigo.fonte || dominio(artigo.link)}
                  </span>
                  <a
                    href={artigo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    📖 Ler Artigo
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!carregando && artigos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-lg font-medium mb-1">Nenhum artigo encontrado</h3>
            <p className="text-slate-600">Tente novamente mais tarde.</p>
          </div>
        )}
      </section>
    </div>
  );
}
