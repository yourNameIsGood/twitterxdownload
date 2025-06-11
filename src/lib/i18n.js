import enLocales from '../locales/en.json';
import cnLocales from '../locales/cn.json';
import hkLocales from '../locales/hk.json';
import jaLocales from '../locales/ja.json';
import koLocales from '../locales/ko.json';
import esLocales from '../locales/es.json';
import ptLocales from '../locales/pt.json';
import itLocales from '../locales/it.json';
import frLocales from '../locales/fr.json';
import deLocales from '../locales/de.json';
import thLocales from '../locales/th.json';
import trLocales from '../locales/tr.json';

export const locales = {
  "en": {
    name: "English",
    locales: enLocales
  },
  "zh-CN": {
    name: "简体中文",
    locales: cnLocales
  },
  "zh-HK": {
    name: "繁體中文",
    locales: hkLocales
  },
  "ja": {
    name: "日本語",
    locales: jaLocales
  },
  "ko": {
    name: "한국어",
    locales: koLocales
  },
  "es": {
    name: "Español",
    locales: esLocales
  },
  "pt": {
    name: "Português",
    locales: ptLocales
  },
  "it": {
    name: "Italiano",
    locales: itLocales
  },
  "fr": {
    name: "Français",
    locales: frLocales
  },
  "de": {
    name: "Deutsch",
    locales: deLocales
  },
  "th": {
    name: "ไทย",
    locales: thLocales
  },
  "tr": {
    name: "Türkçe",
    locales: trLocales
  }
};

export function getLocale(locale) {
  return locales[locale] || locales.en;
}

export function getTranslation(locale, key) {
  const localeData = getLocale(locale);
  
  // 直接访问键，不再使用 split
  const result = localeData.locales[key];
  
  if (result === undefined) {
    console.log(`Translation not found for key: ${key} in locale: ${locale}`);
    return key;
  }
  return result;
}

