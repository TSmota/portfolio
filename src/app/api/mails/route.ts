import { db } from "@/db/drizzle";
import { messages } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD!,
  },
});

const MAIL_TEMPLATE = `
  New message from {{name}}
  Email: {{email}}
  Message: {{message}}
`;

export async function GET() {
  const mails = await db.select().from(messages).where(eq(messages.sent, false));
  
  if (mails.length === 0) {
    return NextResponse.json({ message: "No mails to send" });
  }

  const sentMails = [];

  for (const mail of mails) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.PERSONAL_EMAIL,
        subject: `New message from ${mail.name} - ${mail.subject}`,
        text: MAIL_TEMPLATE
          .replace("{{name}}", mail.name)
          .replace("{{email}}", mail.email)
          .replace("{{message}}", mail.message),
      });

      sentMails.push(mail.id);
    } catch (error) {
      console.error(error);
    }
  }

  await db.update(messages).set({ sent: true }).where(inArray(messages.id, sentMails));

  return NextResponse.json({ message: `Sent ${sentMails.length} mails` });
}
