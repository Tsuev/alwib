-- CreateTable
CREATE TABLE "public"."Storefront" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" VARCHAR(10),
    "logoUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Storefront_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductStatus" (
    "id" SERIAL NOT NULL,
    "storefrontId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "severity" TEXT NOT NULL,

    CONSTRAINT "ProductStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" SERIAL NOT NULL,
    "storefrontId" INTEGER NOT NULL,
    "statusId" INTEGER,
    "name" VARCHAR(30) NOT NULL,
    "description" VARCHAR(100),
    "price" DECIMAL(12,2) NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Storefront_userId_key" ON "public"."Storefront"("userId");

-- CreateIndex
CREATE INDEX "ProductStatus_storefrontId_idx" ON "public"."ProductStatus"("storefrontId");

-- CreateIndex
CREATE INDEX "Product_storefrontId_idx" ON "public"."Product"("storefrontId");

-- AddForeignKey
ALTER TABLE "public"."Storefront" ADD CONSTRAINT "Storefront_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductStatus" ADD CONSTRAINT "ProductStatus_storefrontId_fkey" FOREIGN KEY ("storefrontId") REFERENCES "public"."Storefront"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_storefrontId_fkey" FOREIGN KEY ("storefrontId") REFERENCES "public"."Storefront"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."ProductStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
