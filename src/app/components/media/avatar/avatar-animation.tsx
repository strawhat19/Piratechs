'use client';

import Avatar from './avatar';
import { useId } from 'react';
import type { CSSProperties } from 'react';
import ElementReveal from '../../effects/element-reveal';

type AvatarAnimationProps = {
    text?: string;
    html?: boolean;
    size?: number;
    bottomIn?: boolean;
    bottomOut?: boolean;
    className?: string;
    rotationSpeed?: number;
    textDirection?: boolean;
    textOrientation?: boolean;
};

const arcPaths = {
    topOut: `M 189.5 22 A 167.5 167.5 0 1 1 189.5 357 A 167.5 167.5 0 1 1 189.5 22`,
    topIn: `M 189.5 22 A 167.5 167.5 0 1 0 189.5 357 A 167.5 167.5 0 1 0 189.5 22`,
    bottomOut: `M 189.5 357 A 167.5 167.5 0 1 1 189.5 22 A 167.5 167.5 0 1 1 189.5 357`,
    bottomIn: `M 189.5 357 A 167.5 167.5 0 1 0 189.5 22 A 167.5 167.5 0 1 0 189.5 357`,
};

export default function AvatarAnimation({
    text = ``,
    size = 150,
    html = false,
    bottomIn = false,
    bottomOut = false,
    rotationSpeed = 20,
    textDirection = true,
    textOrientation = false,
    className = `avatarAnimationComponent`,
}: AvatarAnimationProps) {
    const arcPathID = `avatar-text-arc-${useId().replaceAll(`:`, ``)}`;
    const arcPosition = bottomIn ? `bottomIn` : bottomOut ? `bottomOut` : textOrientation ? `topIn` : `topOut`;

    return <>
        <ElementReveal as={`div`} className={`${className} avatarAnimationContainer`}>
            <Avatar size={size}>
                <figure className={`ceoHeadshotWrapper`}>
                    <div className={`ceoHeadshotWrapperOverlay`} />
                    <img className={`ceoHeadshot`} style={{ maxWidth: size, maxHeight: size }} alt={`Rakib`} src={`/assets/teams/developers/rakib/Rakib_Headshot.jpeg`} />
                </figure>
                {text ? (
                    <span className={`avatarArcTextWrap`} style={{ width: size * 1.28, height: size * 1.28 }} aria-hidden={`true`}>
                        <svg
                            viewBox={`0 0 379 379`}
                            className={`avatarArcTextSvg ${textDirection ? `clockwise` : `counterClockwise`}`}
                            style={{ '--avatarArcRotationSpeed': `${Math.max(0.1, rotationSpeed)}s` } as CSSProperties}
                        >
                            <defs>
                                <path id={arcPathID} d={arcPaths[arcPosition]} />
                            </defs>
                            <text className={`avatarArcText logoLetter`}>
                                <textPath
                                    href={`#${arcPathID}`}
                                    startOffset={`50%`}
                                    textAnchor={`middle`}
                                    {...(html ? { dangerouslySetInnerHTML: { __html: text } } : { children: text })}
                                />
                            </text>
                        </svg>
                    </span>
                ) : null}
            </Avatar>
        </ElementReveal>
    </>
}
