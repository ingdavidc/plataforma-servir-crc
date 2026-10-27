import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "servir-crc-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuarioPanel.findUnique({
      where: { email },
    });

    if (!usuario || !usuario.activo) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(password, usuario.password);
    if (!passwordValid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        userId: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre,
        entidad: usuario.entidad,
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    const response = NextResponse.json({
      token,
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        entidad: usuario.entidad,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 60 * 60, // 8 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
