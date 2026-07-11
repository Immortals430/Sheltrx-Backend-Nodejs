/*
  Warnings:

  - Changed the type of `menuPresetItem` on the `MenuPreset` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MenuPreset" DROP COLUMN "menuPresetItem",
ADD COLUMN     "menuPresetItem" JSONB NOT NULL;
