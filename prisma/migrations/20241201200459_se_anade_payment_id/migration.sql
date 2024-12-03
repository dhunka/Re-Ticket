/*
  Warnings:

  - You are about to drop the column `fecha_de_nacimiento` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `foto_perfil` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `verificado` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[payment_id]` on the table `Compra` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `video_vendedor` to the `Compra` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "payment_id" TEXT,
ADD COLUMN     "video_vendedor" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "fecha_de_nacimiento",
DROP COLUMN "foto_perfil",
DROP COLUMN "password",
DROP COLUMN "verificado";

-- CreateIndex
CREATE UNIQUE INDEX "Compra_payment_id_key" ON "Compra"("payment_id");
