import Link from "next/link";
import Image from "next/image";

function Header() {
  return (
    <header className="w-full">
      {/* Top Bar Corporativo */}
      <div className="bg-[#0c232e] text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-teal-900/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 text-center sm:text-left">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#00a59e]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>Calle 28 No 20A - 32, B. Jardín — Saravena, Arauca</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <a
              href="https://api.whatsapp.com/send?phone=573209522791&text=Hola,%20quisiera%20consultar%20sobre%20certificados%20medicos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#ff9900] transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#ff9900]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>320 952 2791</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.odontomedicinaservircrc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00a59e] hover:text-[#ff9900] font-medium transition-colors text-[11px] flex items-center gap-1"
            >
              <span>Sitio Principal OdontoMedicina</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white text-slate-800 shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Oficial de OdontoMedicina Servir CRC */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/logo-odontomedicina-servir.png"
                alt="OdontoMedicina Servir CRC"
                width={190}
                height={90}
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
                priority
              />
              <div className="hidden sm:block border-l border-slate-200 pl-3">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#008b85]">
                  Plataforma Oficial
                </span>
                <span className="block text-xs text-slate-500 font-medium">
                  Resolución 2056 de 2007 (MinDefensa)
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/verificar"
                className="text-sm font-semibold text-slate-700 hover:text-[#008b85] transition-colors"
              >
                Verificar Certificado
              </Link>
              <Link
                href="/descargar"
                className="text-sm font-semibold text-slate-700 hover:text-[#008b85] transition-colors"
              >
                Descargar PDF
              </Link>
              <Link
                href="/auth/login"
                className="text-xs font-bold uppercase tracking-wider bg-[#008b85] hover:bg-[#00706b] text-white px-4 py-2.5 rounded-lg transition-all shadow-sm hover:shadow"
              >
                Panel Autoridades
              </Link>
            </nav>

            <div className="md:hidden">
              <Link
                href="/verificar"
                className="text-xs font-bold bg-[#008b85] text-white px-3 py-2 rounded-lg"
              >
                Verificar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0c232e] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Logo y descripción */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white p-3 rounded-xl inline-block shadow-md">
              <Image
                src="/images/logo-odontomedicina-servir.png"
                alt="OdontoMedicina Servir CRC"
                width={190}
                height={90}
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Institución especializada prestadora de servicios de salud, medicina laboral y
              Centro de Reconocimiento y Evaluación Psicofísica (CRC) habilitado para la
              expedición de certificados médicos para porte y tenencia de armas de fuego.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p><strong className="text-slate-200">Sede Principal:</strong> Calle 28 No 20A - 32, Barrio Jardín, Saravena, Arauca</p>
              <p><strong className="text-slate-200">Contacto:</strong> 320 952 2791 — jlgomez118@gmail.com</p>
            </div>
          </div>

          {/* Enlaces de la plataforma */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#ff9900] mb-4">
              Plataforma en Línea
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/verificar" className="hover:text-[#00a59e] transition-colors">
                  Verificar Certificado
                </Link>
              </li>
              <li>
                <Link href="/descargar" className="hover:text-[#00a59e] transition-colors">
                  Descargar Certificado
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-[#00a59e] transition-colors">
                  Panel de Autoridades (DGSM / DCCAE)
                </Link>
              </li>
              <li>
                <a
                  href="https://www.odontomedicinaservircrc.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ff9900] transition-colors inline-flex items-center gap-1"
                >
                  Sitio Web Institucional ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Marco Normativo Oficial */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#ff9900] mb-4">
              Marco Legal Vigente
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-[#00a59e] font-bold">✓</span>
                <span>Resolución 2056 de 2007 (MinDefensa - DGSM)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#00a59e] font-bold">✓</span>
                <span>Ley 1119 de 2006 (Art. 11 que modifica Decreto 2535)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#00a59e] font-bold">✓</span>
                <span>Resolución 2894 de 2007 (Baremos Psicofísicos)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#00a59e] font-bold">✓</span>
                <span>Decreto 2858 de 2007</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior: Derechos de autor y Powered by DC Telemática */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 <strong>ODONTOMEDICINA SERVIR CRC S.A.S.</strong> — Todos los derechos reservados
          </div>

          {/* Sello oficial DC Telemática */}
          <a
            href="https://www.dctelematica.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 transition-all duration-300"
            title="Desarrollado por DC Telemática - www.dctelematica.com"
          >
            <span className="text-[11px] font-medium tracking-wider text-slate-400 group-hover:text-white transition-colors duration-300">
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
