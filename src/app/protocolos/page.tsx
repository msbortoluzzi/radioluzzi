"use client";

import Link from "next/link";

export default function Page() {
  const protocolos = [
    {
      titulo: "Contrastes",
      descricao: "Protocolos de uso de contraste em TC e RM.",
      href: "/protocolos/contrastes",
    },
    {
      titulo: "Dessensibilização",
      descricao: "Protocolos para alergia e dessensibilização a contraste.",
      href: "/protocolos/dessensibilizacao",
    },
    {
      titulo: "Extravasamento",
      descricao: "Conduta frente a extravasamento de contraste.",
      href: "/protocolos/extravasamento",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Protocolos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {protocolos.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="border border-[#222222] rounded-2xl shadow-md p-6 hover:shadow-lg hover:border-blue-500 transition bg-[#111111]"
          >
            <h2 className="text-xl font-semibold text-gray-100 mb-2">{item.titulo}</h2>
            <p className="text-base text-gray-400">{item.descricao}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
