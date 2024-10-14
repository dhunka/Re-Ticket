/*
  Warnings:

  - Added the required column `fecha_de_nacimiento` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "fecha_de_nacimiento" TIMESTAMP(3) NOT NULL;
