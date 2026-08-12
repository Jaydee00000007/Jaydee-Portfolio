import { Quote } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { TESTIMONIALS } from "./data";

export function Testimonials() {
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="05" title="Testimonials">
          Kind words from people I&apos;ve worked with.
        </SectionHeading>
        <div className="grid gap-8 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <figure className="h-full rounded-2xl border border-border bg-card p-8">
                <Quote className="h-7 w-7 text-primary" />
                <blockquote className="mt-5 text-lg leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-muted-foreground"> — {t.title}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
