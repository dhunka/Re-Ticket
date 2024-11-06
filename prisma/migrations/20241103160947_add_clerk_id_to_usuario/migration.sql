/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "clerkId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_clerkId_key" ON "Usuario"("clerkId");
