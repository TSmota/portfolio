import { messages } from "@/db/schema";

export type Message = typeof messages.$inferInsert;
