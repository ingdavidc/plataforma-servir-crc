import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-light to-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-primary font-bold text-3xl">S</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            SERVIR CRC
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-2">
            Plataforma de Verificación de Certificados
          </p>
          <p className="text-blue-200 max-w-2xl mx-auto mb-10">
            Portal oficial para consultar, verificar y descargar certificados
            médicos de aptitud psicofísica para porte y tenencia de armas de
            fuego — Resolución 2056 de 2007.
          </p>

          {/* Quick Search */}
          <div className="max-w-xl mx-auto">
            <form action="/verificar" method="GET" className="flex gap-2">
              <input
                type="text"
                name="codigo"
                placeholder="Ingrese código de verificación..."
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
              />
              <button
                type="submit"
                className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Verificar
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Verificar */}
          <Link
            href="/verificar"
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-8 text-center border border-gray-100"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <svg
                className="w-8 h-8 text-green-600"
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Verificar Certificado
            </h3>
            <p className="text-gray-600 text-sm">
              Compruebe la autenticidad y vigencia de un certificado médico
              psicofísico ingresando el código de verificación o escaneando el
              QR.
            </p>
          </Link>

          {/* Descargar */}
          <Link
            href="/descargar"
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-8 text-center border border-gray-100"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <svg
                className="w-8 h-8 text-blue-600"
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Descargar Certificado
            </h3>
            <p className="text-gray-600 text-sm">
              Descargue su certificado médico en formato PDF con su número de
              documento y código de verificación.
            </p>
          </Link>

          {/* Panel */}
          <Link
            href="/auth/login"
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-8 text-center border border-gray-100"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <svg
                className="w-8 h-8 text-purple-600"
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Panel de Autoridades
            </h3>
            <p className="text-gray-600 text-sm">
              Acceso exclusivo para seccionales DGSM y DCCAE. Búsqueda
              avanzada, reportes y cortes diarios.
            </p>
          </Link>
        </div>
      </section>

      {/* Info Banner */}
      <section className="bg-blue-50 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                ¿Cómo verificar un certificado?
              </h4>
              <p className="text-gray-600 text-sm mt-1">
                Cada certificado expedido por un CRC autorizado incluye un{" "}
                <strong>código de verificación único</strong> y un{" "}
                <strong>código QR</strong>. Ingrese el código en el buscador
                superior o escanee el QR con la cámara de su celular para
                comprobar la autenticidad y vigencia del certificado.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
