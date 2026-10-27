import Link from "next/link";

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
        <div className="border-t border-blue-800 mt-6 pt-4 text-center text-xs text-blue-300">
          © 2026 SERVIR CRC — Todos los derechos reservados
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
