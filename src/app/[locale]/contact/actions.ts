"use server";

import { db } from "@/db/drizzle";
import { messages } from "@/db/schema";
import type { Message } from "@/types/message";

export async function sendMessage(message: Message): Promise<void> {
  await db.insert(messages).values({
    name: message.name,
    email: message.email,
    subject: message.subject,
    message: message.message,
  });
}
