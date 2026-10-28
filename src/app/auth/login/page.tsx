"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      // Store token in localStorage for client-side access
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.usuario));

      router.push("/panel");
    } catch {
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c232e] via-[#008b85] to-[#00a59e] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-white px-5 py-2.5 rounded-2xl inline-block shadow-2xl mb-4 border border-white/30">
            <Image
              src="/images/logo-odontomedicina-servir.png"
              alt="Logo OdontoMedicina Servir CRC"
              width={180}
              height={80}
              className="h-12 w-auto object-contain mx-auto"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Panel de Autoridades</h1>
          <p className="text-teal-100 text-xs mt-1 font-medium">
            Dirección General de Sanidad Militar & DCCAE
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-5 border border-slate-100"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@entidad.gov.co"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#008b85] hover:bg-[#00706b] text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm uppercase tracking-wider"
          >
            {loading ? "Ingresando..." : "Ingresar al Panel"}
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Acceso exclusivo para personal autorizado de DGSM y DCCAE.
            </p>
          </div>
        </form>

        <div className="mt-8 text-center">
          <a
            href="https://www.dctelematica.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/25 transition-all duration-300"
            title="Visitar DC Telemática - www.dctelematica.com"
          >
            <span className="text-[11px] font-medium tracking-wider text-blue-200/80 group-hover:text-white transition-colors duration-300">
              Powered by
            </span>
            <Image
              src="/images/logo-dctelematica.png"
              alt="DC Telemática"
              width={70}
              height={24}
              className="h-4.5 w-auto object-contain transition-all duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-0.5 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
