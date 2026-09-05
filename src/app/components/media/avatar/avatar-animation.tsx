'use client';

import gsap from 'gsap';
import Avatar from './avatar';
import ElementReveal from '../../effects/element-reveal';
import { useEffect, useId, useRef, type CSSProperties } from 'react';

type AvatarAnimationProps = {
    text?: string;
    size?: number;
    html?: boolean;
    reveal?: boolean;
    className?: string;
    bottomIn?: boolean;
    bottomOut?: boolean;
    rotationSpeed?: number;
    avatarUserName?: string;
    avatarImageSrc?: string;
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
    reveal = true,
    bottomIn = false,
    bottomOut = false,
    rotationSpeed = 20,
    textDirection = true,
    textOrientation = false,
    className = `avatarAnimationComponent`,
}: AvatarAnimationProps) {
    const arcTextRef = useRef<SVGSVGElement>(null);
    const arcPathID = `avatar-text-arc-${useId().replaceAll(`:`, ``)}`;
    const arcPosition = bottomIn ? `bottomIn` : bottomOut ? `bottomOut` : textOrientation ? `topIn` : `topOut`;

    useEffect(() => {
        const arcText = arcTextRef.current;
        if (!arcText || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) return;

        const rotationAnimation = arcText.getAnimations()?.[0];
        if (!rotationAnimation) return;

        let lastScrollY = window.scrollY;
        let activeDirection = 1;
        const playback = { rate: 1 };
        const onScroll = () => {
            const nextScrollY = window.scrollY;
            const scrollDelta = nextScrollY - lastScrollY;
            lastScrollY = nextScrollY;
            if (Math.abs(scrollDelta) < 2) return;

            const nextDirection = scrollDelta > 0 ? 1 : -1;
            if (nextDirection == activeDirection) return;
            activeDirection = nextDirection;
            gsap.to(playback, {
                rate: nextDirection,
                ease: `power2.out`,
                duration: 0.32,
                overwrite: true,
                onUpdate: () => rotationAnimation.updatePlaybackRate(playback.rate),
            });
        };

        window.addEventListener(`scroll`, onScroll, { passive: true });
        return () => {
            gsap.killTweensOf(playback);
            window.removeEventListener(`scroll`, onScroll);
        };
    }, []);

    const avatar = (
        <Avatar size={size}>
            <figure className={`ceoHeadshotWrapper`}>
                <div className={`ceoHeadshotWrapperOverlay`} />
                <img className={`ceoHeadshot`} style={{ maxWidth: size, maxHeight: size }} alt={`Rakib`} src={`/assets/teams/developers/rakib/waterfall.jpg`} />
            </figure>
            {text ? (
                <span className={`avatarArcTextWrap`} style={{ width: size * 1.28, height: size * 1.28 }} aria-hidden={`true`}>
                    <svg
                        ref={arcTextRef}
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
    );

    return reveal ? (
        <ElementReveal as={`div`} className={`${className} avatarAnimationContainer`}>
            {avatar}
        </ElementReveal>
    ) : (
        <div className={`${className} avatarAnimationContainer`}>
            {avatar}
        </div>
    );
}
