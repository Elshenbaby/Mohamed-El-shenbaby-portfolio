import { content } from "../content";

export function Contact() {
  const socials = content.platforms.filter((p) => ["LinkedIn", "GitHub", "Behance"].includes(p.label));
  return (
    <section id="contact" className="contact-splash relative overflow-hidden py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-5xl px-5 text-center sm:px-8">
        <p className="reveal dimension-tag">Contact</p>
        <h2 className="reveal sfx mt-8 !text-[clamp(4.5rem,15vw,10rem)]">Your move.</h2>
        <p className="reveal caption mx-auto mt-10 max-w-xl !text-base">
          Tell me what your team runs on today and what you wish it did. I'll reply with a clear next step.
        </p>

        <div className="reveal mt-14 flex flex-wrap justify-center gap-5">
          <a href={content.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="bubble bubble--yellow !text-2xl">
            WhatsApp me
          </a>
          <a href={`mailto:${content.contact.email}`} className="bubble bubble--cyan !text-2xl">
            Email
          </a>
          <a href={`tel:${content.contact.phone.replace(/\s/g, "")}`} className="bubble !text-2xl">
            Call
          </a>
          <a href={content.contact.cv} target="_blank" rel="noopener noreferrer" className="bubble !text-2xl">
            Download CV
          </a>
        </div>

        <div className="reveal mt-14 flex flex-wrap justify-center gap-6">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--color-paper)] underline-offset-4 hover:underline"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
