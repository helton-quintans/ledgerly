import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { transactionFormSchema } from "@/lib/schemas/transaction";
import { NextResponse } from "next/server";
import { z } from "zod";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// PATCH /api/transactions/[id] - Update a transaction
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    // Check if the transaction exists and belongs to the user
    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate the request body (make all fields optional for partial update)
    const partialSchema = transactionFormSchema.partial();
    const validated = partialSchema.parse(body);

    // Update the transaction
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...(validated.type && { type: validated.type }),
        ...(validated.amount_cents !== undefined && { amount_cents: validated.amount_cents }),
        ...(validated.currency && { currency: validated.currency }),
        ...(validated.category && { category: validated.category }),
        ...(validated.description !== undefined && {
          description: validated.description || null,
        }),
        ...(validated.date && { date: new Date(validated.date) }),
        // Optional: update converted amounts if provided
        ...(body.converted_amount_cents !== undefined && {
          converted_amount_cents: body.converted_amount_cents || null,
        }),
        ...(body.converted_currency !== undefined && {
          converted_currency: body.converted_currency || null,
        }),
        ...(body.exchange_rate !== undefined && {
          exchange_rate: body.exchange_rate || null,
        }),
        ...(body.rate_timestamp !== undefined && {
          rate_timestamp: body.rate_timestamp ? new Date(body.rate_timestamp) : null,
        }),
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 },
    );
  }
}

// DELETE /api/transactions/[id] - Delete a transaction
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // Check if the transaction exists and belongs to the user
    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the transaction
    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 },
    );
  }
}
