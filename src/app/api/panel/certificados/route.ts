import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "servir-crc-secret-key-change-in-production";

interface JWTPayload {
  userId: string;
  email: string;
  rol: string;
}

function verifyToken(request: NextRequest): JWTPayload | null {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// GET: Search certificates
export async function GET(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const buscar = searchParams.get("buscar") || "";
  const estado = searchParams.get("estado") || "";
  const fechaDesde = searchParams.get("fechaDesde") || "";
  const fechaHasta = searchParams.get("fechaHasta") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    // Build where clause
    const where: Record<string, unknown> = {};
    const conditions: Record<string, unknown>[] = [];

    if (buscar) {
      conditions.push(
        { numeroDocumento: { contains: buscar } },
        { nombres: { contains: buscar } },
        { apellidos: { contains: buscar } },
        { numeroCertificado: { contains: buscar } }
      );
    }

    if (estado) {
      where.estado = estado;
    }

    if (fechaDesde) {
      where.fechaExpedicion = {
        ...(where.fechaExpedicion as Record<string, unknown> || {}),
        gte: new Date(fechaDesde),
      };
    }

    if (fechaHasta) {
      where.fechaExpedicion = {
        ...(where.fechaExpedicion as Record<string, unknown> || {}),
        lte: new Date(fechaHasta + "T23:59:59"),
      };
    }

    const finalWhere = conditions.length > 0
      ? { ...where, OR: conditions }
      : where;

    const [certificados, total] = await Promise.all([
      prisma.certificado.findMany({
        where: finalWhere,
        include: {
          crc: { select: { nombre: true, codigoControl: true } },
        },
        orderBy: { sincronizadoEn: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.certificado.count({ where: finalWhere }),
    ]);

    // Log the search
    try {
      const ip = request.headers.get("x-forwarded-for") || "unknown";
      await prisma.logConsulta.create({
        data: {
          tipoAccion: "BUSQUEDA",
          ip: ip,
          detalles: JSON.stringify({ buscar, estado, fechaDesde, fechaHasta, userId: user.userId }),
        },
      });
    } catch (err) {
      console.warn("Log de busqueda no guardado:", err);
    }

    return NextResponse.json({
      certificados,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error en búsqueda:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
