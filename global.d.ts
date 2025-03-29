import messages from './messages/en.json';

declare module 'next-intl' {
    import {supportedLocales} from "@/i18n/request";

    interface AppConfig {
        Locale: (typeof supportedLocales)[number]
        Messages: typeof messages;
    }
}
