/** The reader's current language, for small shared parts that are not handed a locale. */
import { createContext } from 'react';

export const LocaleContext = createContext('en');
