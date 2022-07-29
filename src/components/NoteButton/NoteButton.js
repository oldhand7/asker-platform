import NoteIcon from 'components/Icon/NoteIcon';
import classNames from 'classnames';
import IconButton from 'components/IconButton/IconButton';
import { forwardRef} from 'react';

import styles from './NoteButton.module.scss';

const NoteButton = ({ className, ...props }, ref) => (
  <IconButton type="button" ref={ref} data-test-id="note-button" className={classNames(styles['note-button'], className)} Icon={NoteIcon} {...props}/>
)

export default forwardRef(NoteButton);
