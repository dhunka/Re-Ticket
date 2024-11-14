/*
  Warnings:

  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Usuario` table. All the data in the column will be lost.
  - Made the column `clerkId` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Compra" DROP CONSTRAINT "Compra_comprador_id_fkey";

-- DropForeignKey
ALTER TABLE "Disputa" DROP CONSTRAINT "Disputa_comprador_id_fkey";

-- DropForeignKey
ALTER TABLE "Notificacion" DROP CONSTRAINT "Notificacion_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_vendedor_id_fkey";

-- DropForeignKey
ALTER TABLE "Valoracion" DROP CONSTRAINT "Valoracion_comprador_id_fkey";

-- DropForeignKey
ALTER TABLE "Valoracion" DROP CONSTRAINT "Valoracion_vendedor_id_fkey";

-- AlterTable
ALTER TABLE "Compra" ALTER COLUMN "comprador_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Disputa" ALTER COLUMN "comprador_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Notificacion" ALTER COLUMN "usuario_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "vendedor_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
DROP COLUMN "id",
ALTER COLUMN "clerkId" SET NOT NULL,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("clerkId");

-- AlterTable
ALTER TABLE "Valoracion" ALTER COLUMN "vendedor_id" SET DATA TYPE TEXT,
ALTER COLUMN "comprador_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "Usuario"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_comprador_id_fkey" FOREIGN KEY ("comprador_id") REFERENCES "Usuario"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disputa" ADD CONSTRAINT "Disputa_comprador_id_fkey" FOREIGN KEY ("comprador_id") REFERENCES "Usuario"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "Usuario"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_comprador_id_fkey" FOREIGN KEY ("comprador_id") REFERENCES "Usuario"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
