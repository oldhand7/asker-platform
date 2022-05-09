import classNames from 'classnames';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import BIcon from 'components/Icon/BIcon';
import ListIcon from 'components/Icon/ListIcon';
import NumListIcon from 'components/Icon/NumListIcon';
import dynamic from 'next/dynamic';

import styles from './HtmlInputField.module.scss';

const Editor = dynamic(
  () => import('jodit-react'),
  { ssr: false }
)

const HtmlInputField = ({ error, value = '', onChange, className, placeholder, focus = false }) => {
  const editor = useRef(null)
  const [content, setContent] = useState(value)

  const config = useMemo(() => ({
    readonly: false,
    placeholder: placeholder || 'Start typing...',
    buttons: ['bold', 'ul', 'ol'],
    toolbarAdaptive: false,
    editorCssClass: styles['html-input-field-input'],
    "showCharsCounter": false,
    "showWordsCounter": false,
    "showXPathInStatusbar": false,
    theme: 'custom',
    mode: 'vertical',
    minHeight: '0',
    toolbarSticky: false,
     controls: {
            ul: {
                list: false
            },
            ol: {
                list: false
            }
        }
  }), [placeholder])

  useEffect(() => {
    if (value != content) {
      onChange(content)
    }
  }, [value, content, onChange])

  return <div data-test-id="html-input-field" className={classNames(styles['html-input-field'], className)}>
      <Editor
              ref={editor}
              value={value}
              config={config}
              tabIndex={1}
              onChange={setContent}
            />

    {error ? <p className="form-error">{error}</p> : null}
  </div>
}

export default HtmlInputField;
