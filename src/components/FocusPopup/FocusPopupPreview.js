import { useState } from "react";
import FocusPopup from "./FocusPopup";

import styles from './FocusPopupPreview.module.scss';

const FocusPopupPreview = () => {
    const [active, setActive] = useState(null);

    return <div className={styles['focus-popup-preview']}>
        <FocusPopup render={() => 'tl'} onCancel={() => setActive(null)} active={active == 'tl'} position="tl">{ref => <button onClick={() => setActive('tl')} ref={ref}>top left</button>}</FocusPopup>
        <FocusPopup render={() => 'tc'} onCancel={() => setActive(null)} active={active == 'tc'} position="tc">{ref => <button onClick={() => setActive('tc')} ref={ref}>top center</button>}</FocusPopup>
        <FocusPopup render={() => 'tr'} onCancel={() => setActive(null)} active={active == 'tr'} position="tr">{ref => <button onClick={() => setActive('tr')} ref={ref}>top right</button>}</FocusPopup>
        <FocusPopup render={() => 'rt'} onCancel={() => setActive(null)} active={active == 'rt'} position="rt">{ref => <button onClick={() => setActive('rt')} ref={ref}>right top</button>}</FocusPopup>
        <FocusPopup render={() => 'rc'} onCancel={() => setActive(null)} active={active == 'rc'} position="rc">{ref => <button onClick={() => setActive('rc')} ref={ref}>right center</button>}</FocusPopup>
        <FocusPopup render={() => 'rb'} onCancel={() => setActive(null)} active={active == 'rb'} position="rb">{ref => <button onClick={() => setActive('rb')} ref={ref}>right bottom</button>}</FocusPopup>
        <FocusPopup render={() => 'br'} onCancel={() => setActive(null)} active={active == 'br'} position="br">{ref => <button onClick={() => setActive('br')} ref={ref}>bottom right</button>}</FocusPopup>
        <FocusPopup render={() => 'bc'} onCancel={() => setActive(null)} active={active == 'bc'} position="bc">{ref => <button onClick={() => setActive('bc')} ref={ref}>bottom center</button>}</FocusPopup>
        <FocusPopup render={() => 'bl'} onCancel={() => setActive(null)} active={active == 'bl'} position="bl">{ref => <button onClick={() => setActive('bl')} ref={ref}>bottom left</button>}</FocusPopup>
        <FocusPopup render={() => 'lb'} onCancel={() => setActive(null)} active={active == 'lb'} position="lb">{ref => <button onClick={() => setActive('lb')} ref={ref}>left bottom</button>}</FocusPopup>
        <FocusPopup render={() => 'lc'} onCancel={() => setActive(null)} active={active == 'lc'} position="lc">{ref => <button onClick={() => setActive('lc')} ref={ref}>left center</button>}</FocusPopup>
        <FocusPopup render={() => 'lt'} onCancel={() => setActive(null)} active={active == 'lt'} position="lt">{ref => <button onClick={() => setActive('lt')} ref={ref}>left top</button>}</FocusPopup>
    </div>
}

export default FocusPopupPreview;