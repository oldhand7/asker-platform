import {Editor, EditorState, RichUtils, Modifier, ContentState, convertFromHTML } from 'draft-js';
import classNames from 'classnames';
import { useEffect, useState, useRef } from 'react';
import BIcon from 'components/Icon/BIcon';
import ListIcon from 'components/Icon/ListIcon';
import NumListIcon from 'components/Icon/NumListIcon';
import './react-draftjs-fix'
import {stateToHTML} from 'draft-js-export-html';

import styles from './HtmlInputField.module.scss';

const HtmlInputField = ({ error, value, onChange, className, placeholder, focus = false }) => {
  const [editorState, setEditorState] = useState(EditorState.createWithContent(
    ContentState.createFromBlockArray(convertFromHTML(value || ''))
  ));

  const editor = useRef();

  useEffect(() => {
    if (editor && editor.current && focus) {
      editor.current.focus()
    }
  }, [editor, focus])

  useEffect(() => {
    if (editor && editor.current) {
      editor.current.editorContainer.closest('.DraftEditor-root')
      .classList.add(styles['html-input-field-input'])

      editor.current.editorContainer.classList.add(styles['html-input-field-input-editor-container'])
      editor.current.editor.classList.add(styles['html-input-field-input-editor'])
    }
  }, [editor])

  useEffect(() => {
    onChange(stateToHTML(editorState.getCurrentContent()))
  }, [editorState])

  const toggleBold = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))
  }

  const toggleList = () => {
    setEditorState(RichUtils.toggleBlockType(editorState, 'unordered-list-item'))
  }

  const toggleNumList = () => {
    setEditorState(RichUtils.toggleBlockType(editorState, 'ordered-list-item'))
  }

  return <div className={classNames(styles['html-input-field'], className)}>
    <>
    <Editor editorState={editorState} ref={(element) => {
          editor.current = element;
        }} placeholder={placeholder} editorState={editorState}
        onChange={setEditorState}
        placeholderClassName={styles['html-input-field-input-placeholder']}
         />
         </>
    <div className={styles['html-input-field-toolbar']}>
      <button type="button" className={styles['html-input-field-toolbar-button']} onMouseDown={toggleBold}>
        <BIcon className={styles['html-input-field-toolbar-button-icon']} />
      </button>
      <button type="button" className={styles['html-input-field-toolbar-button']} onMouseDown={toggleList}>
        <ListIcon className={styles['html-input-field-toolbar-button-icon']} />
      </button>
      <button type="button" className={styles['html-input-field-toolbar-button']} onMouseDown={toggleNumList}>
        <NumListIcon className={styles['html-input-field-toolbar-button-icon']} />
      </button>
    </div>
    {error ? <p className="form-error">{error}</p> : null}
  </div>
}

export default HtmlInputField;
