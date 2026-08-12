import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { SKILLS } from "./data";

export function Skills() {
  return (
    <section id="skills" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="02" title="Skills">
          The tools I reach for.
        </SectionHeading>
        <div className="flex flex-wrap gap-3">
          {SKILLS.map((skill, i) => (
            <Reveal key={skill} delay={i * 60}>
              <span className="inline-block rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:border-primary hover:text-primary">
                {skill}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
