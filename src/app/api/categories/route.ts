import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1).max(12),
  icon: z.string().min(1).max(2).optional(),
  type: z.enum(["income", "expense"]).optional(),
});

// GET /api/categories - List all categories
export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" }, 
      { status: 401 }
    );
  }
  const categories = await prisma.transactionCategory.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });
  // Retorna também o campo icon
  return NextResponse.json(categories.map(c => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    type: c.type,
  })));
}

// POST /api/categories - Create a new category
export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" }, 
      { status: 401 }
    );
  }
  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid category name" }, 
      { status: 400 }
    );
  }
  const { name, icon, type } = parsed.data;
  try {
    const category = await prisma.transactionCategory.create({
      data: {
        name,
        icon: icon ?? "📌",
        type: type ?? "expense",
        userId: session.user.id,
      },
    });
    return NextResponse.json({
      id: category.id,
      name: category.name,
      icon: category.icon,
      type: category.type,
    }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Category already exists" }, 
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create category" }, 
      { status: 500 }
    );
  }
}
