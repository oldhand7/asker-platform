import { usePopperTooltip } from 'react-popper-tooltip';

import styles from './Tooltip.module.scss';

const Tooltip = ({ children, text = '???' }) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    placement: 'bottom-end',
    delayShow: 500
  });

  return <><span className={styles['tooltip']} ref={setTriggerRef}>
    {children}
  </span>{visible && (
       <div
         ref={setTooltipRef}
         {...getTooltipProps({ className: 'tooltip-container' })}
       >{text}<div {...getArrowProps({ className: 'tooltip-arrow' })} />
       </div>
     )}</>
}

export default Tooltip;
