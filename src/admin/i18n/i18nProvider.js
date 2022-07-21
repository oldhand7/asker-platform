import swedishMessages from '@kolben/ra-language-swedish';
import englishMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

const messages = {
    'en': englishMessages,
    'se': swedishMessages
};

const Polygloti18nProvider = polyglotI18nProvider(locale => messages[locale]);

const TransProvider = (_locale = 'en', translations = {}) => {
    let locale = _locale;

    Polygloti18nProvider.changeLocale(_locale)

    const changeLocale = (_locale) => {
        locale = _locale

        return Polygloti18nProvider.changeLocale(_locale)
    };

    const getLocale = () => locale;

    const translate = (key, options) => {
        const trans = translations[key] && translations[key][locale]

        return trans || Polygloti18nProvider.translate(key, options);
    }

    return {
        translate,
        changeLocale,
        getLocale
    }
}

export default TransProvider;