const { default: TimeLabel } = require("./TimeLabel")

const TimeLabelPreview = () => {
    return <div>
        <TimeLabel>-</TimeLabel>
        <TimeLabel time={99} />
        <TimeLabel label='Time remainin' time={5} />
    </div>
}

export default TimeLabelPreview;