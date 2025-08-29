import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import "./globals.css";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('metadata');

  return {
    title: t('title'),
    description: t('description'),
    icons: {
      icon: '/favicon.ico',
      shortcut: '/apple-touch-icon.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
  };
}

export default function RootLayout({ children }: PropsWithChildren) {
  return children;
}
