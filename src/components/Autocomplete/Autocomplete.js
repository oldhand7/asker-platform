import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useRef } from 'react';
import LiveSearchWidget from 'components/LiveSearchWidget/LiveSearchWidget';
import striptags from 'striptags'
import styles from './Autocomplete.module.scss';

const AutocompleteOptions = ({ options, index, className, onChoice }) => {
  const optionProps = (option, optionIndex) => {
    const className = classNames(
      styles['autocomplete-options-item'],
      optionIndex === index ? styles['autocomplete-options-item-active'] : ''
    )

    return {
      onClick: () => onChoice && onChoice(option),
      className
    }
  }

  return <ul className={styles['autocomplete-options']}>
  {
    options.length ?
    options.map((option, index) => <li data-test-id="autocomplete-option" key={index} {...optionProps(option, index)}>
      <span className={styles['autocomplete-options-item-name']}>{option.name}</span>
      {option.desc ? <div className={styles['autocomplete-options-item-desc']} dangerouslySetInnerHTML={{ __html: striptags(option.desc)}}></div> : null}
    </li>) :
    <li key="no-options-warn" className={classNames(styles['autocomplete-options-item'], styles['autocomplete-options-item-warning'])}>No results.</li>
  }
  </ul>
}

const Autocomplete = ({ onSearch, className, options = [] }) => {
  const [filteredOptions, setOptions] = useState(options)
  const [focusIndex, setFocusIndex] = useState(0);
  const [q, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const ref = useRef();

  useEffect(() => {
    if (!open) {
      return;
    }

    if (filteredOptions.length) {
      const keyboardHandler = (ev) => {
        if (ev.key == 'ArrowUp' || ev.key == 'Up' ) {
          ev.preventDefault();

          if (focusIndex > 0) {
            setFocusIndex(focusIndex - 1);
          }
        }

        if (ev.key == 'ArrowDown' || ev.key == 'Down' ) {
          ev.preventDefault();

            if (focusIndex + 1 < filteredOptions.length) {
              setFocusIndex(focusIndex + 1)
            }
        }
      }

      const enterHandler = (ev) => {
        if (ev.code == "Enter" || ev.code == "NumpadEnter") {
          ev.preventDefault();

          handleChoice(
            filteredOptions[focusIndex] ?
            filteredOptions[focusIndex] :
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
  }, [open, focusIndex, filteredOptions])


  useEffect(() => {
    const keyboardHandler = (ev) => {
      if (ev.code == "Escape") {
        ev.preventDefault();

        setOpen(false)
        setQuery('');
      }
    }

    document.addEventListener('keyup', keyboardHandler);

    return () => {
      document.removeEventListener('keyup', keyboardHandler);
    }
  }, [])

  const handleChoice = option => {
    setQuery('');
    setOpen(false);
    onSearch(option)
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleOffClick = ev => {
      if (ref && ref.current && ev.target != ref.current && !ref.current.contains(ev.target)) {
        setQuery('');
        setOpen(false)
      }
    }

    document.body.addEventListener('click', handleOffClick, true)

    return () => {
      document.body.removeEventListener('click', handleOffClick, true)
    }
  }, [open])

  useEffect(() => {
    const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

    setOptions(options.filter(o => {
      const nameFilter = regex.test(o.name.toLowerCase());
      const descFilter = o.desc && regex.test(o.desc.toLowerCase());

      return nameFilter || descFilter;
    }))
  }, [q, options])

  const handleQuery = (q) => {
    setQuery(q)
    setOpen(true)
  }

  return <div ref={ref} className={classNames(styles['autocomplete'], className)}>
      <LiveSearchWidget onFocus={() => setOpen(true)} q={q} onQuery={handleQuery} className={styles['autocomplete-search']} />
      {open ? <AutocompleteOptions onChoice={handleChoice} index={focusIndex} options={filteredOptions} /> : null}
  </div>
}

export default Autocomplete;
