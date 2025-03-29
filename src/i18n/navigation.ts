import { createNavigation } from 'next-intl/navigation';
import { supportedLocales } from "@/i18n/request";

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation({
  locales: supportedLocales,
});
