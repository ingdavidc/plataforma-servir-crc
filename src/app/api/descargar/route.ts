import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tipoDocumento = searchParams.get("tipoDocumento");
  const numeroDocumento = searchParams.get("numeroDocumento");
  const codigo = searchParams.get("codigo");

  if (!tipoDocumento || !numeroDocumento || !codigo) {
    return NextResponse.json(
      {
        error:
          "Debe proporcionar tipo de documento, número de documento y código de verificación",
      },
      { status: 400 }
    );
  }

  try {
    const certificado = await prisma.certificado.findFirst({
      where: {
        tipoDocumento: tipoDocumento,
        numeroDocumento: numeroDocumento,
        codigoVerificacion: codigo,
      },
    });

    if (!certificado) {
      return NextResponse.json(
        {
          error:
            "No se encontró el certificado. Verifique que los datos sean correctos.",
        },
        { status: 404 }
      );
    }

    // Log the download
    try {
      const ip =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown";
      await prisma.logConsulta.create({
        data: {
          certificadoId: certificado.id,
          tipoAccion: "DESCARGA",
          ip: ip,
          detalles: JSON.stringify({ tipoDocumento, numeroDocumento }),
        },
      });
    } catch (err) {
      console.warn("Log de descarga no guardado:", err);
    }

    // Read the PDF file
    const pdfPath = path.join(process.cwd(), "public", certificado.pdfPath);

    try {
      const pdfBuffer = await readFile(pdfPath);
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="certificado_${numeroDocumento}.pdf"`,
        },
      });
    } catch {
      // If PDF file doesn't exist, return a message
      return NextResponse.json(
        {
          error:
            "El archivo PDF no está disponible en este momento. Contacte al CRC emisor.",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error al descargar certificado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
