import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "servir-crc-secret-key-change-in-production";

function verifyToken(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const fechaParam = searchParams.get("fecha"); // YYYY-MM-DD
  
  // Use today if not supplied
  const baseDate = fechaParam ? new Date(`${fechaParam}T00:00:00`) : new Date();
  const year = baseDate.getFullYear();
  const month = String(baseDate.getMonth() + 1).padStart(2, "0");
  const day = String(baseDate.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  const startOfDay = new Date(`${dateStr}T00:00:00.000`);
  const cut0900 = new Date(`${dateStr}T09:00:00.000`);
  const cut1630 = new Date(`${dateStr}T16:30:00.000`);
  const endOfDay = new Date(`${dateStr}T23:59:59.999`);

  try {
    // For demo/sqlite, if sincronizadoEn is today, fetch all for today
    const certificadosDelDia = await prisma.certificado.findMany({
      where: {
        sincronizadoEn: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        crc: { select: { nombre: true, codigoControl: true } },
      },
      orderBy: { sincronizadoEn: "asc" },
    });

    // Separate into the two legal cuts
    // Corte 1: hasta las 09:00 AM
    const corteManana = certificadosDelDia.filter(
      (c) => new Date(c.sincronizadoEn) <= cut0900
    );

    // Corte 2: expedidos hasta las 16:30 PM (o acumulados del día hasta 16:30)
    const corteTarde = certificadosDelDia.filter(
      (c) => new Date(c.sincronizadoEn) <= cut1630
    );

    return NextResponse.json({
      fecha: dateStr,
      totalDia: certificadosDelDia.length,
      corte0900: {
        horaCorte: "09:00:00",
        total: corteManana.length,
        certificados: corteManana,
      },
      corte1630: {
        horaCorte: "16:30:00",
        total: corteTarde.length,
        certificados: corteTarde,
      },
      todos: certificadosDelDia,
    });
  } catch (error) {
    console.error("Error al obtener cortes diarios:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
