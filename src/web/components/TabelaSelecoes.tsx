import type { SelecaoCalculada } from "../../domain/tipos";
import { formatarAproveitamento, formatarSaldo, formatarVED } from "../formato";
import { StatusBadge } from "./StatusBadge";

const COLUNAS = ["#", "", "Seleção", "Grupo", "J", "V-E-D", "Saldo", "Pts", "Aproveit.", "Status"];

export function TabelaSelecoes({ selecoes }: { selecoes: SelecaoCalculada[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100 text-left text-slate-600">
            {COLUNAS.map((coluna, i) => (
              <th key={i} className="px-3 py-2 font-semibold whitespace-nowrap">
                {coluna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {selecoes.map((s) => (
            <tr key={s.id} className="border-t border-slate-200 hover:bg-slate-50">
              <td className="px-3 py-2 font-semibold text-slate-500">{s.posicao}</td>
              <td className="px-3 py-2 text-xl" aria-label={`Bandeira ${s.selecao}`}>
                {s.bandeira}
              </td>
              <td className="px-3 py-2 font-medium text-slate-900">{s.selecao}</td>
              <td className="px-3 py-2">{s.grupo}</td>
              <td className="px-3 py-2 tabular-nums">{s.jogos}</td>
              <td className="px-3 py-2 tabular-nums">{formatarVED(s)}</td>
              <td className="px-3 py-2 tabular-nums">{formatarSaldo(s.saldo)}</td>
              <td className="px-3 py-2 font-semibold tabular-nums">{s.pontos}</td>
              <td className="px-3 py-2 font-semibold tabular-nums">{formatarAproveitamento(s.aproveitamento)}</td>
              <td className="px-3 py-2">
                <StatusBadge status={s.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
