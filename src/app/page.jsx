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
          const itens = Array.isArray(data.items) ? data.items : [];
          const vistos = new Set();
          const unicos = itens.filter((item) => {
            const key = item.link || item.id;
            if (!key || vistos.has(key)) return false;
            vistos.add(key);
            return true;
          });
          setArtigos(unicos);
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
    carregar();
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

  const { totalFontes } = useMemo(() => {
    const setHosts = new Set(artigos.map((a) => dominio(a.link)).filter(Boolean));
    return { totalFontes: setHosts.size };
  }, [artigos]);

  return (
    <div className="space-y-8 text-gray-100">
      <section className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-100">Radioluzzi</h1>
        <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto">
          &quot;It only takes one win to change your trajectory&quot;
        </p>
        {aviso && <p className="text-amber-400 text-sm">Aviso: {aviso}</p>}
      </section>

      {carregando && (
        <div className="text-center text-gray-400">Carregando artigos...</div>
      )}

      <section>
        <div className="grid grid-cols-1 gap-4">
          {artigos.map((artigo, idx) => (
            <article
              key={`${artigo.link || artigo.id || idx}`}
              className="border border-[#222222] bg-[#111111] rounded-lg p-5 hover:border-blue-500 transition-colors"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="inline-flex items-center rounded-full bg-blue-500/20 text-blue-400 px-3 py-1">
                    {artigo.categoria}
                  </span>
                  <span className="text-gray-400">{formatarData(artigo.data)}</span>
                </div>

                <h3 className="text-lg md:text-xl font-semibold leading-snug text-gray-100">
                  {artigo.titulo}
                </h3>

                {artigo.resumo && (
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {artigo.resumo}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs italic text-gray-500">
                    {artigo.fonte || dominio(artigo.link)}
                  </span>
                  <a
                    href={artigo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                  >
                    Ler Artigo
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!carregando && artigos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">:(</div>
            <h3 className="text-lg font-medium mb-1 text-gray-100">Nenhum artigo encontrado</h3>
            <p className="text-gray-400">Tente novamente mais tarde.</p>
          </div>
        )}
      </section>
    </div>
  );
}
