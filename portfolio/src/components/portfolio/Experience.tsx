import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { EXPERIENCE } from "./data";

export function Experience() {
  return (
    <section id="experience" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="04" title="Experience">
          Where I&apos;ve been building.
        </SectionHeading>
        <ol className="relative border-l border-border pl-8">
          {EXPERIENCE.map((job, i) => (
            <li key={job.role + job.company} className="pb-12 last:pb-0">
              <Reveal delay={i * 100}>
                <span className="absolute -left-[6.5px] mt-2 h-3 w-3 rounded-full bg-primary" />
                <p className="font-mono text-xs tracking-widest text-primary uppercase">
                  {job.period}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-start">
                  {job.role}{" "}
                  <span className="text-muted-foreground">· {job.company}</span>
                </h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                  {job.summary}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
