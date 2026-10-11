import { createContext, useContext, useMemo, type ReactNode } from "react";

export interface KomachiTranslations {
  layerDialog: {
    close: string;
    cancel: string;
  };
}

export type KomachiTranslationsPartial = {
  [Key in keyof KomachiTranslations]?: Partial<KomachiTranslations[Key]>;
};

const defaultTranslations: KomachiTranslations = {
  layerDialog: {
    close: "Close",
    cancel: "Cancel",
  },
};

const KomachiLocaleContext = createContext<KomachiTranslations>(defaultTranslations);

export interface KomachiLocaleProviderProps {
  children: ReactNode;
  /**
   * Partial overrides for Komachi's built-in English copy. Components without an
   * override continue to use their English defaults.
   */
  translations?: KomachiTranslationsPartial;
}

/**
 * Supplies translations for Komachi-owned UI copy. Explicit component props take
 * precedence over these defaults.
 */
export function KomachiLocaleProvider({
  children,
  translations,
}: KomachiLocaleProviderProps) {
  const value = useMemo<KomachiTranslations>(
    () => ({
      layerDialog: {
        ...defaultTranslations.layerDialog,
        ...translations?.layerDialog,
      },
    }),
    [translations],
  );

  return (
    <KomachiLocaleContext.Provider value={value}>
      {children}
    </KomachiLocaleContext.Provider>
  );
}

/** @internal Used by Komachi components to resolve translated built-in copy. */
export function useKomachiLocale(): KomachiTranslations {
  return useContext(KomachiLocaleContext);
}
