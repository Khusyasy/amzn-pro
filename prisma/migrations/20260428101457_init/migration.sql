-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "asin" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "productUrl" TEXT NOT NULL,
    "stars" DOUBLE PRECISION NOT NULL,
    "reviews" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "listPrice" DOUBLE PRECISION NOT NULL,
    "isBestSeller" BOOLEAN NOT NULL,
    "boughtInLastMonth" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("asin")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
