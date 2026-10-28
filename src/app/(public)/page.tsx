import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section Corporativo OdontoMedicina Servir */}
      <section className="bg-gradient-to-br from-[#0c232e] via-[#008b85] to-[#00a59e] text-white relative overflow-hidden">
        {/* Patrón sutil de fondo */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff9900_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 text-center relative z-10">
          
          {/* Logo Badge Flotante - Centrado y con Animación Sutil y Elegante */}
          <div className="flex justify-center mb-5 sm:mb-6">
            <div className="group relative inline-flex items-center justify-center p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md shadow-[0_12px_35px_-5px_rgba(0,0,0,0.25)] border border-white/80 animate-logo-float transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_45px_-5px_rgba(245,130,32,0.35)] cursor-default">
              {/* Brillo ambiental al hover */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#00a59e]/30 to-[#ff9900]/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <Image
                src="/images/logo-odontomedicina-servir.png"
                alt="Logo Oficial OdontoMedicina Servir CRC"
                width={235}
                height={117}
                className="relative z-10 h-12 sm:h-16 md:h-18 w-auto object-contain transition-transform duration-500 group-hover:scale-102"
                priority
              />
            </div>
          </div>

          {/* Badge Normativo */}
          <div className="inline-flex items-center gap-1.5 bg-[#ff9900]/20 border border-[#ff9900]/40 text-[#ffb84d] text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 sm:mb-4">
            <svg className="w-3 h-3 text-[#ff9900]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Resolución 2056 de 2007 (MinDefensa)</span>
          </div>

          {/* Título Principal Responsive */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-3 tracking-tight leading-tight px-2">
            ODONTOMEDICINA SERVIR CRC
          </h1>
          <p className="text-sm sm:text-xl md:text-2xl text-teal-100 font-medium mb-2 sm:mb-3 px-2">
            Plataforma Sistematizada de Verificación y Control de Certificados Médicos Psicofísicos
          </p>
          <p className="text-teal-50/90 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
            Consulte en línea, verifique la autenticidad y descargue certificados médicos de aptitud psicofísica
            para el trámite de porte y tenencia de armas de fuego en Colombia.
          </p>

          {/* Buscador Rápido - 100% Adaptable a Móvil */}
          <div className="w-full max-w-xl mx-auto px-2 sm:px-0">
            <form
              action="/verificar"
              method="GET"
              className="flex flex-col sm:flex-row gap-2 bg-white/10 p-1.5 sm:p-2 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl"
            >
              <input
                type="text"
                name="codigo"
                placeholder="Ej: A7X9-K2M4-P8R1 o No. Consecutivo..."
                className="w-full flex-1 px-4 py-3 sm:py-3.5 rounded-xl text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#ff9900] text-sm sm:text-base font-mono font-medium shadow-inner"
                required
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#f58220] hover:bg-[#dc7016] active:scale-95 text-white font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap"
              >
                <span>Verificar</span>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Módulos Principales Responsive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Servicios en Línea de la Plataforma</h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Accesos directos para usuarios, empleadores y entidades de control
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {/* Tarjeta 1: Verificar */}
          <Link
            href="/verificar"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-8 text-center border border-slate-200 hover:border-[#008b85] flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 group-hover:bg-[#008b85] transition-colors duration-300">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-[#008b85] group-hover:text-white transition-colors duration-300"
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
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-[#008b85] transition-colors">
                Verificar Certificado
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Compruebe la autenticidad, vigencia (hasta 60 días) y dictamen clínico oficial
                ingresando el código alfanumérico o escaneando el código QR.
              </p>
            </div>
            <div className="mt-5 sm:mt-6 pt-4 border-t border-slate-100 flex items-center justify-center text-xs font-bold text-[#008b85] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              <span>Ingresar al Validador →</span>
            </div>
          </Link>

          {/* Tarjeta 2: Descargar */}
          <Link
            href="/descargar"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-8 text-center border border-slate-200 hover:border-[#f58220] flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 group-hover:bg-[#f58220] transition-colors duration-300">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-[#f58220] group-hover:text-white transition-colors duration-300"
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
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-[#f58220] transition-colors">
                Descargar Certificado
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Descargue su certificado en formato PDF oficial emitido por OdontoMedicina Servir CRC,
                ingresando su tipo de documento, cédula y código de validación.
              </p>
            </div>
            <div className="mt-5 sm:mt-6 pt-4 border-t border-slate-100 flex items-center justify-center text-xs font-bold text-[#f58220] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              <span>Descargar PDF Oficial →</span>
            </div>
          </Link>

          {/* Tarjeta 3: Panel Autoridades */}
          <Link
            href="/auth/login"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-8 text-center border border-slate-200 hover:border-[#0c232e] flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 group-hover:bg-[#0c232e] transition-colors duration-300">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-[#0c232e] group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-[#0c232e] transition-colors">
                Panel de Autoridades
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Acceso exclusivo para delegados de Sanidad Militar (DGSM) y Seccionales del DCCAE.
                Consulta masiva, auditoría y cortes diarios (09:00 y 16:30 hrs).
              </p>
            </div>
            <div className="mt-5 sm:mt-6 pt-4 border-t border-slate-100 flex items-center justify-center text-xs font-bold text-[#0c232e] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              <span>Ingreso Institucional →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Franja de Información Legal y de Contacto Responsive */}
      <section className="bg-gradient-to-r from-teal-50 to-orange-50/50 border-y border-teal-100/60 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#008b85] text-white flex items-center justify-center shrink-0 shadow-md">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Cumplimiento Estricto de la Resolución 2056 de 2007
                </h4>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                  Todos los certificados expedidos por OdontoMedicina Servir CRC cuentan con numeración consecutiva
                  reglamentaria, asignación de número de control DGSM, validación biométrica y actualización
                  inmediata de las bases de datos de control.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f58220] text-white flex items-center justify-center shrink-0 shadow-md">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Atención Presencial en Saravena (Arauca)
                </h4>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                  Sede Medicina Laboral: Calle 28 No 20A - 32, Barrio Jardín. Línea directa y WhatsApp:
                  <strong className="text-slate-900"> 320 952 2791</strong>.
                  Horario de atención conforme a la normativa vigente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
