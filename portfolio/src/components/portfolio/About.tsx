import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { SKILLS } from "./data";

export function About() {
  return (
    <section id="about" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="01" title="About">
          Ideas and designs, turned into clean functional interfaces.
        </SectionHeading>
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                I&apos;m a Frontend Developer passionate about building modern,
                responsive and user-focused web experiences. I work with HTML,
                CSS, JavaScript, TypeScript, React, Vue and Tailwind CSS to turn
                ideas and designs into interfaces that hold up in the real
                world.
              </p>
              <p>
                I enjoy solving problems through code, learning new technologies
                and creating digital products that are both visually engaging
                and easy to use. I&apos;m continuously sharpening my craft and
                looking for meaningful projects to contribute to while growing
                as a developer.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
              {[
                ["Based in", "Ikorodu, Lagos"],
                ["Focus", "Frontend & UI"],
                ["Projects shipped", "20+"],
                ["Core stack", SKILLS.slice(0, 3).join(", ")],
              ].map(([k, v]) => (
                <div key={k} className="bg-card p-6">
                  <dt className="text-xs tracking-widest text-muted-foreground uppercase">
                    {k}
                  </dt>
                  <dd className="mt-2 font-display text-lg font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
