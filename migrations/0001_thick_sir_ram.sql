ALTER TABLE "messages" ADD COLUMN "sent" boolean DEFAULT false NOT NULL;

UPDATE "messages" SET "sent" = false WHERE "sent" IS NULL;
