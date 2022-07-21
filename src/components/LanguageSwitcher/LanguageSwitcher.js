import classNames from 'classnames';
import CarretDown from 'components/Icon/CarretDownIcon';
import { useSite } from 'libs/site';
import { useUser } from 'libs/user';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import styles from './LanguageSwitcher.module.scss';

const defaultLanguages = [
    { id: 'en', name: 'English', icon: null, emoji: '🇬🇧' },
    { id: 'se', name: 'Sweedish', icon: null, emoji: '🇸🇪' },
]

const LanguageSwitcherItem = ({ language }) => (
    <div
        data-language-id={language.id}
        className={styles['language-switcher-item']}
        title={language.name}>
            <span className={styles['language-switcher-item-emoji']}>{language.emoji}</span>
            <span className={styles['language-switcher-item-text']}>{language.id}</span>
        </div>
)

const LanguageSwitcher = ({ className, language = 'en', languages = defaultLanguages}) => {
    const {config, t} = useSite();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const ref = useRef();
    const { storeUserLocale }  = useUser();

    const [locale, setLocale] = useState(router.locale)


    useEffect(() => {
        setLocale(router.locale)
    }, [router])

    const toggleOpen = () => {
        setOpen(!open)
    }

    useEffect(() => {
        if (open) {
            const handleClickOutside = (ev) => {
                if (ref.current && !ref.current.contains(ev.target)) {
                    setOpen(false);
                }
            }

            document.addEventListener('click', handleClickOutside, true);

            return () => {
                document.removeEventListener('click', handleClickOutside, true);
            }
        }
    }, [open])

    const changeLanguage = async lang => {
        setLocale(lang.id)
        setOpen(false);
        await storeUserLocale(lang.id)
        router.push( router.asPath, null, { locale: lang.id })
    }

    const currentLanguage = languages.find(lang => lang.id == locale);

    return <div data-test-id="language-switcher" ref={ref} data-language-id={locale} className={classNames(
        styles['language-switcher'],
        open ? styles['language-switcher-open'] : '',
        className
    )}>
        <div onClick={toggleOpen} className={styles['language-switcher-head']}>
            <LanguageSwitcherItem language={currentLanguage} />
            <CarretDown className={styles['language-switcher-head-carret']} />
        </div>

        <ul className={styles['language-switcher-options']}>
            {languages.filter(lang => lang != currentLanguage).map(lang => (
            <li onClick={() => changeLanguage(lang)} key={lang.id}>
                <LanguageSwitcherItem language={lang} />
            </li>))}
        </ul>
    </div>
}

export default LanguageSwitcher;