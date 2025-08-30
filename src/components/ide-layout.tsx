"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { TitleBar } from "./ide/title-bar";
import { Sidebar } from "./ide/sidebar";
import { TabBar } from "./ide/tab-bar";
import { StatusBar } from "./ide/status-bar";

interface IDELayoutProps {
  children: React.ReactNode;
}

export function IDELayout({ children }: IDELayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openTabs, setOpenTabs] = useState<string[]>([pathname]);
  const [activeTab, setActiveTab] = useState(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openTab = useCallback((path: string) => {
    if (!openTabs.includes(path)) {
      setOpenTabs(prev => [...prev, path]);
    }
    
    setActiveTab(path);
  }, [openTabs]);

  const closeTab = (path: string) => {
    const newTabs = openTabs.filter(tab => tab !== path);
    setOpenTabs(newTabs);
    
    if (activeTab === path) {
      // If closing the active tab, switch to the last remaining tab or pathname
      const fallbackTab = newTabs.length > 0 ? newTabs[newTabs.length - 1] : pathname;
      
      // Navigate to the fallback tab if it's different from current pathname
      if (fallbackTab !== pathname) {
        router.push(fallbackTab);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      // Auto-close sidebar when switching to desktop
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync activeTab with pathname changes
  useEffect(() => {
    if (pathname !== activeTab) {
      openTab(pathname);
    }
  }, [pathname, activeTab, openTab]);

  const handleTabClick = (path: string) => {
    if (path !== pathname) {
      router.push(path);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background font-mono">
      <TitleBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          pathname={pathname}
          onFileClick={handleTabClick}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TabBar
            openTabs={openTabs}
            activeTab={activeTab}
            onTabClick={handleTabClick}
            onTabClose={closeTab}
          />

          {/* Code Editor Area */}
          <div className="flex-1 bg-background overflow-auto">
            <div className="h-full">
              {children}
            </div>
          </div>

          <StatusBar />
        </div>
      </div>
    </div>
  );
}
