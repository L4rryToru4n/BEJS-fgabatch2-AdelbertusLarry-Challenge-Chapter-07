/*
  Warnings:

  - A unique constraint covering the columns `[pass_reset_token]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Users_pass_reset_token_key" ON "Users"("pass_reset_token");
