import { getTranslations } from "next-intl/server";
import { FileCommentHeader } from "@/components/file-comment-header";

export default async function Loading() {
  const t = await getTranslations('ide.loading');
  return (
    <main className="h-full bg-background text-foreground overflow-auto">
      <div className="flex-1 p-4 sm:p-6">
        <FileCommentHeader filename="loading.tsx" />
        
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          {/* Loading spinner with IDE theme */}
          <div className="relative">
            <div className="w-12 h-12 border-2 border-muted rounded-full animate-spin border-t-primary"></div>
            <div className="absolute inset-0 w-12 h-12 border border-muted/30 rounded-full"></div>
          </div>
          
          {/* Loading text with typewriter effect */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-1 font-mono text-primary">
              <span>{t('title')}</span>
              <span className="animate-pulse">.</span>
              <span className="animate-pulse animation-delay-200">.</span>
              <span className="animate-pulse animation-delay-400">.</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('compiling')}
            </p>
          </div>

          {/* Progress bar simulation */}
          <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse w-3/4 transition-all duration-1000"></div>
          </div>

          {/* IDE-style status indicators */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono mt-8">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
              <span>{t('status.transpiling')}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span>{t('status.loadingComponents')}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>{t('status.ready')}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
