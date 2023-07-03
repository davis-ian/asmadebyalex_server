/*
  Warnings:

  - Added the required column `measurementUnitId` to the `RecipeIngredients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecipeIngredients" ADD COLUMN     "measurementUnitId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "MeasurementUnit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MeasurementUnit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeIngredients" ADD CONSTRAINT "RecipeIngredients_measurementUnitId_fkey" FOREIGN KEY ("measurementUnitId") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
