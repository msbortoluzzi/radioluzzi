export default function AssinarPage() {
  return (
    <main className="max-w-xl mx-auto py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-100">Assine o Radioluzzi PRO</h1>
        <p className="text-sm text-gray-400">1 plano único, ilimitado, com acesso a todos os recursos.</p>
      </div>

      <ul className="list-disc pl-5 space-y-2 text-gray-200">
        <li>Laudos ilimitados</li>
        <li>Máscaras configuráveis</li>
        <li>IA e voz (quando ativado)</li>
        <li>Calculadoras e protocolos</li>
      </ul>

      <div className="border border-[#1f1f1f] rounded-xl p-4 bg-[#0f0f0f]">
        <p className="text-2xl font-semibold text-gray-100">R$ 24,90/mês</p>
        <p className="text-sm text-gray-400">Sem limite de laudos. Cancele quando quiser.</p>
        <p className="text-sm text-gray-500 mt-2">Anual sugerido: R$ 199/ano (economia aproximada).</p>
      </div>

      <div className="space-y-2 text-gray-200">
        <p className="text-sm">Enquanto não ativamos pagamento automático, fale comigo para ativar:</p>
        <p className="text-sm">
          <strong>WhatsApp:</strong> (xx) xxxxx-xxxx<br />
          <strong>E-mail:</strong> seuemail@dominio.com
        </p>
      </div>

      <p className="text-xs text-gray-500">
        Após o pagamento/manual, marcamos seu perfil como ativo (`status = active`, `plano = pro`, `assinatura_expira_em` ajustado).
        Você será redirecionado automaticamente para o app.
      </p>
    </main>
  );
}
