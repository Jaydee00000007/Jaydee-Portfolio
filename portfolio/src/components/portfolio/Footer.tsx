import { PROFILE } from "./data";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted-foreground sm:flex-row sm:px-8">
        <a
          href="#top"
          className="inline-flex items-center gap-3 text-foreground"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-10 rounded-full object-cover shadow-lg shadow-black/10"
          />
          <div>
            <p className="font-semibold text-foreground">{PROFILE.name}</p>
            <p className="text-xs text-muted-foreground">{PROFILE.nickname}</p>
          </div>
        </a>
        <div className="flex gap-6">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="link-underline"
          >
            GitHub
          </a>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            className="link-underline"
          >
            LinkedIn
          </a>
          <a
            href={PROFILE.x}
            target="_blank"
            rel="noreferrer"
            className="link-underline"
          >
            X
          </a>
        </div>
      </div>
    </footer>
  );
}
