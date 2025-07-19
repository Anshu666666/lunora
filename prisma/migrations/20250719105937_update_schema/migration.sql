/*
  Warnings:

  - You are about to drop the column `artist` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Song` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "artist",
DROP COLUMN "created_at",
DROP COLUMN "duration",
DROP COLUMN "title";
