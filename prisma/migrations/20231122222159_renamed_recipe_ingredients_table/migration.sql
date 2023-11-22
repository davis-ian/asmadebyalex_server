/*
  Warnings:

  - You are about to drop the `RecipeIngredients` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecipeIngredients" DROP CONSTRAINT "RecipeIngredients_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIngredients" DROP CONSTRAINT "RecipeIngredients_measurementUnitId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIngredients" DROP CONSTRAINT "RecipeIngredients_recipeId_fkey";

-- DropTable
DROP TABLE "RecipeIngredients";

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "recipeId" INTEGER NOT NULL,
    "ingredientId" INTEGER NOT NULL,
    "measurementUnitId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("recipeId","ingredientId")
);

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_measurementUnitId_fkey" FOREIGN KEY ("measurementUnitId") REFERENCES "MeasurementUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
