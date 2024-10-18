/*
  Warnings:

  - A unique constraint covering the columns `[rut]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rut` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "rut" TEXT NOT NULL,
ALTER COLUMN "rol" DROP NOT NULL,
ALTER COLUMN "metodo_pago" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_rut_key" ON "Usuario"("rut");
