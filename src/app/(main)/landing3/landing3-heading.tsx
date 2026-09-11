import styles from './landing3-motion.module.scss';

type Landing3HeadingProps = {
  id: string;
  delay?: number;
  as?: `h1` | `h2`;
  className?: string;
  lines: { text: string; accent?: boolean }[];
};

const Landing3Heading = ({ id, lines, delay = 0, className, as: Heading = `h2` }: Landing3HeadingProps) => (
  <Heading id={id} data-l3-split data-l3-delay={delay} className={className} aria-label={lines.map(line => line.text).join(` `)}>
    {lines.map((line, index) => {
      const Line = line.accent ? `em` : `span`;
      return <Line key={index} data-l3-line aria-hidden={`true`} className={styles.line}>{line.text}</Line>;
    })}
  </Heading>
);

export default Landing3Heading;
