import ProjectGrid from './project-grid';
import TextReveal from '../effects/text-reveal';
import { config } from '@/shared/config/config';

export const prjctsSec = () => (
    <section className={`pageSection projectsSection`} id={`projects`}>
            <div className={`sectionInner`}>
                <div className={`sectionTitle`}>
                    <TextReveal scroll as={`span`} className={`eyebrow`} text={`Our Work`} />
                    <TextReveal scroll as={`h2`} text={`Projects`} delay={0.06} />
                    <TextReveal scroll as={`p`} text={`Applications, CMS, APIs, Games, and other Design // Development.`} />
                </div>
                <ProjectGrid featuredOnly />
            </div>
        </section>
)

export const statsSec = () => (
    <section className={`pageSection experienceSection`}>
        <div className={`sectionInner experienceGrid`}>
            {config?.stats?.map((stat: any) => (
                <article key={stat.label} className={`statCard reveal`}>
                    <TextReveal scroll as={`span`} className={`gradientTextColor`} html text={`<i>${stat.label}</i>`} />
                    <TextReveal scroll as={`strong`} text={stat.value} delay={0.06} />
                    {stat?.html ? (
                        <TextReveal scroll as={`p`} text={`<i>${stat?.html}</i>`} html />
                    ) : (
                        <TextReveal scroll as={`p`} text={`<i>${stat?.text}</i>`} html />
                    )}
                </article>
            ))}
        </div>
    </section>
)

export default function Section({
    inversed = false,
}: any) {
    return <>
        {inversed ? <>
            {statsSec()}
            <div className={`sep reveal`} />
            {prjctsSec()}
            <div className={`sep reveal`} />
        </> : <>
            {prjctsSec()}
            <div className={`sep reveal`} />
            {statsSec()}
            <div className={`sep reveal`} />
        </>}
    </>
}
