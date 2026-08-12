import { ArrowDownToLine, ArrowRight, MapPin } from "lucide-react";
import { PROFILE } from "./data";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      <div className="glow-top pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-70" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Reveal>
            <p className="mb-6 flex items-center justify-start gap-2 rounded-full border border-border px-3 py-1 text-xs tracking-widest text-muted-foreground uppercase text-start">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Available for freelance work
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-display text-5xl sm:text-7xl lg:text-8xl">
              Opeyemi
              <br />
              Adeparusi<span className="text-primary">.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
              {PROFILE.role} crafting modern, responsive interfaces that load
              fast, read clearly and feel effortless — from first pixel to
              shipped product.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-105"
              >
                View Work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/cv-opeyemi-adeparusi.pdf"
                download
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                <ArrowDownToLine className="h-4 w-4" />
                Download CV
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              {PROFILE.location}
            </p>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 rounded-[2rem] border border-border" />
            <img
              src="/Jaydee.png"
              alt="Portrait of Opeyemi Adeparusi, frontend developer"
              loading="eager"
              className="relative aspect-4/5 w-full rounded-[1.5rem] object-cover grayscale transition-all duration-500 hover:grayscale-0"
            />
            <div className="absolute -bottom-5 -left-5 rounded-xl border border-border bg-card px-4 py-3 shadow-lg">
              <p className="font-display text-2xl font-extrabold">3+</p>
              <p className="text-xs text-muted-foreground">
                years building for the web
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
