import { useState, type FormEvent } from "react";
import { Github, Linkedin, Mail, MapPin, Send, Twitter } from "lucide-react";
import { toast } from "sonner";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { PROFILE } from "./data";

const API_URL = import.meta.env["VITE_CONTACT_API_URL"] as string | undefined;

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setMessage("");
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // No API configured — fall back to opening the visitor's mail app.
    if (!API_URL) {
      const subject = encodeURIComponent(`New project enquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      toast.success("Message ready!", {
        description:
          "Your email app is opening with the message — hit send and I'll reply shortly.",
      });
      window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
      reset();
      return;
    }

    setSending(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        success?: boolean;
        error?: string;
      };
      const isSuccessful = data.ok ?? data.success;
      if (!res.ok || !isSuccessful)
        throw new Error(data.error || "Something went wrong.");

      toast.success("Message sent!", {
        description: "Thanks — I'll get back to you within a day.",
      });
      reset();
    } catch (err) {
      toast.error("Couldn't send message", {
        description:
          err instanceof Error
            ? err.message
            : "Please try again or email me directly.",
      });
    } finally {
      setSending(false);
    }
  };

  const field =
    "w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

  return (
    <section id="contact" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="06" title="Contact">
          Let&apos;s build something worth shipping.
        </SectionHeading>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Got a product, a redesign or a landing page that needs to look
                sharp and work everywhere? Tell me about it — I usually reply
                within a day.
              </p>
              <div className="space-y-3 text-sm">
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  {PROFILE.email}
                </a>
                <p className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {PROFILE.location}
                </p>
              </div>
              <div className="flex gap-3">
                {[
                  { href: PROFILE.linkedin, Icon: Linkedin, label: "LinkedIn" },
                  { href: PROFILE.github, Icon: Github, label: "GitHub" },
                  { href: PROFILE.x, Icon: Twitter, label: "X" },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="rounded-full border border-border p-3 transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs tracking-widest uppercase"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={field}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs tracking-widest uppercase"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={field}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-xs tracking-widest uppercase"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project, timeline and budget."
                  className={field}
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send message"}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
