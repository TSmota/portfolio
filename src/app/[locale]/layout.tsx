import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";

import { NextIntlClientProvider } from "next-intl";
import { StaticPageCommonProps } from "@/types/pages";
import { IDELayout } from "@/components/ide-layout";

interface LocaleLayoutProps extends StaticPageCommonProps {
  children: React.ReactNode;
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  return (
    <html lang={locale} suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <NextIntlClientProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
        <IDELayout>
          {children}
        </IDELayout>
      </ThemeProvider>
    </NextIntlClientProvider>
    </body>
    </html>
  );
}
