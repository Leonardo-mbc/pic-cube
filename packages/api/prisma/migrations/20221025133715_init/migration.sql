-- CreateTable
CREATE TABLE `Directory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `aliasPath` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Directory_path_key`(`path`),
    UNIQUE INDEX `Directory_aliasPath_key`(`aliasPath`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `directoryId` INTEGER NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `fileHash` VARCHAR(191) NOT NULL,
    `unlink` BOOLEAN NOT NULL DEFAULT false,
    `lastAccessedAt` DATETIME(3) NOT NULL,
    `lastModifiedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_directoryId_fkey` FOREIGN KEY (`directoryId`) REFERENCES `Directory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
