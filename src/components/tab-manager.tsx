"use client";

import { usePathname, Link } from "@/i18n/navigation";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

export function TabManager() {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const toggleOpen = useCallback(() => setOpen(prev => !prev), []);

  const routes = [
    { label: t('home'), path: '/' },
    { label: t('about'), path: '/about' },
    { label: t('projects'), path: '/projects' },
    { label: t('contact'), path: '/contact' },
  ];

  return (
    <nav className="flex w-full font-mono border rounded-t-2xl justify-between items-center relative sm:justify-start">
      <Link className="p-6 border-r" href="/">{t('title')}</Link>

      <button type="button" onClick={toggleOpen}
              className="cursor-pointer inline-flex items-center mr-2 p-2 w-10 h-10 justify-center text-sm text-primary rounded-lg sm:hidden hover:bg-accent focus:outline-none focus:ring-2"
              aria-controls="navbar-default" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
      </button>

      <div className={clsx("absolute bottom-0 right-0 translate-y-full border bg-background sm:flex sm:grow sm:static sm:translate-y-0", { "hidden": !open })}>
        <ul className="flex flex-col w-full items-center sm:flex-row">
          {routes.map(route => (
            <li
              key={route.path}
              className={clsx(
                "inline-flex w-full sm:w-auto sm:border-r hover:bg-accent sm:last:ml-auto sm:last:border-l",
                pathname === route.path ? "bg-accent" : "bg-background"
              )}
            >
              <Link href={route.path} className="w-full p-6 hover:brightness-75 transition-all duration-150" onClick={toggleOpen}>
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
