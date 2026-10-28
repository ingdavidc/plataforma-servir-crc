# 🇨🇴 ODONTOMEDICINA SERVIR CRC — Plataforma de Verificación y Control de Certificados Médicos Psicofísicos
> Empresa: **OdontoMedicina Servir CRC** — [www.odontomedicinaservircrc.com](https://www.odontomedicinaservircrc.com/)  
> Sede: Calle 28 No 20A - 32, B. Jardín, Saravena (Arauca) — Tel: 320 952 2791  
> Desarrollado por: [DC Telemática](https://www.dctelematica.com)
### Cumplimiento Oficial de la **Resolución 2056 de 2007**
**Dirección General de Sanidad Militar (DGSM) & Departamento Control Comercio de Armas, Municiones y Explosivos (DCCAE)**

---

## 📌 Descripción del Proyecto

Plataforma web en línea y agente de sincronización local para la consulta, verificación de autenticidad, descarga y auditoría de **Certificados Médicos de Aptitud Psicofísica para Porte y Tenencia de Armas de Fuego**, en cumplimiento estricto de la legislación colombiana (Ley 1119 de 2006, Decreto 2858 de 2007 y Resolución 2056 de 2007).

---

## 🚀 Características Principales

1. **Validador Público de Autenticidad (`/verificar`):**
   - Verificación instantánea mediante Código Único alfanumérico o lectura de Código QR.
   - Cálculo dinámico de vigencia legal (máximo 60 días calendario conforme al Art. 4).
   - Estados: `VIGENTE` (Verde), `VENCIDO` (Ámbar) y `ANULADO` (Rojo).

2. **Descarga Segura de Certificados (`/descargar`):**
   - El titular puede descargar su Certificado original en PDF con tipo de documento, número de cédula y código de verificación.

3. **Panel de Control para Autoridades (`/panel`):**
   - Acceso seguro con credenciales para oficiales de Sanidad Militar (DGSM) y Seccionales del DCCAE.
   - Dashboard con métricas de certificados expedidos, vigentes, vencidos, aptos y no aptos.
   - Buscador avanzado y fichas técnicas por cédula, consecutivo interno o nombre.

4. **Cortes Diarios Obligatorios (`/panel/cortes`):**
   - Cumplimiento del **Art. 4 Parágrafo** de la Res. 2056:
     - Corte de las **09:00 horas**.
     - Corte de las **16:30 horas**.
   - Generación de relación diaria oficial, exportación a **CSV / Excel** y vista optimizada para impresión.

5. **Agente Local de Sincronización de Carpetas (`agente_sincronizador_crc/`):**
   - Servicio ligero en Python que vigila la carpeta local donde el software del CRC expide los certificados PDF.
   - Transmisión automática en segundo plano mediante API REST multipart (`POST /api/certificados/sync`).

---

## 🔑 Credenciales de Acceso para Pruebas

### Panel de Autoridades (`/auth/login`):

| Rol | Correo Electrónico | Contraseña | Entidad |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@servircrc.com` | `admin123` | CENTRO DE RECONOCIMIENTO SERVIR CRC |
| **Seccional DCCAE** | `dccae.seccional@mindefensa.gov.co` | `dccae2026` | Departamento Control Comercio de Armas |

### Códigos de Verificación Pre-cargados para Pruebas:

| Titular | Cédula | No. Consecutivo | Código Verificación | Dictamen | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Juan Carlos Pérez Gómez** | CC `1020304050` | `000125-27-10-2026` | `A7X9-K2M4-P8R1` | **APTO** | ✅ VIGENTE |
| **María Fernanda Rodríguez** | CC `52345678` | `000126-27-10-2026` | `B3Y7-L5N8-Q2S4` | **APTO** | ✅ VIGENTE |
| **Pedro Antonio Martínez** | CC `79123456` | `000089-15-08-2026` | `C1Z3-M6P9-R4T7` | **APTO** | ⚠️ VENCIDO (>60 días) |
| **Carlos Eduardo Gómez Ruiz** | CC `80987654` | `000110-10-09-2026` | `D9W2-H4K7-X5N1` | **NO APTO** | ⏱️ VENCIDO |

---

## 🛠️ Stack Tecnológico

- **Frontend & Backend:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS
- **ORM & Base de Datos:** Prisma ORM con SQLite (desarrollo local) y compatibilidad nativa con PostgreSQL / Supabase
- **Seguridad:** Tokens JWT en Cookies HTTP-Only, bcryptjs para contraseñas, sanitización de entradas
- **Generación & Manejo PDF:** ReportLab / PDF Streams nativos
- **Agente Sync Local:** Python 3 (urllib nativo sin dependencias externas obligatorias)

---

## 💻 Instalación y Ejecución Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/ingdavidc/plataforma-servir-crc.git
cd plataforma-servir-crc

# 2. Instalar dependencias
npm install

# 3. Configurar base de datos y sembrar datos de prueba
npx prisma migrate dev --name init

# 4. Iniciar servidor de desarrollo
npm run dev
# Abrir en el navegador: http://localhost:3000
```

---

## 📄 Marco Normativo

- **Ley 1119 de 2006:** Artículo 11 que modifica el Art. 33 del Decreto 2535 de 1993.
- **Decreto 2858 de 2007:** Reglamentación de condiciones técnicas y custodia.
- **Resolución 2894 de 2007:** Rangos y baremos de evaluación psicofísica.
- **Resolución 2056 de 2007 (MinDefensa - DGSM):** Formato estándar, especificaciones técnicas de seguridad y obligatoriedad de publicación de cortes diarios.
