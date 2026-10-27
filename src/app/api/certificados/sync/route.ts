import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

function generateVerificationCode(): string {
  // Generates format like: A7X9-K2M4-P8R1
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const pick = (len: number) => {
    let res = "";
    for (let i = 0; i < len; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };
  return `${pick(4)}-${pick(4)}-${pick(4)}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File | null;
    const numeroCertificado = formData.get("numeroCertificado") as string;
    const tipoDocumento = (formData.get("tipoDocumento") as string) || "CC";
    const numeroDocumento = formData.get("numeroDocumento") as string;
    const nombres = formData.get("nombres") as string;
    const apellidos = formData.get("apellidos") as string;
    const dictamen = ((formData.get("dictamen") as string) || "APTO").toUpperCase();
    const objetivo = (formData.get("objetivo") as string) || "PORTE_CIVIL";
    const fechaExpStr = formData.get("fechaExpedicion") as string;
    const codigoControl = (formData.get("codigoControl") as string) || "DGSM-CRC-042";

    if (!numeroCertificado || !numeroDocumento || !nombres) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (numeroCertificado, numeroDocumento, nombres)" },
        { status: 400 }
      );
    }

    // Find or create default CRC
    let crc = await prisma.crc.findFirst({
      where: { codigoControl },
    });

    if (!crc) {
      crc = await prisma.crc.create({
        data: {
          nombre: "CENTRO DE RECONOCIMIENTO SERVIR CRC",
          codigoControl,
          nit: "900.876.543-2",
          ciudad: "Colombia",
        },
      });
    }

    // Calculate dates
    const fechaExpedicion = fechaExpStr ? new Date(fechaExpStr) : new Date();
    const fechaVencimiento = new Date(fechaExpedicion);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 60); // Res. 2056 vigencia max 60 dias

    // Save PDF if provided
    let pdfRelPath = `certificados/${numeroCertificado}.pdf`;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const publicDir = path.join(process.cwd(), "public", "certificados");
      await mkdir(publicDir, { recursive: true });
      const fullPath = path.join(publicDir, `${numeroCertificado}.pdf`);
      await writeFile(fullPath, buffer);
    }

    // Verification code
    const codigoVerificacion = generateVerificationCode();

    // Upsert certificate
    const certificado = await prisma.certificado.upsert({
      where: { numeroCertificado },
      update: {
        tipoDocumento,
        numeroDocumento,
        nombres: nombres.toUpperCase(),
        apellidos: (apellidos || "").toUpperCase(),
        dictamen,
        objetivo,
        fechaExpedicion,
        fechaVencimiento,
        estado: "VIGENTE",
        pdfPath: pdfRelPath,
        sincronizadoEn: new Date(),
      },
      create: {
        crcId: crc.id,
        numeroCertificado,
        codigoVerificacion,
        tipoDocumento,
        numeroDocumento,
        nombres: nombres.toUpperCase(),
        apellidos: (apellidos || "").toUpperCase(),
        dictamen,
        objetivo,
        fechaExpedicion,
        fechaVencimiento,
        estado: "VIGENTE",
        pdfPath: pdfRelPath,
        qrToken: codigoVerificacion,
      },
    });

    return NextResponse.json({
      status: "ok",
      mensaje: "Certificado sincronizado exitosamente",
      certificado: {
        numeroCertificado: certificado.numeroCertificado,
        codigoVerificacion: certificado.codigoVerificacion,
        titular: `${certificado.nombres} ${certificado.apellidos}`,
        documento: `${certificado.tipoDocumento} ${certificado.numeroDocumento}`,
        dictamen: certificado.dictamen,
        fechaVencimiento: certificado.fechaVencimiento,
        urlVerificacion: `/verificar?codigo=${certificado.codigoVerificacion}`,
      },
    });
  } catch (error) {
    console.error("Error al sincronizar certificado:", error);
    return NextResponse.json(
      { error: "Error interno al sincronizar certificado" },
      { status: 500 }
    );
  }
}
