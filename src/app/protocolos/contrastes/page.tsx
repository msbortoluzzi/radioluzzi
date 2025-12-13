"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const calcCards = [
  { slug: "/protocolos/contrastes/dose", title: "Dose de contraste", desc: "Calcule dose por peso e fator (mL)." },
  { slug: "/protocolos/contrastes/gfr", title: "eGFR (contraste)", desc: "CKD-EPI 2021 — estratificar risco antes do contraste." }
];

const protoCards = [
  { slug: "/protocolos/contrastes/01", title: "Protocolo 01", desc: "" },
  { slug: "/protocolos/contrastes/02", title: "Protocolo 02", desc: "" }
];

export default function ContrastesPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Protocolos de Contrastes</h1>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Calculadoras</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {calcCards.map((c) => (
            <Link key={c.slug} href={c.slug}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Protocolos</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {protoCards.map((c) => (
            <Link key={c.slug} href={c.slug}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
