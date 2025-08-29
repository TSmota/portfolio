import { Link } from "@/i18n/navigation";
import { getFileIcon } from "@/lib/utils";

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
  extension?: string;
  children?: FileItem[];
}

interface FileTreeItemProps {
  item: FileItem;
  depth: number;
  pathname: string;
  onFileClick: (path: string) => void;
  onMobileClose: () => void;
}

export function FileTreeItem({ 
  item, 
  depth, 
  pathname, 
  onFileClick, 
  onMobileClose
}: FileTreeItemProps) {
  return (
    <div style={{ paddingLeft: `${depth * 12}px` }}>
      {item.type === 'folder' ? (
        <div className="py-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>📁</span>
            <span>{item.name}</span>
          </div>
          {item.children && (
            <div className="ml-2">
              {item.children.map((child, index) => (
                <FileTreeItem
                  key={index}
                  item={child}
                  depth={depth + 1}
                  pathname={pathname}
                  onFileClick={onFileClick}
                  onMobileClose={onMobileClose}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <Link
          href={item.path}
          onClick={() => {
            // Only open tabs for actual pages, not anchor links
            if (!item.path.includes('#')) {
              onFileClick(item.path);
            }
            
            // Close sidebar on mobile after clicking
            if (window.innerWidth < 768) {
              onMobileClose();
            }
          }}
          className={`flex items-center gap-2 py-1 px-2 text-sm rounded hover:bg-accent cursor-pointer ${
            pathname === item.path ? 'bg-accent text-primary' : 'text-muted-foreground'
          }`}
        >
          <span>{getFileIcon(item.extension)}</span>
          <span>{item.name}</span>
        </Link>
      )}
    </div>
  );
}
