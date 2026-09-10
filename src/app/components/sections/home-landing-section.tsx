import type { CSSProperties, ReactNode } from 'react';
import LandingReveal from '@/app/components/effects/landing-reveal';

type SplitToken = {
  accent?: boolean;
  accentPart?: string;
  text: string;
};

type SplitHeadingProps = {
  as: `h1` | `h2`;
  className: string;
  hero?: boolean;
  id?: string;
  lines: SplitToken[][];
  reveal?: boolean;
};

type StudioPixelsProps = {
  compact?: boolean;
  round?: boolean;
  tone?: `blue` | `navy`;
  position: `TopLeft` | `TopRight` | `BottomLeft` | `BottomRight`;
};

export const StudioPixels = ({ compact = false, position, round = false, tone = `blue` }: StudioPixelsProps) => (
  <span
    data-tone={tone}
    aria-hidden={`true`}
    className={`landingStudioPixels landingStudioPixels${position}${compact ? ` landingStudioPixelsCompact` : ``}${round ? ` landingStudioPixelsRound` : ``}`}
  >
    {Array.from({ length: 13 }, (_, index) => <i key={index} />)}
  </span>
);

export function SplitHeading({ as, className, hero = false, id, lines, reveal = false }: SplitHeadingProps) {
  const Heading = as;
  let splitIndex = 0;

  return (
    <Heading
      id={id}
      className={className}
      aria-label={lines.map(line => line.map(token => token.text).join(` `).replace(/\s+([.?])/g, `$1`)).join(` `)}
      data-landing-hero={hero ? `true` : undefined}
      data-landing-reveal={reveal ? `true` : undefined}
    >
      {lines.map((line, lineIndex) => (
        <span className={`landingSplitLine`} aria-hidden={`true`} key={`line-${lineIndex}`}>
          {line.map((token, tokenIndex) => {
            const index = splitIndex++;
            return (
              <span
                className={`landingSplitWord ${token.accent ? `landingTitleAccent` : ``} ${token.text == `.` || token.text == `?` ? `landingSplitTight` : ``}`}
                key={`${token.text}-${tokenIndex}`}
                style={{ '--split-index': index } as CSSProperties}
              >
                {token.accentPart ? (
                  <>
                    {token.text.slice(0, token.text.indexOf(token.accentPart))}
                    <span className={`landingTitleAccent`}>{token.accentPart}</span>
                    {token.text.slice(token.text.indexOf(token.accentPart) + token.accentPart.length)}
                  </>
                ) : token.text}
              </span>
            );
          })}
        </span>
      ))}
    </Heading>
  );
}

export default function HomeLandingSection({ children }: { children: ReactNode }) {
  return (
    <div className={`piratechsLanding landingMotionPending`} data-piratechs-landing>
      <LandingReveal />
      <noscript>
        <style>{`.landingMotionPending [data-landing-reveal],.landingMotionPending .landingSplitWord{opacity:1!important;filter:none!important;transform:none!important}`}</style>
      </noscript>
      {children}
    </div>
  );
}
