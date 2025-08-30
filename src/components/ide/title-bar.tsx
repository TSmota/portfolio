import { useTranslations } from "next-intl";
import { Settings } from "./settings";

interface TitleBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function TitleBar({ 
  sidebarOpen, 
  setSidebarOpen
}: TitleBarProps) {
  const t = useTranslations('navigation');
  const tIde = useTranslations('ide');
  return (
    <div className="bg-secondary border-b px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 cursor-pointer hover:bg-accent rounded mr-2 md:hidden"
          aria-label={tIde('ariaLabels.toggleSidebar')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 sm:ml-4 text-sm font-medium truncate">Thiago Mota - Portfolio</span>
      </div>
      <div className="text-xs text-muted-foreground flex items-center gap-4">
        <span className="hidden sm:block">{t('title')} IDE</span>
        <Settings />
      </div>
    </div>
  );
}
