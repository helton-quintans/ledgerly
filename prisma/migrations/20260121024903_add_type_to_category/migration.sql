/*
  Warnings:

  - Added the required column `type` to the `TransactionCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Adiciona coluna como opcional
ALTER TABLE "TransactionCategory" ADD COLUMN "type" TEXT;

-- Atualiza registros existentes para 'expense' (ou outro valor desejado)
UPDATE "TransactionCategory" SET "type" = 'expense' WHERE "type" IS NULL;

-- Torna a coluna obrigatória
ALTER TABLE "TransactionCategory" ALTER COLUMN "type" SET NOT NULL;
