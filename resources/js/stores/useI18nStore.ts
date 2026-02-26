import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { en } from '../locales/en';
import { fr } from '../locales/fr';

type Language = 'en' | 'fr';

// A simple utility to traverse nested objects
type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<typeof en> | (string & {});

interface I18nState {
    language: Language;
    setLanguage: (lang: Language) => void;
    // Dynamic translation function
    t: (key: TranslationKey) => string;
}

const dictionaries = {
    en,
    fr,
};

// Helper function to resolve dot-notation paths
const resolvePath = (obj: any, path: string) => {
    return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);
};

export const useI18nStore = create<I18nState>()(
    persist(
        (set, get) => ({
            // French is the default local language
            language: 'fr',
            setLanguage: (lang: Language) => set({ language: lang }),
            t: (key: TranslationKey) => {
                const { language } = get();
                const dict = dictionaries[language] || dictionaries['fr'];

                // Resolve nested keys e.g., 'header.home'
                const translation = resolvePath(dict, key);

                // Fallback to English, then the key itself if not found
                if (translation === undefined || translation === null) {
                    const fallback = resolvePath(dictionaries['en'], key);
                    return fallback !== undefined && fallback !== null ? fallback : key;
                }

                return translation;
            },
        }),
        {
            name: 'kbs-i18n-storage',
        }
    )
);
