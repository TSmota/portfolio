import { db } from "@/db/drizzle";
import { messages } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.SMTP_API_TOKEN!,
});

const recipient = new Recipient(process.env.PERSONAL_EMAIL!);

const sentFrom = new Sender(process.env.SMTP_USER!);

export async function GET() {
  const mails = await db.select().from(messages).where(eq(messages.sent, false));

  if (mails.length === 0) {
    return NextResponse.json({ message: "No mails to send" });
  }

  const sentMails = [];

  for (const mail of mails) {
    const personalization = [
      {
        email: recipient.email,
        data: {
          email: mail.email,
          message: mail.message,
          name: mail.name,
          subject: mail.subject,
        },
      }
    ];

    try {
      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo([recipient])
        .setSubject(mail.subject)
        .setTemplateId('pr9084znvqm4w63d')
        .setPersonalization(personalization);

      await mailerSend.email.send(emailParams);

      sentMails.push(mail.id);
    } catch (error) {
      console.error(error);
    }
  }

  await db.update(messages).set({ sent: true }).where(inArray(messages.id, sentMails));

  return NextResponse.json({ message: `Sent ${sentMails.length} mails` });
}
