"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface StatsData {
  totalCertificados: number;
  totalVigentes: number;
  totalVencidos: number;
  totalAnulados: number;
  totalAptos: number;
  totalNoAptos: number;
  certificadosPorCrc: { crc: string; total: number }[];
  recientes: {
    id: string;
    numeroCertificado: string;
    nombres: string;
    apellidos: string;
    tipoDocumento: string;
    numeroDocumento: string;
    dictamen: string;
    estado: string;
    fechaExpedicion: string;
    fechaVencimiento: string;
    crc: { nombre: string };
  }[];
  totalConsultas: number;
}

export default function PanelDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/panel/estadisticas");
        if (!res.ok) {
          throw new Error("Error al obtener estadísticas");
        }
        const data = await res.json();
        setStats(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm">Cargando métricas de la plataforma...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-700">
        <p>{error || "No se pudieron cargar los datos del panel"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard de Control y Vigilancia</h1>
        <p className="text-gray-500 text-sm mt-1">
          Seguimiento y auditoría de Certificados Médicos de Aptitud Psicofísica (Resolución 2056 de 2007)
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Expedidos
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center font-bold">
              📄
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mt-3">{stats.totalCertificados}</p>
          <p className="text-xs text-gray-400 mt-1">Sincronizados en plataforma</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">
              Certificados Vigentes
            </span>
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center font-bold">
              ✓
            </div>
          </div>
          <p className="text-3xl font-extrabold text-green-600 mt-3">{stats.totalVigentes}</p>
          <p className="text-xs text-gray-400 mt-1">Validez menor a 60 días</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Certificados Vencidos
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              ⏱
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-600 mt-3">{stats.totalVencidos}</p>
          <p className="text-xs text-gray-400 mt-1">Expirados por fecha</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Consultas y Verificaciones
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-accent flex items-center justify-center font-bold">
              🔍
            </div>
          </div>
          <p className="text-3xl font-extrabold text-primary mt-3">{stats.totalConsultas}</p>
          <p className="text-xs text-gray-400 mt-1">Trazabilidad y auditoría</p>
        </div>
      </div>

      {/* Two columns: Dictamen breakdown + Quick Action banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dictamenes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Distribución por Dictamen</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-green-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  APTO
                </span>
                <span className="font-bold text-gray-900">{stats.totalAptos}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${stats.totalCertificados ? (stats.totalAptos / stats.totalCertificados) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-red-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  NO APTO
                </span>
                <span className="font-bold text-gray-900">{stats.totalNoAptos}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${stats.totalCertificados ? (stats.totalNoAptos / stats.totalCertificados) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Instituciones Registradas
            </h3>
            {stats.certificadosPorCrc.map((c, i) => (
              <div key={i} className="flex justify-between items-center text-xs py-1.5">
                <span className="text-gray-700 truncate max-w-[200px]">{c.crc}</span>
                <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                  {c.total} certs
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cortes Diarios Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0c232e] via-[#008b85] to-[#00a59e] text-white rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#ff9900]/20 border border-[#ff9900]/40 text-[#ffb84d] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <span>Resolución 2056 de 2007 — Art. 4</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Cortes Diarios para Sanidad Militar y DCCAE</h2>
            <p className="text-teal-50/90 text-sm leading-relaxed mb-4">
              La resolución exige la generación y reporte de certificados con dos cortes diarios:
              a las <strong className="text-white">09:00 horas</strong> y a las <strong className="text-white">16:30 horas</strong>.
              Consulte la relación diaria de aspirantes evaluados por OdontoMedicina Servir CRC, exporte consolidados o verifique reportes para las seccionales.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/20">
            <Link
              href="/panel/cortes"
              className="bg-[#f58220] hover:bg-[#dc7016] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg"
            >
              Ver Cortes Diarios de Hoy →
            </Link>
            <Link
              href="/panel/certificados"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors border border-white/20"
            >
              Buscador Avanzado de Certificados
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Certificates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Últimos Certificados Registrados</h2>
            <p className="text-xs text-gray-500">Certificados sincronizados recientemente desde las sedes CRC</p>
          </div>
          <Link
            href="/panel/certificados"
            className="text-primary hover:text-accent font-semibold text-xs transition-colors"
          >
            Ver todos los certificados →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Consecutivo</th>
                <th className="px-6 py-3">Aspirante</th>
                <th className="px-6 py-3">Documento</th>
                <th className="px-6 py-3">Dictamen</th>
                <th className="px-6 py-3">Vigencia</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recientes.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-gray-900 text-xs">
                    {cert.numeroCertificado}
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
                  <td className="px-6 py-4 text-xs">
                    {formatDate(cert.fechaExpedicion)} - {formatDate(cert.fechaVencimiento)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        cert.estado === "VIGENTE"
                          ? "bg-green-100 text-green-800"
                          : cert.estado === "VENCIDO"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {cert.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/panel/certificados?buscar=${cert.numeroDocumento}`}
                      className="text-accent hover:underline text-xs font-semibold"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
