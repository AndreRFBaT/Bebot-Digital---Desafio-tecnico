import { useMemo, useState } from "react";
import type { SelecaoCalculada } from "../../domain/tipos";
import { Filtros, type FiltroGrupo, type FiltroStatus } from "./Filtros";
import { TabelaSelecoes } from "./TabelaSelecoes";

/**
 * Lista todas as seleções (panorama das próximas rodadas) com filtros por
 * grupo e por status de classificação.
 */
export function ListaProximasRodadas({ selecoes }: { selecoes: SelecaoCalculada[] }) {
  const [grupo, setGrupo] = useState<FiltroGrupo>("Todos");
  const [status, setStatus] = useState<FiltroStatus>("Todos");

  const grupos = useMemo(
    () => [...new Set(selecoes.map((s) => s.grupo))].sort(),
    [selecoes],
  );

  const filtradas = useMemo(
    () =>
      selecoes.filter(
        (s) => (grupo === "Todos" || s.grupo === grupo) && (status === "Todos" || s.status === status),
      ),
    [selecoes, grupo, status],
  );

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Panorama das próximas rodadas</h2>
          <p className="text-sm text-slate-500">
            Todas as seleções e sua situação na disputa por vaga (top-2 do grupo).
          </p>
        </div>
        <Filtros
          grupos={grupos}
          grupo={grupo}
          status={status}
          onGrupoChange={setGrupo}
          onStatusChange={setStatus}
        />
      </div>

      {filtradas.length > 0 ? (
        <TabelaSelecoes selecoes={filtradas} />
      ) : (
        <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          Nenhuma seleção para os filtros selecionados.
        </p>
      )}
    </section>
  );
}
