import { allowedHtmlTags } from "libs/config"
import striptags from 'striptags';

const Html = ({ className, children, allowedTags = allowedHtmlTags }) => {
    const dangerousHtml = {
        __html: striptags(children, allowedTags)
    }

    return <div className={className} dangerouslySetInnerHTML={dangerousHtml}></div>
}

export default Html;