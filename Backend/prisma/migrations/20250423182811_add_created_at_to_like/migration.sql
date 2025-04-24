/*
  Warnings:

  - A unique constraint covering the columns `[user_id,post_id]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `like` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Like_user_id_post_id_key` ON `Like`(`user_id`, `post_id`);
