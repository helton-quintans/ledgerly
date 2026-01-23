/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userId_fkey";

-- DropTable
DROP TABLE "Category";

-- CreateTable
CREATE TABLE "TransactionCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransactionCategory_userId_idx" ON "TransactionCategory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionCategory_userId_name_key" ON "TransactionCategory"("userId", "name");

-- AddForeignKey
ALTER TABLE "TransactionCategory" ADD CONSTRAINT "TransactionCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
