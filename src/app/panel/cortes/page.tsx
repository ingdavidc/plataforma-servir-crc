"use client";

import { useEffect, useState, useCallback } from "react";

interface CertificadoCorte {
  id: string;
  numeroCertificado: string;
  fechaExpedicion: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  dictamen: string;
  estado: string;
  sincronizadoEn: string;
  crc: {
    nombre: string;
    codigoControl: string;
  };
}

interface CortesData {
  fecha: string;
  totalDia: number;
  corte0900: {
    horaCorte: string;
    total: number;
    certificados: CertificadoCorte[];
  };
  corte1630: {
    horaCorte: string;
    total: number;
    certificados: CertificadoCorte[];
  };
  todos: CertificadoCorte[];
}

export default function CortesDiariosPage() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [fecha, setFecha] = useState(todayStr);
  const [tab, setTab] = useState<"corte0900" | "corte1630" | "todos">("todos");
  const [data, setData] = useState<CortesData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCortes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/panel/cortes?fecha=${fecha}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [fecha]);

  useEffect(() => {
    loadCortes();
  }, [loadCortes]);

  function getActiveList(): CertificadoCorte[] {
    if (!data) return [];
    if (tab === "corte0900") return data.corte0900.certificados;
    if (tab === "corte1630") return data.corte1630.certificados;
    return data.todos;
  }

  function exportCSV() {
    const list = getActiveList();
    if (list.length === 0) return;

    const headers = [
      "No. Certificado",
      "Fecha Expedicion",
      "Nombre del Usuario",
      "Tipo Doc",
      "Numero Identificacion",
      "Dictamen",
      "Estado",
      "Hora Registro",
      "Institucion",
    ];

    const rows = list.map((c) => [
      `"${c.numeroCertificado}"`,
      `"${new Date(c.fechaExpedicion).toLocaleDateString("es-CO")}"`,
      `"${c.nombres} ${c.apellidos}"`,
      `"${c.tipoDocumento}"`,
      `"${c.numeroDocumento}"`,
      `"${c.dictamen}"`,
      `"${c.estado}"`,
      `"${new Date(c.sincronizadoEn).toLocaleTimeString("es-CO")}"`,
      `"${c.crc.nombre}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `corte_res2056_${fecha}_${tab}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Cortes Diarios Oficiales (Resolución 2056 de 2007)
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Art. 4 Parágrafo: Publicación obligatoria con cortes a las 09:00 hrs y 16:30 hrs para DGSM y DCCAE
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
          <label className="text-xs font-semibold text-gray-500">Fecha del Corte:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="text-sm font-semibold text-gray-900 border-none focus:outline-none"
          />
        </div>
      </div>

      {/* Legal Requirement Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-3">
        <span className="text-xl">⚖️</span>
        <div>
          <p className="font-bold">Disposición Legal Art. 4 Parágrafo Res. 2056 de 2007:</p>
          <p className="mt-0.5 text-blue-800">
            «...en su página web deberá publicar una relación de los certificados que vaya expidiendo en el transcurso del día,
            en donde se indiquen los números del certificado, la fecha de expedición, nombre del usuario y su número de identificación,
            con corte a las 9:00 horas y a las 16:30 horas del día...»
          </p>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("todos")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              tab === "todos"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Todos del Día ({data?.todos.length || 0})
          </button>
          <button
            onClick={() => setTab("corte0900")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              tab === "corte0900"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Corte 09:00 AM ({data?.corte0900.total || 0})
          </button>
          <button
            onClick={() => setTab("corte1630")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              tab === "corte1630"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Corte 16:30 PM ({data?.corte1630.total || 0})
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-sm"
          >
            <span>Descargar CSV / Excel</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3.5 py-2 rounded-lg border border-gray-200 transition-colors shadow-sm"
          >
            <span>Imprimir Relación</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Relación Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Generando relación del corte...</p>
          </div>
        ) : getActiveList().length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">
            No hay certificados expedidos para este corte en la fecha {fecha}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">No. Certificado</th>
                  <th className="px-6 py-3">Fecha Expedición</th>
                  <th className="px-6 py-3">Nombre del Usuario</th>
                  <th className="px-6 py-3">No. Identificación</th>
                  <th className="px-6 py-3">Dictamen</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3">Hora Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {getActiveList().map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900 text-xs">
                      {cert.numeroCertificado}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(cert.fechaExpedicion).toLocaleDateString("es-CO")}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {cert.nombres} {cert.apellidos}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {cert.tipoDocumento} {cert.numeroDocumento}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                          cert.dictamen === "APTO"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {cert.dictamen}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          cert.estado === "VIGENTE"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {cert.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">
                      {new Date(cert.sincronizadoEn).toLocaleTimeString("es-CO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
