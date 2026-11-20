/*
  Warnings:

  - You are about to drop the column `assignedInterest` on the `lead` table. All the data in the column will be lost.
  - You are about to drop the column `assignedReferral` on the `lead` table. All the data in the column will be lost.
  - You are about to drop the column `interestRate` on the `user` table. All the data in the column will be lost.
  - Added the required column `bronzeReturnRate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goldReturnRate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `silverReturnRate` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Lead` DROP COLUMN `assignedInterest`,
    DROP COLUMN `assignedReferral`,
    ADD COLUMN `assignedBronzeReturn` DECIMAL(5, 2) NULL,
    ADD COLUMN `assignedGoldReturn` DECIMAL(5, 2) NULL,
    ADD COLUMN `assignedReferralRate` DECIMAL(5, 2) NULL,
    ADD COLUMN `assignedSilverReturn` DECIMAL(5, 2) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `interestRate`,
    ADD COLUMN `bronzeReturnRate` DECIMAL(5, 2) NOT NULL,
    ADD COLUMN `goldReturnRate` DECIMAL(5, 2) NOT NULL,
    ADD COLUMN `silverReturnRate` DECIMAL(5, 2) NOT NULL;
