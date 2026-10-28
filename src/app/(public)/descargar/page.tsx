"use client";

import { useState } from "react";

export default function DescargarPage() {
  const [tipoDoc, setTipoDoc] = useState("CC");
  const [numDoc, setNumDoc] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [buscando, setBuscando] = useState(false);

  async function handleDescargar(e: React.FormEvent) {
    e.preventDefault();
    if (!numDoc.trim() || !codigo.trim()) return;

    setBuscando(true);
    setError("");

    try {
      const res = await fetch(
        `/api/descargar?tipoDocumento=${tipoDoc}&numeroDocumento=${numDoc.trim()}&codigo=${codigo.trim()}`
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "No se encontró el certificado");
        setBuscando(false);
        return;
      }

      // Download the PDF
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificado_${numDoc.trim()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch {
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setBuscando(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Descargar Certificado
        </h1>
        <p className="text-gray-600">
          Ingrese su número de documento y el código de verificación que recibió
          para descargar su certificado médico en formato PDF.
        </p>
      </div>

      <form
        onSubmit={handleDescargar}
        className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 sm:p-8 space-y-5"
      >
        {/* Tipo Documento */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
            Tipo de Documento
          </label>
          <select
            value={tipoDoc}
            onChange={(e) => setTipoDoc(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58220] focus:border-transparent text-base bg-white"
          >
            <option value="CC">Cédula de Ciudadanía (CC)</option>
            <option value="CE">Cédula de Extranjería (CE)</option>
            <option value="PA">Pasaporte (PA)</option>
            <option value="TI">Tarjeta de Identidad (TI)</option>
          </select>
        </div>

        {/* Número Documento */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
            Número de Documento
          </label>
          <input
            type="text"
            value={numDoc}
            onChange={(e) => setNumDoc(e.target.value.replace(/\D/g, ""))}
            placeholder="Ej: 1234567890"
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58220] focus:border-transparent font-mono text-base"
            required
          />
        </div>

        {/* Código de Verificación */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
            Código de Verificación
          </label>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="Ej: A7X9-K2M4-P8R1"
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58220] focus:border-transparent font-mono tracking-wider text-base"
            required
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={buscando}
          className="w-full bg-[#008b85] hover:bg-[#00706b] text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
        >
          {buscando ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5"
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
            </>
          ) : (
            <>
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Descargar PDF
            </>
          )}
        </button>
      </form>

      {/* Help */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
        <p className="text-sm text-blue-800">
          <strong>¿Dónde encuentro el código de verificación?</strong> El código
          aparece impreso en la parte inferior de su certificado físico. También
          pudo haber sido enviado a su correo electrónico o celular al momento
          de la expedición.
        </p>
      </div>
    </div>
  );
}
