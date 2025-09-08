"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContrastesPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">
        Protocolos de Contrastes
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Protocolo 01 */}
        <Link href="/protocolos/contrastes/01">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">01</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Protocolo 02 */}
        <Link href="/protocolos/contrastes/02">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">02</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
