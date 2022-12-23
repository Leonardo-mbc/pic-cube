-- DropForeignKey
ALTER TABLE `albumContents` DROP FOREIGN KEY `albumContents_albumId_fkey`;

-- DropForeignKey
ALTER TABLE `albumContents` DROP FOREIGN KEY `albumContents_contentId_fkey`;

-- DropForeignKey
ALTER TABLE `albums` DROP FOREIGN KEY `albums_contentId_fkey`;

-- DropForeignKey
ALTER TABLE `collectionContents` DROP FOREIGN KEY `collectionContents_collectionId_fkey`;

-- DropForeignKey
ALTER TABLE `collectionContents` DROP FOREIGN KEY `collectionContents_contentId_fkey`;

-- DropForeignKey
ALTER TABLE `collections` DROP FOREIGN KEY `collections_contentId_fkey`;

-- DropForeignKey
ALTER TABLE `files` DROP FOREIGN KEY `files_contentId_fkey`;

-- AddForeignKey
ALTER TABLE `collections` ADD CONSTRAINT `collections_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `contents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `collectionContents` ADD CONSTRAINT `collectionContents_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `contents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `collectionContents` ADD CONSTRAINT `collectionContents_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `albums` ADD CONSTRAINT `albums_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `contents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `albumContents` ADD CONSTRAINT `albumContents_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `contents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `albumContents` ADD CONSTRAINT `albumContents_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `albums`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `contents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
