import { useState, useEffect } from 'react';
import SearchWidget from 'components/SearchWidget/SearchWidget';
import classNames from 'classnames';

import styles from './Autocomplete.module.scss';

//@TODO: should open selections on focus
const Autocomplete = ({ onQuery, onSearch, className }) => {
  const [options, setOptions] = useState([])
  const [focusIndex, setFocusIndex] = useState(0);
  const [q, setQuery] = useState('');

  const handleQuery = q => {
    setQuery(q);
    onQuery(q).then(setOptions)
  }

  useEffect(() => {
    if (options.length) {
      const keyboardHandler = (ev) => {
        if (ev.key == 'ArrowUp' || ev.key == 'Up' ) {
          ev.preventDefault();

          if (focusIndex > 0) {
            setFocusIndex(focusIndex - 1);
          }
        }

        if (ev.key == 'ArrowDown' || ev.key == 'Down' ) {
          ev.preventDefault();

            if (focusIndex + 1 < options.length) {
              setFocusIndex(focusIndex + 1)
            }
        }
      }

      const enterHandler = (ev) => {
        if (ev.code == "Enter" || ev.code == "NumpadEnter") {
          ev.preventDefault();

          handleChoice(
            options[focusIndex] ?
            options[focusIndex] :
            null
          )
        }
      }

      document.addEventListener('keyup', keyboardHandler);
      document.addEventListener('keydown', enterHandler);

      return () => {
        document.removeEventListener('keyup', keyboardHandler);
        document.removeEventListener('keydown', enterHandler);
      }
    }
  }, [focusIndex, options])

  const handleChoice = option => {
    onSearch(option, q)
    setOptions([])
    setQuery('');
  }

  return <div className={classNames(styles['autocomplete'], className)}>
      <SearchWidget value={q} onQueryValue={handleQuery} className={styles['autocomplete-search']} />

      {q ? <ul className={styles['autocomplete-options']}>
        {
          options.length ?
          options.map((option, index) => <li onClick={() => handleChoice(option)} key={option.id} className={classNames(styles['autocomplete-options-item'], focusIndex === index ? styles['autocomplete-options-item-active'] : '')}>{option.name}</li>) :
          <li key="no-options-warn" className={classNames(styles['autocomplete-options-item'], styles['autocomplete-options-item-warning'])}>No results.</li>
        }
      </ul> : null}
  </div>
}

export default Autocomplete;
