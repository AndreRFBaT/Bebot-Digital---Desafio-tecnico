import { useQuery } from "@tanstack/react-query";
import { buscarSelecoes, buscarTop5 } from "../api";
import { baixarCsv } from "../csv";
import { ListaProximasRodadas } from "./ListaProximasRodadas";
import { TabelaSelecoes } from "./TabelaSelecoes";

export function TermometroPage() {
  const top5 = useQuery({ queryKey: ["top5"], queryFn: buscarTop5 });
  const todas = useQuery({ queryKey: ["selecoes"], queryFn: buscarSelecoes });

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">🌡️ Termômetro da Copa 2026</h1>
        <p className="text-sm text-slate-500">
          Top 5 seleções por aproveitamento — fase de grupos (após a 2ª rodada).
        </p>
      </header>

      <section className="mb-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Top 5 por aproveitamento</h2>
          <button
            type="button"
            onClick={() => top5.data && baixarCsv(top5.data)}
            disabled={!top5.data?.length}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Exportar CSV
          </button>
        </div>

        {top5.isLoading && <Aviso>Carregando…</Aviso>}
        {top5.isError && <Aviso erro>Erro ao carregar: {(top5.error as Error).message}</Aviso>}
        {top5.data && <TabelaSelecoes selecoes={top5.data} />}
      </section>

      {todas.isLoading && <Aviso>Carregando panorama…</Aviso>}
      {todas.isError && <Aviso erro>Erro ao carregar: {(todas.error as Error).message}</Aviso>}
      {todas.data && <ListaProximasRodadas selecoes={todas.data} />}
    </main>
  );
}

function Aviso({ children, erro }: { children: React.ReactNode; erro?: boolean }) {
  return (
    <p
      className={`rounded-lg border p-4 text-sm ${
        erro ? "border-red-200 bg-red-50 text-red-700" : "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {children}
    </p>
  );
}
