ALTER TABLE `Lead`
    ADD COLUMN `assignedBronzeReferral` DECIMAL(5, 2) NULL,
    ADD COLUMN `assignedSilverReferral` DECIMAL(5, 2) NULL,
    ADD COLUMN `assignedGoldReferral` DECIMAL(5, 2) NULL;

ALTER TABLE `User`
    ADD COLUMN `bronzeReferralRate` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `silverReferralRate` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `goldReferralRate` DECIMAL(5, 2) NOT NULL DEFAULT 0;

UPDATE `User`
SET
    `bronzeReferralRate` = `referralRate`,
    `silverReferralRate` = `referralRate`,
    `goldReferralRate` = `referralRate`;

UPDATE `Lead`
SET
    `assignedBronzeReferral` = `assignedReferralRate`,
    `assignedSilverReferral` = `assignedReferralRate`,
    `assignedGoldReferral` = `assignedReferralRate`
WHERE `assignedReferralRate` IS NOT NULL;
