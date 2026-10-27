"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-accent flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-primary font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Panel de Autoridades</h1>
          <p className="text-blue-200 mt-1">SERVIR CRC</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-xl shadow-2xl p-8 space-y-5"
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
            className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Acceso exclusivo para personal autorizado de DGSM y DCCAE.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
