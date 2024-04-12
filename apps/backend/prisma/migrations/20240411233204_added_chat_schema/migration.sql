-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "admin" TEXT NOT NULL,
    "isGroupChat" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);
