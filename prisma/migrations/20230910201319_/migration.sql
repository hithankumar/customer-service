/*
  Warnings:

  - You are about to alter the column `password` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "activationCode" TEXT,
ADD COLUMN     "isVerified" BOOLEAN DEFAULT false,
ALTER COLUMN "password" SET DATA TYPE VARCHAR(50);
