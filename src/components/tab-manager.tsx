import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function TabManager() {
  const t = await getTranslations('navigation');

  const routes = [
    { label: t('home'), route: '' },
    { label: t('about'), route: 'about' },
    { label: t('projects'), route: 'projects' },
    { label: t('contact'), route: 'contact' },
  ];

  return (
    <nav className="flex w-full font-mono border rounded-t-2xl">
      <ul className="flex w-full items-center">
        <li className="p-6 pr-16 border-r">{t('title')}</li>
        {routes.map(route => (
          <li key={route.route} className="inline-flex border-r last:border-l last:ml-auto">
            <Link href={`/${route.route}`} className="p-6 hover:brightness-75 transition-all duration-150">
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
