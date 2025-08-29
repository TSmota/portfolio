import { useTranslations } from "next-intl";
import { FileTreeItem } from "./file-tree-item";
import { fileStructure } from "@/constants/file-structure";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  pathname: string;
  onFileClick: (path: string) => void;
}

export function Sidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  pathname, 
  onFileClick
}: SidebarProps) {
  const tIde = useTranslations('ide');
  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`
        w-72 bg-secondary/97 border-r flex flex-col
        fixed left-0 top-0 h-full z-50 transition-transform duration-300
        md:relative md:translate-x-0 md:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="px-3 py-2 border-b bg-secondary/80 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {tIde('explorer')}
          </h3>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-accent rounded md:hidden cursor-pointer"
            aria-label={tIde('ariaLabels.closeSidebar')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 p-2 overflow-y-auto">
          {fileStructure.map((item, index) => (
            <FileTreeItem
              key={index}
              item={item}
              depth={0}
              pathname={pathname}
              onFileClick={onFileClick}
              onMobileClose={() => setSidebarOpen(false)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
