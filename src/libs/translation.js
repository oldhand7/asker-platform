import { useRouter } from 'next/router'
import { useCallback } from 'react'
import enDict from 'translation/en.json'
import dict from 'translation/dictionary.json'

export const useTranslation = () => {
  const { locale } = useRouter()

  const i18nField = useCallback((field) => {
      const isObject = field && typeof field === "object";

      if (isObject && locale == "en") {
        let fieldSE = typeof field['se'] !== "undefined" ? field['se'] : '';

        if (typeof field['en'] !== "undefined") return field['en'] === '' ? fieldSE : field['en'];
        if (typeof field['se'] !== "undefined") return fieldSE;
      }

      if (isObject && locale == "se") {
        let fieldEN = typeof field['en'] !== "undefined" ? field['en'] : '';

        if (typeof field['se'] !== "undefined") return field['se'] === '' ? fieldEN : field['se'];
        if (typeof field['en'] !== "undefined") return fieldEN;
      }

      return isObject ? '' : field;
  }, [locale])

  const translate = useCallback((w) => {
    if (typeof dict[w] !== "undefined") {
      if (typeof dict[w][locale] !== "undefined") {
        return dict[w][locale];
      }

      if (typeof dict[w]['en'] !== "undefined") {
        return dict[w]['en'];
      }
    }

    return typeof enDict[w] !== "undefined" ? enDict[w] : w;
  }, [locale])

  return {
    translate,
    t: translate,
    i18nField
  }
}