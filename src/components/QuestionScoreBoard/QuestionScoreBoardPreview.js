const { default: QuestionScoreBoard } = require("./QuestionScoreBoard")
import {
    COMPETENCY_RULES_INT
  } from 'libs/scoring-board-rules';
import { useState } from 'react';
import { createDummyVotes } from 'libs/helper';

import styles from './QuestionScoreBoardPreview.module.scss'

const rules = [
    ...COMPETENCY_RULES_INT
]

const QuestionScoreBoardPreview = () => {
    const [votes, onVotes] = useState(createDummyVotes(rules))

    rules[0].steps[0] = 'xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx '
    rules[0].steps[1] = 'y'
    rules[0].steps[2] = 'z'

    rules[2].steps[0] = 'x'
    rules[2].steps[1] = 'yyyy y y y y y y yyyyyyyyyy y y y '
    rules[2].steps[2] = 'z'

    rules[4].steps[0] = 'x'
    rules[4].steps[1] = 'y'
    rules[4].steps[2] = 'z'

    return <div>
        <pre>{JSON.stringify(rules)}</pre>
        <QuestionScoreBoard votes={votes} onVotes={onVotes} className={styles['question-score-board-preview']} rules={rules} />
    </div>
}

export default QuestionScoreBoardPreview;