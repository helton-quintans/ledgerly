import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    console.log("[REGISTER] Starting registration...");
    const body = await request.json();
    console.log("[REGISTER] Request body:", { email: body.email, name: body.name });
    
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      console.error("[REGISTER] Validation failed:", parsed.error);
      return NextResponse.json(
        { message: "Dados inválidos" },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    console.log("[REGISTER] Checking if user exists...");
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      console.log("[REGISTER] User already exists");
      return NextResponse.json(
        { message: "Este email já está em uso." },
        { status: 409 },
      );
    }

    console.log("[REGISTER] Hashing password...");
    const passwordHash = await hash(password, 12);

    console.log("[REGISTER] Creating user...");
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    console.log("[REGISTER] User created successfully!");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[REGISTER] Error details:", error);
    console.error("[REGISTER] Error message:", error instanceof Error ? error.message : "Unknown error");
    console.error("[REGISTER] Error stack:", error instanceof Error ? error.stack : "No stack");
    return NextResponse.json(
      { message: "Erro inesperado. Tente novamente.", error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 },
    );
  }
}
