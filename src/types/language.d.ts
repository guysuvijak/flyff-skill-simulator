// Next.js 15 - src/types/language.d.ts
export type Language =
    | 'en'
    | 'th'
    | 'jp'
    | 'vi'
    | 'cns'
    | 'br'
    | 'de'
    | 'fr'
    | 'id'
    | 'kr'
    | 'sp';

export type TranslationValue = string | { [key: string]: TranslationValue };

export type Variables = {
    [key: string]: string | number | ReactNode;
};

export type Translation = {
    [key: string]: TranslationValue;
};

export type TranslationsType = {
    [K in Language]: {
        [key: string]: TranslationValue;
    };
};
