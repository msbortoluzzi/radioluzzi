export type Plano = "none" | "pro";
export type StatusAssinatura = "inactive" | "active" | "cancelled";

export interface Profile {
  id: string;
  nome?: string | null;
  especialidade?: string | null;
  plano: Plano;
  status: StatusAssinatura;
  assinatura_expira_em?: string | null;
  created_at: string;
}
