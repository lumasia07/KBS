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

// Creates a new `t` function bound to a specific language.
// A new reference is created each time so zustand detects the change and re-renders subscribers.
const createT = (lang: Language) => (key: TranslationKey): string => {
    const dict = dictionaries[lang] || dictionaries['fr'];
    const translation = resolvePath(dict, key);

    if (translation === undefined || translation === null) {
        const fallback = resolvePath(dictionaries['en'], key);
        return fallback !== undefined && fallback !== null ? fallback : key;
    }

    return translation;
};

export const useI18nStore = create<I18nState>()(
    persist(
        (set) => ({
            // French is the default local language
            language: 'fr',
            setLanguage: (lang: Language) => set({ language: lang, t: createT(lang) }),
            t: createT('fr'),
        }),
        {
            name: 'kbs-i18n-storage',
            partialize: (state) => ({ language: state.language }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.t = createT(state.language);
                }
            },
        }
    )
);
