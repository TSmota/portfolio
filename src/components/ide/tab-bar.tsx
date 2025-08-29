import { Tab } from "./tab";
import { getFileFromPath } from "@/lib/utils";

interface TabBarProps {
  openTabs: string[];
  activeTab: string;
  onTabClick: (path: string) => void;
  onTabClose: (path: string) => void;
}

export function TabBar({ 
  openTabs, 
  activeTab, 
  onTabClick, 
  onTabClose
}: TabBarProps) {
  return (
    <div className="bg-secondary border-b flex overflow-x-auto">
      {openTabs.map((tabPath) => {
        const file = getFileFromPath(tabPath);
        const fileName = file?.name || '';
        const isActive = activeTab === tabPath;
        
        return (
          <Tab
            key={tabPath}
            path={tabPath}
            fileName={fileName}
            isActive={isActive}
            onTabClick={onTabClick}
            onTabClose={onTabClose}
            showCloseButton={openTabs.length > 1}
          />
        );
      })}
    </div>
  );
}
