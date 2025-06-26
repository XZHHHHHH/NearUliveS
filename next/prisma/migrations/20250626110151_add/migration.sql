/*
  Warnings:

  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `progfileImage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
CREATE SEQUENCE post_id_seq;
ALTER TABLE "Post" ALTER COLUMN "id" SET DEFAULT nextval('post_id_seq'),
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE post_id_seq OWNED BY "Post"."id";

-- DropIndex
DROP INDEX "Post_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "createdAt",
DROP COLUMN "progfileImage",
DROP COLUMN "username",
ADD COLUMN     "profileId" INTEGER;

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "bio" TEXT,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_profileId_key" ON "User"("profileId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
