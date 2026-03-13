-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "messenger" TEXT;

-- AlterTable
ALTER TABLE "public"."Storefront" ADD COLUMN     "telegram" TEXT,
ADD COLUMN     "whatsapp" TEXT;
