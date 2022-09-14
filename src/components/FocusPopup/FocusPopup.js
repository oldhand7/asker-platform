import classNames from 'classnames';
import next from 'next';
import { useEffect, useRef, memo } from 'react';
import { render } from 'react-dom';

import styles from './FocusPopup.module.scss';

const FocusPopup = ({ className, children = null, active = false, onCancel, render: render1, position = 'br' }) => {
    const targetRef = useRef();
    const poupRef = useRef();

    useEffect(() => {
        if (active) {
            document.body.classList.add('modal')
            
            const div = document.createElement('div');

            div.style.background = 'rgba(0, 0, 0, 0.3)'
            div.style.position = 'fixed';
            div.style.zIndex = '9999999999';
            div.style.height = '100vh';
            div.style.width = '100vw';
            div.style.top = '0';
            div.style.left = '0';

            document.body.appendChild(div);

            const { current } = targetRef;

            let clone;

            const adjustCloneStyle = () => {
                if (clone && current) {
                    const viewportRel = current.getBoundingClientRect()

                    clone.style.top = viewportRel.top + 'px';
                    clone.style.left = viewportRel.left + 'px';
                    clone.style.position = 'fixed';
                    clone.style.width = viewportRel.clientWidth + 'px';
                    clone.style.height = viewportRel.clientHeight + 'px';
                    clone.style.zIndex = '99999999999';
                }
            }

            const adjustPopupStyle = () => {
                if (poupRef.current && current) {
                    const viewportRel = current.getBoundingClientRect()

                    const hw = viewportRel.width / 2;
                    const hh = viewportRel.height / 2;

                    if (position == 'tl') {
                        poupRef.current.style.top = (viewportRel.top - 10) + 'px';
                        poupRef.current.style.left = viewportRel.left + 'px';
                        poupRef.current.style.fontSize = hw + 'px';
                    }

                    if (position == 'tc') {
                        poupRef.current.style.top = (viewportRel.top - 10) + 'px';
                        poupRef.current.style.left = viewportRel.left + hw + 'px';
                    }

                    if (position == 'tr') {
                        poupRef.current.style.top = (viewportRel.top - 10) + 'px';
                        poupRef.current.style.left = viewportRel.right + 'px';
                        poupRef.current.style.fontSize = hw + 'px';
                    }

                    if (position == 'rt') {
                        poupRef.current.style.top = viewportRel.top + 'px';
                        poupRef.current.style.left = viewportRel.right + 10 + 'px';
                        poupRef.current.style.fontSize = hh + 'px';
                    }

                    if (position == 'rc') {
                        poupRef.current.style.top = viewportRel.top + hh + 'px';
                        poupRef.current.style.left = viewportRel.right + 10 + 'px';
                    }

                    if (position == 'rb') {
                        poupRef.current.style.top = viewportRel.bottom + 'px';
                        poupRef.current.style.left = viewportRel.right + 10 + 'px';
                        poupRef.current.style.fontSize = hh + 'px';
                    }

                    if (position == 'br') {
                        poupRef.current.style.top = viewportRel.bottom + 10 + 'px';
                        poupRef.current.style.left = viewportRel.right + 'px';
                        poupRef.current.style.fontSize = hw + 'px';
                    }

                    if (position == 'bc') {
                        poupRef.current.style.top = viewportRel.bottom + 10 + 'px';
                        poupRef.current.style.left = viewportRel.left + hw + 'px';
                        poupRef.current.style.fontSize = hw + 'px';
                    }

                    if (position == 'bl') {
                        poupRef.current.style.top = viewportRel.bottom + 10 + 'px';
                        poupRef.current.style.left = viewportRel.left + 'px';
                        poupRef.current.style.fontSize = hw + 'px';
                    }

                    if (position == 'lb') {
                        poupRef.current.style.top = viewportRel.bottom + 'px';
                        poupRef.current.style.left = viewportRel.left -10 + 'px';
                        poupRef.current.style.fontSize = hh + 'px';
                    }

                    if (position == 'lc') {
                        poupRef.current.style.top = viewportRel.top + hh + 'px';
                        poupRef.current.style.left = viewportRel.left -10 + 'px';
                    }

                    if (position == 'lt') {
                        poupRef.current.style.top = viewportRel.top + 'px';
                        poupRef.current.style.left = viewportRel.left - 10 + 'px';
                    }
                }
            }

            if (current) {
                clone = current.cloneNode(true)

                document.body.appendChild(clone);

                adjustCloneStyle();
                adjustPopupStyle();

                window.addEventListener('resize', adjustCloneStyle)
            }

            render(<div onClick={ev => ev.stopPropagation()} id='focus-popup' ref={poupRef} className={classNames(
                styles['focus-popup'],
                styles[`focus-popup-${position}`]
            )}><div className={styles['focus-popup-inner']}>{render1 ? render1() : ''}</div></div>, div)

            setTimeout(() => {
                adjustPopupStyle();
            }, 0)

            document.body.addEventListener('click', ev => {
                onCancel && onCancel()
            });

            window.addEventListener('resize', () => {
                adjustCloneStyle()
                adjustPopupStyle()
            })

            const cleanup = () => {
                if (div) {
                    div.remove();
                }

                if (clone) {
                    clone.remove();
                }

                window.removeEventListener('resize', adjustCloneStyle)
            }

            return cleanup;
        }
    }, [active, onCancel, position, render1])
    
    return children(targetRef)
}

export default memo(FocusPopup)