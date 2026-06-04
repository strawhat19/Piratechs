import { extractRootDomain } from '@/shared/common/scripts/globals';

export const faviconOverwrites: any = {
    atlassian: `atlassian.com`,
}

export default function URL({ url, label = undefined, image = undefined, className = `tagURLComponent` }: any) {
    let urlParts: any = extractRootDomain(url, undefined, true);
    let domainNameWithPath: any = extractRootDomain(url, true);
    let rootDomain: any = extractRootDomain(url) ?? ``;

    let [host] = urlParts && urlParts?.host && urlParts?.host?.length > 0 ? urlParts?.host?.split(`.`) : ``;
    let pathParts = urlParts?.pathname?.split(`/`) || [];
    let path = pathParts?.pop();

    for (const key in faviconOverwrites) {
        if (rootDomain.includes(key)) {
            rootDomain = faviconOverwrites[key];
            break;
        }
    }

    const favicon = `https://www.google.com/s2/favicons?domain=${rootDomain}`;
    // const favicon = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}`;
    // const parsedUrl = new URL(url.toLowerCase().startsWith(`http`) ? url : `https://${url}`);
    // const domainName = rootDomain.replace(/\.(com|net|org|io|co|gov|edu|us|uk|dev|app|info|biz|me|tv|xyz|ai|ca|in|nl|au|de)$/, ``).replace(/^[a-z]/, c => c.toUpperCase());

    const removeURL = async (e: any, url: any) => {
        // if (itemOrTask != null) {
        //     const itemTaskURLs = itemOrTask?.data?.relatedURLs;
        //     const updatedItemTaskURLs = itemTaskURLs?.filter(ur => ur?.toLowerCase() != url?.toLowerCase());
        //     // await updateDocFieldsWTimeStamp(itemOrTask, { [`data.relatedURLs`]: updatedItemTaskURLs });
        // }
    }

    return (
        <span title={url} className={`url taskTag websiteURL button hoverBright ${className}`} onClick={(e) => removeURL(e, url)}>
            <a
                href={url}
                target={`_blank`}
                rel={`noopener noreferrer`}
                className={`itemURL flexLabel gap5`}
                style={{
                    display: `inline-flex`, alignItems: `center`, gap: 5,
                }}
            >
                {(!image && rootDomain != undefined) ? (
                    <img className={`tagImage`} src={favicon} alt={domainNameWithPath} width={16} height={16} />
                ) : (
                    <img className={`tagImage`} src={image} alt={domainNameWithPath} width={16} height={16} />
                )}
                <span className={`useFont pointerEventsNone`} style={{ fontSize: 10, padding: `1px 5px 0 0` }}>
                    {label ?? host} 
                    {/* <span className={`slashes`}>//</span> {path} */}
                </span>
                {/* <i className={`fas fa-external-link-alt useMainIconColor`} style={{ fontSize: 10 }} /> */}
            </a>
            {/* {itemOrTask != null && (
                <button title={`Remove URL`} className={`urlDeleteBtn`}>
                    <i
                        className={`urlIcon urlDeleteIcon useMainIconColor fas fa-times`}
                        style={{ fontSize: 9, maxHeight: 10.5, maxWidth: `fit-content` }}
                    />
                </button>
            )} */}
        </span>
    )
}