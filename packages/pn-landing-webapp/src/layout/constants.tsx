/**
 * Do we need to show languages traslated depending on the currently selected one
 * or show each one in its own native translation?
 */
export const LANGUAGES = {
  // each language will be translated depending on the currently selected one
  // it: { it: 'Italiano', en: 'Inglese', fr: 'Francese', de: 'Tedesco', sl: 'Sloveno' },
  // en: { it: 'Italian', en: 'English', fr: 'French', de: 'German', sl: 'Slovenian' },
  // fr: { it: 'Italien', en: 'Anglais', fr: 'Français', de: 'Allemand', sl: 'Slovène' },
  // de: { it: 'Italienisch', en: 'Englisch', fr: 'Französisch', de: 'Deutsch', sl: 'Slowenisch' },
  // sl: { it: 'Italijansko', en: 'Angleško', fr: 'Francosko', de: 'Nemško', sl: 'Slovensko' },
  // each language will be shown in its native form
  it: { it: 'Italiano', en: 'English', fr: 'Français', de: 'Deutsch', sl: 'Slovensko' },
  en: { it: 'Italiano', en: 'English', fr: 'Français', de: 'Deutsch', sl: 'Slovensko' },
  fr: { it: 'Italiano', en: 'English', fr: 'Français', de: 'Deutsch', sl: 'Slovensko' },
  de: { it: 'Italiano', en: 'English', fr: 'Français', de: 'Deutsch', sl: 'Slovensko' },
  sl: { it: 'Italiano', en: 'English', fr: 'Français', de: 'Deutsch', sl: 'Slovensko' },
};