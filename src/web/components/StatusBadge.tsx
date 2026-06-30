import type { StatusClassificacao } from "../../domain/tipos";

const ESTILOS: Record<StatusClassificacao, { emoji: string; classe: string }> = {
  Classificada: { emoji: "✅", classe: "bg-green-100 text-green-800" },
  "Em disputa": { emoji: "⚠️", classe: "bg-amber-100 text-amber-800" },
  Eliminada: { emoji: "❌", classe: "bg-red-100 text-red-800" },
};

export function StatusBadge({ status }: { status: StatusClassificacao }) {
  const { emoji, classe } = ESTILOS[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${classe}`}>
      <span aria-hidden>{emoji}</span>
      {status}
    </span>
  );
}
