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
