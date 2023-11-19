/*
  Warnings:

  - You are about to drop the column `publicIid` on the `RecipePhoto` table. All the data in the column will be lost.
  - Added the required column `publicId` to the `RecipePhoto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecipePhoto" DROP COLUMN "publicIid",
ADD COLUMN     "publicId" TEXT NOT NULL;
