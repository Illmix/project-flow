/*
  Warnings:

  - A unique constraint covering the columns `[Email]` on the table `employees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "employees_Email_key" ON "employees"("Email");
