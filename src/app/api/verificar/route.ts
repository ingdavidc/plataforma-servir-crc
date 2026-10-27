import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const codigo = searchParams.get("codigo");

  if (!codigo) {
    return NextResponse.json(
      { error: "Debe proporcionar un código de verificación" },
      { status: 400 }
    );
  }

  try {
    const certificado = await prisma.certificado.findFirst({
      where: {
        OR: [
          { codigoVerificacion: codigo },
          { numeroCertificado: codigo },
          { qrToken: codigo },
        ],
      },
      include: {
        crc: {
          select: {
            nombre: true,
          },
        },
      },
    });

    if (!certificado) {
      return NextResponse.json(
        {
          error:
            "No se encontró ningún certificado con el código proporcionado. Verifique que el código sea correcto.",
        },
        { status: 404 }
      );
    }

    // Check if expired and update status
    const now = new Date();
    let estado = certificado.estado;
    if (estado === "VIGENTE" && new Date(certificado.fechaVencimiento) < now) {
      estado = "VENCIDO";
      await prisma.certificado.update({
        where: { id: certificado.id },
        data: { estado: "VENCIDO" },
      });
    }

    // Log the verification
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    await prisma.logConsulta.create({
      data: {
        certificadoId: certificado.id,
        tipoAccion: "VERIFICACION",
        ip: ip,
        detalles: JSON.stringify({ codigo }),
      },
    });

    return NextResponse.json({
      numeroCertificado: certificado.numeroCertificado,
      nombres: certificado.nombres,
      apellidos: certificado.apellidos,
      tipoDocumento: certificado.tipoDocumento,
      numeroDocumento: certificado.numeroDocumento,
      dictamen: certificado.dictamen,
      objetivo: certificado.objetivo,
      fechaExpedicion: certificado.fechaExpedicion,
      fechaVencimiento: certificado.fechaVencimiento,
      estado: estado,
      crcNombre: certificado.crc.nombre,
    });
  } catch (error) {
    console.error("Error al verificar certificado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
