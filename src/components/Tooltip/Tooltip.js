import { usePopperTooltip } from 'react-popper-tooltip';
import styles from './Tooltip.module.scss';

const Tooltip = ({ children, text = '???', delay = 500 }) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    placement: 'bottom',
    delayShow: delay
  });

  return <>{children(setTriggerRef)}{visible && (
       <div
         ref={setTooltipRef}
         {...getTooltipProps({ className: 'tooltip-container' })}
       >{text}<div {...getArrowProps({ className: 'tooltip-arrow' })} />
       </div>
     )}</>
}

export default Tooltip;
