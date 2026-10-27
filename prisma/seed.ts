import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando siembra de datos...");

  // Limpiar datos previos
  await prisma.logConsulta.deleteMany();
  await prisma.certificado.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.crc.deleteMany();
  await prisma.usuarioPanel.deleteMany();

  // 1. Crear CRC Institución Especializada autorizada
  const crc = await prisma.crc.create({
    data: {
      nombre: "CENTRO DE RECONOCIMIENTO SERVIR CRC S.A.S.",
      codigoControl: "DGSM-CRC-042",
      nit: "900.876.543-2",
      ciudad: "Bogotá D.C.",
      activo: true,
    },
  });

  console.log(`✅ CRC creado: ${crc.nombre} (No. Control: ${crc.codigoControl})`);

  // Fechas de prueba
  const hoy = new Date();
  
  // Vigente (expedido hoy, vence en 60 días)
  const vigencia60 = new Date(hoy);
  vigencia60.setDate(vigencia60.getDate() + 60);

  // Vencido (expedido hace 75 días, venció hace 15 días)
  const expVencido = new Date(hoy);
  expVencido.setDate(expVencido.getDate() - 75);
  const finVencido = new Date(hoy);
  finVencido.setDate(finVencido.getDate() - 15);

  // 2. Crear Certificados de prueba conforme a Res. 2056 de 2007
  const cert1 = await prisma.certificado.create({
    data: {
      crcId: crc.id,
      numeroCertificado: "000125-27-10-2026",
      codigoVerificacion: "A7X9-K2M4-P8R1",
      tipoDocumento: "CC",
      numeroDocumento: "1020304050",
      nombres: "JUAN CARLOS",
      apellidos: "PÉREZ GÓMEZ",
      dictamen: "APTO",
      objetivo: "PORTE_CIVIL",
      fechaExpedicion: hoy,
      fechaVencimiento: vigencia60,
      estado: "VIGENTE",
      pdfPath: "certificados/000125-27-10-2026.pdf",
      qrToken: "A7X9-K2M4-P8R1",
    },
  });

  const cert2 = await prisma.certificado.create({
    data: {
      crcId: crc.id,
      numeroCertificado: "000126-27-10-2026",
      codigoVerificacion: "B3Y7-L5N8-Q2S4",
      tipoDocumento: "CC",
      numeroDocumento: "52345678",
      nombres: "MARÍA FERNANDA",
      apellidos: "RODRÍGUEZ LÓPEZ",
      dictamen: "APTO",
      objetivo: "SEGURIDAD_PRIVADA",
      fechaExpedicion: hoy,
      fechaVencimiento: vigencia60,
      estado: "VIGENTE",
      pdfPath: "certificados/000126-27-10-2026.pdf",
      qrToken: "B3Y7-L5N8-Q2S4",
    },
  });

  const cert3 = await prisma.certificado.create({
    data: {
      crcId: crc.id,
      numeroCertificado: "000089-15-08-2026",
      codigoVerificacion: "C1Z3-M6P9-R4T7",
      tipoDocumento: "CC",
      numeroDocumento: "79123456",
      nombres: "PEDRO ANTONIO",
      apellidos: "MARTÍNEZ SILVA",
      dictamen: "APTO",
      objetivo: "PORTE_CIVIL",
      fechaExpedicion: expVencido,
      fechaVencimiento: finVencido,
      estado: "VENCIDO",
      pdfPath: "certificados/000089-15-08-2026.pdf",
      qrToken: "C1Z3-M6P9-R4T7",
    },
  });

  const cert4 = await prisma.certificado.create({
    data: {
      crcId: crc.id,
      numeroCertificado: "000110-10-09-2026",
      codigoVerificacion: "D9W2-H4K7-X5N1",
      tipoDocumento: "CC",
      numeroDocumento: "80987654",
      nombres: "CARLOS EDUARDO",
      apellidos: "GÓMEZ RUIZ",
      dictamen: "NO APTO",
      objetivo: "PORTE_CIVIL",
      fechaExpedicion: expVencido,
      fechaVencimiento: finVencido,
      estado: "VENCIDO",
      pdfPath: "certificados/000110-10-09-2026.pdf",
      qrToken: "D9W2-H4K7-X5N1",
    },
  });

  console.log("✅ 4 Certificados de prueba creados");

  // 3. Crear Usuarios de Acceso para Autoridades y Administrador
  const passAdmin = await bcrypt.hash("admin123", 10);
  const passDccae = await bcrypt.hash("dccae2026", 10);

  await prisma.usuarioPanel.create({
    data: {
      nombre: "Administrador SERVIR CRC",
      email: "admin@servircrc.com",
      password: passAdmin,
      entidad: "CENTRO DE RECONOCIMIENTO SERVIR CRC",
      rol: "ADMIN",
      activo: true,
    },
  });

  await prisma.usuarioPanel.create({
    data: {
      nombre: "Oficial Inspector DCCAE",
      email: "dccae.seccional@mindefensa.gov.co",
      password: passDccae,
      entidad: "Departamento Control Comercio de Armas (DCCAE)",
      rol: "SECCIONAL",
      activo: true,
    },
  });

  console.log("✅ Usuarios del Panel creados (admin@servircrc.com y dccae.seccional@mindefensa.gov.co)");

  // 4. Registrar logs iniciales
  await prisma.logConsulta.create({
    data: {
      certificadoId: cert1.id,
      tipoAccion: "VERIFICACION",
      ip: "127.0.0.1",
      detalles: JSON.stringify({ motivo: "Verificación inicial de prueba" }),
    },
  });

  console.log("🚀 Base de datos inicializada exitosamente.");
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
