import classNames from "classnames"

import styles from './QuestionExplorerOption.module.scss';

const QuestionExplorerOption = ({ className, active = false, children , ...props }) => {
    return <button type="button" {...props} className={classNames(
        styles['question-explorer-option'],
        active ? styles['question-explorer-option-active'] : '',
        className
    )}>{children || text}</button>
}

export default QuestionExplorerOption;