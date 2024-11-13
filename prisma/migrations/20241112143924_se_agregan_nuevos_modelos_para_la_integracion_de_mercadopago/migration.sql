/*
  Warnings:

  - You are about to drop the column `metodo_pago` on the `Compra` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Compra" DROP COLUMN "metodo_pago",
ADD COLUMN     "mp_external_reference" TEXT,
ADD COLUMN     "mp_merchant_order_id" TEXT,
ADD COLUMN     "mp_payment_id" TEXT,
ADD COLUMN     "mp_payment_status" TEXT,
ADD COLUMN     "mp_preference_id" TEXT;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "mp_access_token" TEXT,
ADD COLUMN     "mp_account_id" TEXT,
ADD COLUMN     "mp_connected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mp_refresh_token" TEXT,
ADD COLUMN     "mp_token_expires" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "MercadoPagoWebhook" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "MercadoPagoWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentPreference" (
    "id" SERIAL NOT NULL,
    "mp_preference_id" TEXT NOT NULL,
    "compra_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentPreference_mp_preference_id_key" ON "PaymentPreference"("mp_preference_id");

-- AddForeignKey
ALTER TABLE "PaymentPreference" ADD CONSTRAINT "PaymentPreference_compra_id_fkey" FOREIGN KEY ("compra_id") REFERENCES "Compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
