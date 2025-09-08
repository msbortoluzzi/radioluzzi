import { NextResponse } from "next/server";
import Parser from "rss-parser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ===== Feeds RSS (edite à vontade) =====
const FEEDS: { url: string; fonte?: string; categoria?: string }[] = [
  { url: "https://pubs.rsna.org/action/showFeed?type=etoc&feed=rss&jc=radiology",      fonte: "Radiology (RSNA)" },
  { url: "https://pubs.rsna.org/action/showFeed?type=etoc&feed=rss&jc=radiographics",  fonte: "RadioGraphics (RSNA)" },
  { url: "https://www.ajronline.org/action/showFeed?type=etoc&feed=rss&jc=ajr",        fonte: "AJR" },
  { url: "https://link.springer.com/search.rss?facet-content-type=Article&facet-journal-id=330&channel-name=European+Radiology", fonte: "European Radiology" },
  { url: "https://link.springer.com/search.rss?facet-content-type=Article&facet-journal-id=13244&channel-name=Insights+into+Imaging", fonte: "Insights into Imaging" },
  { url: "https://radiopaedia.org/articles.rss",                                       fonte: "Radiopaedia" },
  { url: "https://www.sciencedaily.com/rss/health_medicine/radiology.xml",             fonte: "ScienceDaily — Radiology" },
];

// ===== Fallback se todos falharem =====
const FALLBACK = [
  {
    id: "f1",
    titulo: "Diretrizes BI-RADS 2024 — atualizações",
    resumo: "Atualização de critérios para mamografia digital e tomossíntese.",
    fonte: "ACR",
    categoria: "Mamografia",
    data: new Date().toISOString(),
    link: "https://www.google.com/search?q=BI-RADS+2024+radiology",
  },
  {
    id: "f2",
    titulo: "IA na detecção de nódulos pulmonares",
    resumo: "Multicêntrico com alta sensibilidade em detecção precoce.",
    fonte: "Radiology (RSNA)",
    categoria: "Tórax",
    data: new Date().toISOString(),
    link: "https://www.google.com/search?q=AI+pulmonary+nodule+radiology",
  },
];

type RssItem = {
  title?: string;
  link?: string;
  content?: string;
  contentSnippet?: string;
  isoDate?: string;
  pubDate?: string;
};

type Artigo = {
  id: string;
  titulo: string;
  resumo: string;
  fonte: string;
  categoria: string;
  data: string; // ISO
  link: string;
};

const parser = new Parser({
  headers: {
    "User-Agent": "Radioluzzi/1.0 (+contact@radioluzzi.local)",
    Accept: "application/rss+xml, application/atom+xml, text/xml, */*",
  },
});

// ===== Scoring (relevância) =====
// 1) Peso por fonte (revistas científicas > portais de notícia)
const SOURCE_WEIGHTS: Record<string, number> = {
  "Radiology (RSNA)": 40,
  "RadioGraphics (RSNA)": 35,
  "AJR": 35,
  "European Radiology": 32,
  "Insights into Imaging": 25,
  "Radiopaedia": 22,
  "ScienceDaily — Radiology": 10,
};

// 2) Boosts de palavras-chave (título/descrição)
const BOOST_PATTERNS: Array<{ re: RegExp; points: number }> = [
  // alta evidência / guias
  { re: /\b(systematic review|meta[-\s]?analysis|consensus|guideline|recommendation|practice parameter|white paper)\b/i, points: 30 },
  { re: /\b(multicenter|randomi[sz]ed|trial)\b/i, points: 18 },
  { re: /\b(update|revised|v2\.1|202\d|202[45])\b/i, points: 10 },

  // desempenho diagnóstico
  { re: /\b(sensitivity|specificity|auc|diagnostic performance|accuracy)\b/i, points: 10 },

  // IA
  { re: /\b(deep learning|machine learning|artificial intelligence|AI)\b/i, points: 8 },

  // penalidades
  { re: /\b(case report|pictorial essay|letter to the editor|editorial|news)\b/i, points: -20 },
];

// 3) Heurística de categoria (ajuda quando o feed não fornece)
function guessCategory(title: string, feedHint?: string): string {
  const hay = `${title} ${feedHint || ""}`.toLowerCase();
  if (/(mama|mamogr|bi-?rads)/.test(hay)) return "Mamografia";
  if (/(pi-?rads|pr[óo]stata|mp-?mri|prostate)/.test(hay)) return "Ressonância";
  if (/(^|\b)ct(\b|[^a-z])|tomografia/.test(hay)) return "Tomografia";
  if (/(ultra(?:som|sound)|ti-?rads|tire[óo]ide|thyroid)/.test(hay)) return "Ultrassom";
  if (/(t[óo]rax|pulm|lung|peito)/.test(hay)) return "Tórax";
  if (/(intervencionista|emboliza|ablação|ablation|interventional)/.test(hay)) return "Intervencionista";
  if (/(radioprote[cç][aã]o|dosimetr|icrp|radiation protection)/.test(hay)) return "Radioproteção";
  return "Geral";
}

function stripHtml(s?: string) {
  return (s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function hostnameFrom(url?: string): string {
  try { return url ? new URL(url).hostname.replace(/^www\./, "") : ""; }
  catch { return ""; }
}

// nota: recência com decaimento exponencial (~45 dias de meia-vida)
function recencyScore(iso: string): number {
  const days = Math.max(0, (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, Math.round(60 * Math.exp(-days / 45)));
}

function keywordBoost(title: string, resumo: string): number {
  const hay = `${title} ${resumo}`;
  return BOOST_PATTERNS.reduce((acc, { re, points }) => (re.test(hay) ? acc + points : acc), 0);
}

function sourceBase(fonte: string): number {
  return SOURCE_WEIGHTS[fonte] ?? 15; // default
}

function scoreArticle(a: Artigo): number {
  let s = 0;
  s += sourceBase(a.fonte);
  s += recencyScore(a.data);
  s += keywordBoost(a.titulo, a.resumo);
  // bônus pequeno se tiver resumo
  if (a.resumo && a.resumo.length > 80) s += 3;
  return s;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const perFeed = Number(url.searchParams.get("perFeed") || 8);
  const maxTotal = Number(url.searchParams.get("max") || 40);
  const minScore = Number(url.searchParams.get("minScore") || 60);
  const windowDays = url.searchParams.get("windowDays"); // opcional (ex.: 120)
  const debug = url.searchParams.get("debug") === "1";

  const results = await Promise.allSettled(
    FEEDS.map(async (f) => {
      try {
        const res = await fetch(f.url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const xml = await res.text();
        const parsed = await parser.parseString(xml);
        const items: RssItem[] = (parsed.items as any) || [];
        const hostname = hostnameFrom(f.url);
        const fonte = f.fonte || (parsed.title || hostname || "RSS");

        const mapped: Artigo[] = items.slice(0, perFeed).map((it, idx) => {
          const titulo = it.title?.trim() || "(Sem título)";
          const link =
            (it.link || "").trim() ||
            `https://www.google.com/search?q=${encodeURIComponent(titulo)}`;
          const resumo = stripHtml(it.contentSnippet || it.content);
          const dataISO = it.isoDate || it.pubDate || new Date().toISOString();
          const cat = f.categoria || guessCategory(titulo, fonte);
          return {
            id: `${hostname}-${idx}-${Buffer.from(link).toString("base64").slice(0, 18)}`,
            titulo,
            resumo,
            fonte,
            categoria: cat,
            data: new Date(dataISO).toISOString(),
            link,
          };
        });

        return mapped;
      } catch {
        return [] as Artigo[];
      }
    })
  );

  // Junta, deduplica e aplica janela temporal (se pedida)
  const seen = new Set<string>();
  let all: Artigo[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      for (const a of r.value) {
        const key = a.link || a.titulo.toLowerCase();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        all.push(a);
      }
    }
  }

  if (windowDays) {
    const maxAgeMs = Number(windowDays) * 24 * 60 * 60 * 1000;
    const cutoff = Date.now() - maxAgeMs;
    all = all.filter((a) => new Date(a.data).getTime() >= cutoff);
  }

  // Scoring, filtro e ordenação
  const withScores = all
    .map((a) => ({ a, score: scoreArticle(a) }))
    .filter(({ score }) => score >= minScore)
    .sort((x, y) => (y.score - x.score) || (+new Date(y.a.data) - +new Date(x.a.data)));

  let final = withScores.slice(0, maxTotal).map(({ a }) => a);

  if (final.length === 0) {
    return NextResponse.json({ items: FALLBACK, source: "fallback" });
  }

  // modo debug opcional (retorna score junto para inspecionar)
  if (debug) {
    return NextResponse.json({
      items: withScores.slice(0, maxTotal).map(({ a, score }) => ({ ...a, _score: score })),
      source: "rss+relevance",
      minScore,
    });
  }

  return NextResponse.json({ items: final, source: "rss+relevance", minScore });
}
