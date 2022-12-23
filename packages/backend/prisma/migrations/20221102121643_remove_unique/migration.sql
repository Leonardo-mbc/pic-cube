-- DropIndex
DROP INDEX `collectionContents_contentId_collectionId_key` ON `collectionContents`;

ALTER TABLE `collectionContents` DROP FOREIGN KEY `collectionContents_collectionId_fkey`;
DROP INDEX `collectionContents_collectionId_key` ON `collectionContents`;
ALTER TABLE `collectionContents` ADD CONSTRAINT `collectionContents_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
