"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface UserSession {
  nombre: string;
  email: string;
  rol: string;
  entidad: string;
}

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/login");
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        router.push("/auth/login");
      }
    }
    setLoading(false);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    // Remove cookie
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/auth/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Cargando panel de control...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-[#0c232e] text-white shadow-md border-b border-teal-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/panel" className="flex items-center space-x-3">
                <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm">
                  <Image
                    src="/images/logo-odontomedicina-servir.png"
                    alt="OdontoMedicina Servir CRC"
                    width={130}
                    height={45}
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold tracking-tight text-sm block">ODONTOMEDICINA SERVIR CRC</span>
                  <span className="text-[11px] text-teal-300 block">Panel de Control & Auditoría</span>
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/panel"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/panel"
                    ? "bg-[#008b85] text-white"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/panel/certificados"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith("/panel/certificados")
                    ? "bg-[#008b85] text-white"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                Certificados
              </Link>
              <Link
                href="/panel/cortes"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith("/panel/cortes")
                    ? "bg-[#008b85] text-white"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                Cortes Diarios (Res. 2056)
              </Link>
              <Link
                href="/verificar"
                target="_blank"
                className="px-3 py-2 rounded-md text-sm font-medium text-blue-200 hover:text-white transition-colors flex items-center gap-1"
              >
                Portal Público
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-white">{user?.nombre}</p>
                <p className="text-[11px] text-blue-200">{user?.entidad}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600/80 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            SERVIR CRC — Sistema de Consulta para Sanidad Militar (DGSM) y Control Comercio de Armas (DCCAE)
          </span>
          <a
            href="https://www.dctelematica.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-300"
            title="Visitar DC Telemática - www.dctelematica.com"
          >
            <span className="text-[11px] font-medium tracking-wider text-gray-400 group-hover:text-gray-700 transition-colors duration-300">
              Powered by
            </span>
            <Image
              src="/images/logo-dctelematica.png"
              alt="DC Telemática"
              width={70}
              height={24}
              className="h-4.5 w-auto object-contain transition-all duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-0.5 group-hover:drop-shadow-[0_2px_6px_rgba(220,38,38,0.35)]"
            />
          </a>
        </div>
      </footer>
    </div>
  );
}
