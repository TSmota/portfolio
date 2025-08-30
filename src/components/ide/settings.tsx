"use client";

import { SettingsIcon, Sun, Moon, Monitor, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface ToggleButtonProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  orientation?: 'vertical' | 'horizontal';
}

function ToggleButton({ active, children, onClick, orientation = 'horizontal' }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer text-xs hover:bg-accent transition-colors",
        active && 'bg-accent border-primary',
        orientation === 'vertical' && 'flex-col')}
    >
      {children}
    </button>
  );
}

export function Settings() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('ide.settings');

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Popover>
      <PopoverTrigger>
        <SettingsIcon className="cursor-pointer hover:text-foreground/80 transition-colors" size={16} />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2 border-b pb-3">
            <SettingsIcon size={18} />
            <h3 className="font-semibold">{t('title')}</h3>
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Sun size={14} />
              {t('theme.title')}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <ToggleButton
                active={theme === 'light'}
                onClick={() => handleThemeChange('light')}
                orientation='vertical'
              >
                <Sun size={16} />
                {t('theme.light')}
              </ToggleButton>
              <ToggleButton
                active={theme === 'dark'}
                onClick={() => handleThemeChange('dark')}
                orientation='vertical'
              >
                <Moon size={16} />
                {t('theme.dark')}
              </ToggleButton>
              <ToggleButton
                active={theme === 'system'}
                onClick={() => handleThemeChange('system')}
                orientation='vertical'
              >
                <Monitor size={16} />
                {t('theme.system')}
              </ToggleButton>
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Globe size={14} />
              {t('language.title')}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <ToggleButton
                active={locale === 'en'}
                onClick={() => handleLanguageChange('en')}
              >
                🇺🇸 {t('language.english')}
              </ToggleButton>
              <ToggleButton
                active={locale === 'pt'}
                onClick={() => handleLanguageChange('pt')}
              >
                🇧🇷 {t('language.portuguese')}
              </ToggleButton>
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-muted-foreground pt-3 border-t">
            {t('footer')}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
