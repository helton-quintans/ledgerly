import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { transactionFormSchema } from "@/lib/schemas/transaction";
import { NextResponse } from "next/server";
import { z } from "zod";

// GET /api/transactions - List all transactions for the authenticated user
export async function GET() {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: Request) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate the request body
    const validated = transactionFormSchema.parse(body);

    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: validated.type,
        amount_cents: validated.amount_cents,
        currency: validated.currency,
        category: validated.category,
        description: validated.description || null,
        date: validated.date ? new Date(validated.date) : new Date(),
        // Optional: store converted amounts if provided
        converted_amount_cents: body.converted_amount_cents || null,
        converted_currency: body.converted_currency || null,
        exchange_rate: body.exchange_rate || null,
        rate_timestamp: body.rate_timestamp ? new Date(body.rate_timestamp) : null,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 },
    );
  }
}
