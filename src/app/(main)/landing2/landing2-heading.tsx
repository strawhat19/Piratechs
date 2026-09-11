import styles from './landing2-motion.module.scss';

type Landing2HeadingProps = {
  id: string;
  delay?: number;
  as?: `h1` | `h2`;
  className?: string;
  lines: { text: string; accent?: boolean }[];
};

const Landing2Heading = ({ id, lines, delay = 0, className, as: Heading = `h2` }: Landing2HeadingProps) => (
  <Heading id={id} data-l2-split data-l2-delay={delay} className={className} aria-label={lines.map(line => line.text).join(` `)}>
    {lines.map((line, index) => {
      const Line = line.accent ? `em` : `span`;
      return <Line key={index} data-l2-line aria-hidden={`true`} className={styles.line}>{line.text}</Line>;
    })}
  </Heading>
);

export default Landing2Heading;
