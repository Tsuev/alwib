-- CreateTable
CREATE TABLE "AiPinnedChat" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "agent" TEXT NOT NULL,
    "roleLocked" BOOLEAN NOT NULL DEFAULT false,
    "input" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiPinnedChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiPinnedMessage" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiPinnedMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiPinnedChat_userId_idx" ON "AiPinnedChat"("userId");

-- CreateIndex
CREATE INDEX "AiPinnedChat_userId_updatedAt_idx" ON "AiPinnedChat"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "AiPinnedMessage_chatId_idx" ON "AiPinnedMessage"("chatId");

-- CreateIndex
CREATE INDEX "AiPinnedMessage_chatId_order_idx" ON "AiPinnedMessage"("chatId", "order");

-- AddForeignKey
ALTER TABLE "AiPinnedChat" ADD CONSTRAINT "AiPinnedChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiPinnedMessage" ADD CONSTRAINT "AiPinnedMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "AiPinnedChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
