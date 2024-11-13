/*
  Warnings:

  - You are about to drop the column `fecha_termino` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `organizador_id` on the `Evento` table. All the data in the column will be lost.
  - Added the required column `url_foto` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_entrada_id` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Evento" DROP CONSTRAINT "Evento_organizador_id_fkey";

-- AlterTable
ALTER TABLE "Evento" DROP COLUMN "fecha_termino",
DROP COLUMN "organizador_id",
ADD COLUMN     "url_foto" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "tipo_entrada_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TipoEntrada" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio_base" DECIMAL(65,30) NOT NULL,
    "evento_id" INTEGER NOT NULL,

    CONSTRAINT "TipoEntrada_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TipoEntrada" ADD CONSTRAINT "TipoEntrada_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_tipo_entrada_id_fkey" FOREIGN KEY ("tipo_entrada_id") REFERENCES "TipoEntrada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
