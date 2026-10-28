"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface CertificadoResult {
  numeroCertificado: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  dictamen: string;
  objetivo: string;
  fechaExpedicion: string;
  fechaVencimiento: string;
  estado: string;
  crcNombre: string;
}

function VerificarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codigoInicial = searchParams.get("codigo") || "";

  const [codigo, setCodigo] = useState(codigoInicial);
  const [resultado, setResultado] = useState<CertificadoResult | null>(null);
  const [error, setError] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [buscado, setBuscado] = useState(false);

  async function handleVerificar(e: React.FormEvent) {
    e.preventDefault();
    if (!codigo.trim()) return;

    setBuscando(true);
    setError("");
    setResultado(null);
    setBuscado(true);

    try {
      const res = await fetch(
        `/api/verificar?codigo=${encodeURIComponent(codigo.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al verificar el certificado");
      } else {
        setResultado(data);
      }
    } catch {
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setBuscando(false);
    }
  }

  function getEstadoBadge(estado: string) {
    switch (estado) {
      case "VIGENTE":
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            CERTIFICADO VIGENTE
          </span>
        );
      case "VENCIDO":
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            CERTIFICADO VENCIDO
          </span>
        );
      case "ANULADO":
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-800">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            CERTIFICADO ANULADO
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gray-100 text-gray-800">
            {estado}
          </span>
        );
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Verificar Certificado
        </h1>
        <p className="text-gray-600">
          Ingrese el código de verificación que aparece en el certificado médico
          para comprobar su autenticidad y vigencia.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleVerificar} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="Ej: A7X9-K2M4-P8R1"
            className="w-full flex-1 px-4 py-3 sm:py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58220] focus:border-transparent text-base sm:text-lg font-mono tracking-wider shadow-sm"
            required
          />
          <button
            type="submit"
            disabled={buscando}
            className="w-full sm:w-auto bg-[#008b85] hover:bg-[#00706b] active:scale-95 text-white font-bold px-8 py-3 sm:py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm flex items-center justify-center"
          >
            {buscando ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Buscando...
              </span>
            ) : (
              "Verificar"
            )}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <svg
            className="w-12 h-12 text-red-400 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-bold text-red-800 text-lg">
            Certificado no encontrado
          </h3>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* Result */}
      {resultado && (
        <div
          className={`rounded-xl border-2 overflow-hidden shadow-lg ${
            resultado.estado === "VIGENTE"
              ? "border-green-300"
              : resultado.estado === "VENCIDO"
              ? "border-yellow-300"
              : "border-red-300"
          }`}
        >
          {/* Status Header */}
          <div
            className={`px-6 py-4 text-center ${
              resultado.estado === "VIGENTE"
                ? "bg-green-50"
                : resultado.estado === "VENCIDO"
                ? "bg-yellow-50"
                : "bg-red-50"
            }`}
          >
            {getEstadoBadge(resultado.estado)}
          </div>

          {/* Certificate Data */}
          <div className="bg-white px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Titular
                </label>
                <p className="text-lg font-bold text-gray-900">
                  {resultado.nombres} {resultado.apellidos}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Documento
                </label>
                <p className="text-lg font-bold text-gray-900">
                  {resultado.tipoDocumento}{" "}
                  {Number(resultado.numeroDocumento).toLocaleString("es-CO")}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  No. Certificado
                </label>
                <p className="text-gray-900 font-mono">
                  {resultado.numeroCertificado}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  CRC Emisor
                </label>
                <p className="text-gray-900">{resultado.crcNombre}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fecha de Expedición
                </label>
                <p className="text-gray-900">
                  {formatDate(resultado.fechaExpedicion)}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fecha de Vencimiento
                </label>
                <p className="text-gray-900">
                  {formatDate(resultado.fechaVencimiento)}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Dictamen
                </label>
                <p
                  className={`font-bold text-lg ${
                    resultado.dictamen === "APTO"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {resultado.dictamen}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Objetivo
                </label>
                <p className="text-gray-900">
                  {resultado.objetivo === "PORTE_CIVIL"
                    ? "Porte Civil de Armas"
                    : resultado.objetivo === "SEGURIDAD_PRIVADA"
                    ? "Seguridad Privada"
                    : resultado.objetivo}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No result yet */}
      {!resultado && !error && !buscado && (
        <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-gray-500">
            Ingrese un código de verificación para consultar el estado del
            certificado.
          </p>
        </div>
      )}
    </div>
  );
}

export default function VerificarPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          Cargando...
        </div>
      }
    >
      <VerificarContent />
    </Suspense>
  );
}
