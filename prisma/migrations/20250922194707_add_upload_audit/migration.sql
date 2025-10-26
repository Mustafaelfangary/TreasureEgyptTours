-- CreateEnum
CREATE TYPE "public"."UploadSource" AS ENUM ('LOCAL', 'EXTERNAL', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."UploadStatus" AS ENUM ('SUCCESS', 'ERROR');

-- CreateTable
CREATE TABLE "public"."UploadAudit" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "role" "public"."Role",
    "source" "public"."UploadSource" NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "status" "public"."UploadStatus" NOT NULL DEFAULT 'SUCCESS',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadAudit_pkey" PRIMARY KEY ("id")
);
