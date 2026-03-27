
-- 1) create enum types
CREATE TYPE "Currency" AS ENUM ('BRL', 'USD', 'EUR');
CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- 2) add recurringId column (nullable)
ALTER TABLE "Transaction" ADD COLUMN "recurringId" TEXT;

-- 3) convert existing Transaction.currency values to the new enum safely
ALTER TABLE "Transaction"
  ALTER COLUMN "currency" TYPE "Currency"
  USING (
    CASE
      WHEN "currency" = 'BRL' THEN 'BRL'::"Currency"
      WHEN "currency" = 'USD' THEN 'USD'::"Currency"
      WHEN "currency" = 'EUR' THEN 'EUR'::"Currency"
      ELSE 'BRL'::"Currency" -- fallback: adjust if you prefer to fail/report
    END
  );

-- 4) create RecurringTransaction table using enum Currency
CREATE TABLE "RecurringTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "frequency" "Frequency" NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "daysOfWeek" TEXT,
    "dayOfMonth" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RecurringTransaction_pkey" PRIMARY KEY ("id")
);

-- 5) convert existing RecurringTransaction.currency is not necessary (new table),
-- but if you already have rows in RecurringTransaction (unlikely), you can run an UPDATE similar to Transaction.

-- 6) add foreign key constraints
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recurringId_fkey" FOREIGN KEY ("recurringId") REFERENCES "RecurringTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RecurringTransaction" ADD CONSTRAINT "RecurringTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

