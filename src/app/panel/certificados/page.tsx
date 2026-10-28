"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface CertificadoItem {
  id: string;
  numeroCertificado: string;
  codigoVerificacion: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  dictamen: string;
  objetivo: string;
  fechaExpedicion: string;
  fechaVencimiento: string;
  estado: string;
  pdfPath: string;
  crc: {
    nombre: string;
    codigoControl: string;
  };
}

function CertificadosContent() {
  const searchParams = useSearchParams();
  const initialBuscar = searchParams.get("buscar") || "";

  const [certificados, setCertificados] = useState<CertificadoItem[]>([]);
  const [total, setTotal] = useState(0);
  const [buscar, setBuscar] = useState(initialBuscar);
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<CertificadoItem | null>(null);

  const fetchCertificados = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (buscar.trim()) params.append("buscar", buscar.trim());
      if (estado) params.append("estado", estado);

      const res = await fetch(`/api/panel/certificados?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCertificados(data.certificados || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [buscar, estado]);

  useEffect(() => {
    fetchCertificados();
  }, [fetchCertificados]);

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Búsqueda y Consulta de Certificados</h1>
          <p className="text-gray-500 text-sm mt-1">
            Módulo de verificación para Seccionales DCCAE y Sanidad Militar
          </p>
        </div>
        <div className="text-sm font-semibold text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          Total encontrados: <span className="text-primary">{total}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCertificados();
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3"
        >
          <div className="sm:col-span-7">
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Buscar por Cédula, Nombres o No. Consecutivo
            </label>
            <input
              type="text"
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              placeholder="Ej: 1020304050 o 000125-27-10-2026..."
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Estado de Vigencia
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Todos los Estados</option>
              <option value="VIGENTE">VIGENTE</option>
              <option value="VENCIDO">VENCIDO</option>
              <option value="ANULADO">ANULADO</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full bg-[#008b85] hover:bg-[#00706b] text-white font-bold py-2 rounded-lg text-sm transition-colors"
            >
              Filtrar
            </button>
          </div>
        </form>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Buscando certificados...</p>
          </div>
        ) : certificados.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">
            No se encontraron certificados con los criterios de búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Consecutivo</th>
                  <th className="px-6 py-3">Titular</th>
                  <th className="px-6 py-3">Identificación</th>
                  <th className="px-6 py-3">Objetivo</th>
                  <th className="px-6 py-3">Dictamen</th>
                  <th className="px-6 py-3">Fechas</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {certificados.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-gray-900 text-xs">
                      {cert.numeroCertificado}
                      <span className="block text-[10px] text-gray-400 font-normal">
                        Control: {cert.crc.codigoControl}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {cert.nombres} {cert.apellidos}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {cert.tipoDocumento} {cert.numeroDocumento}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {cert.objetivo === "PORTE_CIVIL"
                        ? "Porte Civil"
                        : cert.objetivo === "SEGURIDAD_PRIVADA"
                        ? "Seguridad Privada"
                        : cert.objetivo}
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
                      <div>Exp: {formatDate(cert.fechaExpedicion)}</div>
                      <div className="text-gray-400">Venc: {formatDate(cert.fechaVencimiento)}</div>
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
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="text-primary hover:text-accent font-semibold text-xs transition-colors"
                      >
                        Ficha
                      </button>
                      <a
                        href={`/api/descargar?tipoDocumento=${cert.tipoDocumento}&numeroDocumento=${cert.numeroDocumento}&codigo=${cert.codigoVerificacion}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 rounded text-xs font-semibold transition-colors"
                      >
                        <span>PDF</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detalle Ficha */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Ficha Oficial del Certificado
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  {selectedCert.numeroCertificado}
                </p>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500 font-medium block">Titular:</span>
                <span className="font-bold text-gray-900 text-sm">
                  {selectedCert.nombres} {selectedCert.apellidos}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block">Documento:</span>
                <span className="font-bold text-gray-900 text-sm font-mono">
                  {selectedCert.tipoDocumento} {selectedCert.numeroDocumento}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block">Institución Emisora (CRC):</span>
                <span className="font-semibold text-gray-800">{selectedCert.crc.nombre}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block">Código Control DGSM:</span>
                <span className="font-bold text-primary font-mono">{selectedCert.crc.codigoControl}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block">Código de Verificación Único:</span>
                <span className="font-bold font-mono text-primary text-sm bg-blue-50 px-2 py-1 rounded inline-block">
                  {selectedCert.codigoVerificacion}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block">Dictamen Final:</span>
                <span
                  className={`font-bold text-sm ${
                    selectedCert.dictamen === "APTO" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {selectedCert.dictamen}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block">Fecha Expedición:</span>
                <span className="font-semibold">{formatDate(selectedCert.fechaExpedicion)}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block">Fecha Vencimiento (60 días):</span>
                <span className="font-semibold">{formatDate(selectedCert.fechaVencimiento)}</span>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <Link
                href={`/verificar?codigo=${selectedCert.codigoVerificacion}`}
                target="_blank"
                className="text-xs text-primary hover:underline font-semibold"
              >
                Abrir en validador público ↗
              </Link>
              <div className="space-x-2">
                <a
                  href={`/api/descargar?tipoDocumento=${selectedCert.tipoDocumento}&numeroDocumento=${selectedCert.numeroDocumento}&codigo=${selectedCert.codigoVerificacion}`}
                  target="_blank"
                  className="bg-primary hover:bg-primary-light text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors inline-block"
                >
                  Descargar PDF Oficial
                </a>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CertificadosPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-gray-500">Cargando certificados...</div>}>
      <CertificadosContent />
    </Suspense>
  );
}
