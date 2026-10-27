import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "servir-crc-secret-key-change-in-production";

function verifyToken(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const totalCertificados = await prisma.certificado.count();
    const totalVigentes = await prisma.certificado.count({
      where: { estado: "VIGENTE" },
    });
    const totalVencidos = await prisma.certificado.count({
      where: { estado: "VENCIDO" },
    });
    const totalAnulados = await prisma.certificado.count({
      where: { estado: "ANULADO" },
    });
    const totalAptos = await prisma.certificado.count({
      where: { dictamen: "APTO" },
    });
    const totalNoAptos = await prisma.certificado.count({
      where: { dictamen: "NO APTO" },
    });

    // Certificates per CRC
    const porCrc = await prisma.certificado.groupBy({
      by: ["crcId"],
      _count: { id: true },
    });

    const crcs = await prisma.crc.findMany({
      select: { id: true, nombre: true },
    });

    const certificadosPorCrc = porCrc.map((item) => ({
      crc: crcs.find((c) => c.id === item.crcId)?.nombre || "Desconocido",
      total: item._count.id,
    }));

    // Recent certificates
    const recientes = await prisma.certificado.findMany({
      take: 10,
      orderBy: { sincronizadoEn: "desc" },
      include: {
        crc: { select: { nombre: true } },
      },
    });

    // Recent logs
    const totalConsultas = await prisma.logConsulta.count();

    return NextResponse.json({
      totalCertificados,
      totalVigentes,
      totalVencidos,
      totalAnulados,
      totalAptos,
      totalNoAptos,
      certificadosPorCrc,
      recientes,
      totalConsultas,
    });
  } catch (error) {
    console.error("Error en estadísticas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
