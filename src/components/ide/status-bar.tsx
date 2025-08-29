import { useTranslations } from "next-intl";

export function StatusBar() {
  const tIde = useTranslations('ide');
  return (
    <div className="bg-secondary border-t px-3 sm:px-4 py-1 text-xs text-muted-foreground flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
        <span className="hidden sm:inline">{tIde('statusBar.line')}</span>
        <span className="truncate">{tIde('statusBar.language')}</span>
        <span className="hidden md:inline">{tIde('statusBar.encoding')}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        <span className="hidden sm:inline">{tIde('ready')}</span>
      </div>
    </div>
  );
}
