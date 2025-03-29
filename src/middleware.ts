import createMiddleware from 'next-intl/middleware';
import {NextRequest} from "next/server";
import {supportedLocales} from "@/i18n/request";

export default function middleware(request: NextRequest) {
  const userLanguage = request.headers
    .get("accept-language")
    ?.split(",")[0]
    ?.split("-")[0] || '';

  const defaultLocale = supportedLocales.includes(userLanguage) ? userLanguage : "en";

  return createMiddleware({
    locales: supportedLocales,
    defaultLocale,
  })(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
