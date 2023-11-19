-- CreateTable
CREATE TABLE "RecipePhoto" (
    "id" SERIAL NOT NULL,
    "assetId" TEXT NOT NULL,
    "publicIid" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "bytes" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "folder" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "RecipePhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipePhoto" ADD CONSTRAINT "RecipePhoto_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
