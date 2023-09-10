/*
  Warnings:

  - Added the required column `userRole` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "userRole" TEXT NOT NULL;
