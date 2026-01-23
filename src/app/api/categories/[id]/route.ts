import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1).max(12),
  icon: z.string().min(1).max(2).optional(),
  type: z.enum(["income", "expense"]).optional(),
});

// PATCH /api/categories/[id] - Edit a user category
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid category name" }, { status: 400 });
  }
  const { name, icon, type } = parsed.data;
  try {
    // Only allow editing user's own categories
    const updated = await prisma.transactionCategory.updateMany({
      where: { id, userId: session.user.id },
      data: { name, ...(icon ? { icon } : {}), ...(type ? { type } : {}) },
    });
    if (updated.count === 0) {
      return NextResponse.json({ error: "Category not found or not allowed" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// DELETE /api/categories/[id] - Delete a user category
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    // Only allow deleting user's own categories
    const deleted = await prisma.transactionCategory.deleteMany({
      where: { id, userId: session.user.id },
    });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Category not found or not allowed" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
