import type { StatusClassificacao } from "../../domain/tipos";

export type FiltroGrupo = "Todos" | string;
export type FiltroStatus = "Todos" | StatusClassificacao;

interface FiltrosProps {
  grupos: string[];
  grupo: FiltroGrupo;
  status: FiltroStatus;
  onGrupoChange: (grupo: FiltroGrupo) => void;
  onStatusChange: (status: FiltroStatus) => void;
}

const STATUS: FiltroStatus[] = ["Todos", "Classificada", "Em disputa", "Eliminada"];

const seletor =
  "rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:border-slate-500 focus:outline-none";

export function Filtros({ grupos, grupo, status, onGrupoChange, onStatusChange }: FiltrosProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
        Grupo
        <select className={seletor} value={grupo} onChange={(e) => onGrupoChange(e.target.value)}>
          <option value="Todos">Todos</option>
          {grupos.map((g) => (
            <option key={g} value={g}>
              Grupo {g}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
        Status
        <select
          className={seletor}
          value={status}
          onChange={(e) => onStatusChange(e.target.value as FiltroStatus)}
        >
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
