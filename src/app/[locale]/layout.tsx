import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";

import { NextIntlClientProvider } from "next-intl";
import { StaticPageCommonProps } from "@/types/pages";
import { IDELayout } from "@/components/ide-layout";
import { Toaster } from "@/components/ui/sonner";

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
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
            <IDELayout>
              {children}
            </IDELayout>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
