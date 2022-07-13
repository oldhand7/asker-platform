import classNames from 'classnames';
import { Range, getTrackBackground } from 'react-range';
import striptags from 'striptags';
import { allowedHtmlTags } from 'libs/config';

import styles from './range-question-int-form.module.scss'

const RangeQuestionIntForm = ({ className, question, values, onValues }) => {
  const vor = () => values || [
    question.min,
    Math.min(Math.round(question.max / 2), question.max)
  ]

  return <div className={classNames(styles['range-question-int-form'], className)}>
  <h3 className={styles['range-question-int-form-title']}>{question.name}</h3>
  <div className={styles['range-question-int-form-desc']}
  dangerouslySetInnerHTML={{ __html: striptags(question.desc, allowedHtmlTags) }}></div>


    <div className={styles['range-question-int-form-slider']}>
      <Range
        step={Number.parseInt(question.step)}
        min={Number.parseInt(question.min)}
        max={Number.parseInt(question.max)}
        state={ { values: vor() }}
        values={vor()}
        onChange={onValues}
        renderTrack={({ props, children }) => (
         <div
           {...props}
           style={{
             ...props.style,
             background: getTrackBackground({
                  values: values || vor(),
                  colors: ['#B7B7B733', '#43B88C', '#B7B7B733'],
                  min: question.min,
                  max: question.max
                })

           }}
           className={styles['range-question-int-form-slider-track']}
         >
           {children}
         </div>
       )}
       renderThumb={({ props }) => {
         return <div
           {...props}
           style={{
             ...props.style
           }}
           className={styles['range-question-int-form-slider-marker']}
         >
         <span className={styles['range-question-int-form-slider-marker-value']}>{vor()[props.key]} {question.unit}</span></div>
       }}
        />
    </div>
  </div>
}

export default RangeQuestionIntForm;
