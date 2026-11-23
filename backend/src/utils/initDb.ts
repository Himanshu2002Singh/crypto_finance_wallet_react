import { prisma } from "./prisma.js";

export async function ensureDatabaseTables() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`Withdrawal\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`amount\` DECIMAL(12, 2) NOT NULL,
        \`walletAddress\` VARCHAR(255) NOT NULL,
        \`network\` VARCHAR(100) NOT NULL DEFAULT 'USDT (TRC20)',
        \`phone\` VARCHAR(100) NOT NULL,
        \`status\` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
        \`txHash\` VARCHAR(255) NULL,
        \`adminNote\` TEXT NULL,
        \`reviewedById\` VARCHAR(191) NULL,
        \`reviewedAt\` DATETIME(3) NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        \`userId\` VARCHAR(191) NOT NULL,
        INDEX \`Withdrawal_userId_idx\` (\`userId\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
  } catch (err) {
    // Silently proceed if table already managed by Prisma migrations
  }
}

