import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import ru from './locales/ru.json';

const LANGUAGE_STORAGE_KEY = 'language';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ru: { translation: ru } },
  lng: 'ru',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export async function loadStoredLanguage(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && stored !== i18n.language) {
      await i18n.changeLanguage(stored);
    }
  } catch {
    // Keep the default language when storage is unavailable.
  }
}

export async function setAppLanguage(language: string): Promise<void> {
  await i18n.changeLanguage(language);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export default i18n;
