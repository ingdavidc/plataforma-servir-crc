import Link from "next/link";
import Image from "next/image";

function Header() {
  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">SERVIR CRC</h1>
              <p className="text-xs text-blue-200 leading-tight">
                Plataforma de Certificados
              </p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/verificar"
              className="text-sm hover:text-blue-200 transition-colors"
            >
              Verificar
            </Link>
            <Link
              href="/descargar"
              className="text-sm hover:text-blue-200 transition-colors"
            >
              Descargar
            </Link>
            <Link
              href="/auth/login"
              className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              Panel Autoridades
            </Link>
          </nav>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link
              href="/verificar"
              className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg"
            >
              Verificar
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-primary-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-2">SERVIR CRC</h3>
            <p className="text-sm text-blue-200">
              Plataforma oficial de verificación y descarga de certificados
              médicos de aptitud psicofísica.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Enlaces</h4>
            <ul className="space-y-1 text-sm text-blue-200">
              <li>
                <Link href="/verificar" className="hover:text-white">
                  Verificar Certificado
                </Link>
              </li>
              <li>
                <Link href="/descargar" className="hover:text-white">
                  Descargar Certificado
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white">
                  Panel Autoridades
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Marco Legal</h4>
            <ul className="space-y-1 text-sm text-blue-200">
              <li>Resolución 2056 de 2007</li>
              <li>Ley 1119 de 2006</li>
              <li>Resolución 2894 de 2007</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-800/60 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300">
          <div>
            © 2026 SERVIR CRC — Todos los derechos reservados
          </div>
          <a
            href="https://www.dctelematica.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
            title="Visitar DC Telemática - www.dctelematica.com"
          >
            <span className="text-[11px] font-medium tracking-wider text-blue-200/80 group-hover:text-white transition-colors duration-300">
              Powered by
            </span>
            <Image
              src="/images/logo-dctelematica.png"
              alt="DC Telemática"
              width={75}
              height={26}
              className="h-5 w-auto object-contain transition-all duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-0.5 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.55)]"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
