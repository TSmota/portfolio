import { useTranslations } from "next-intl";
import { getFileIcon } from "@/lib/utils";

interface TabProps {
  path: string;
  fileName: string;
  isActive: boolean;
  onTabClick: (path: string) => void;
  onTabClose: (path: string) => void;
  showCloseButton: boolean;
}

export function Tab({ 
  path, 
  fileName, 
  isActive, 
  onTabClick, 
  onTabClose, 
  showCloseButton
}: TabProps) {
  const tIde = useTranslations('ide');
  return (
    <div
      className={`
        flex items-center gap-2 px-3 sm:px-4 py-2 border-r text-xs sm:text-sm cursor-pointer
        transition-colors duration-200 min-w-0 flex-shrink-0
        ${isActive 
          ? 'bg-background text-foreground' 
          : 'bg-secondary/50 text-muted-foreground hover:bg-secondary/80'
        }
      `}
      onClick={() => onTabClick(path)}
    >
      <span className="flex-shrink-0">{getFileIcon(fileName.split('.')[1])}</span>
      <span className="truncate max-w-32">{fileName}</span>
      {showCloseButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTabClose(path);
          }}
          className="flex-shrink-0 hover:bg-destructive/20 rounded p-0.5 ml-1 cursor-pointer"
          aria-label={tIde('ariaLabels.closeTab')}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
