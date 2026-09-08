import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { content } from "./content";
import { MazeQuest } from "./MazeQuest";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Play", href: "#play" },
  { label: "Automations", href: "#automations" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const hero = heroRef.current;
      if (hero) {
        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .fromTo(
            hero.querySelector(".hero-name"),
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7 },
          )
          .fromTo(
            hero.querySelector(".hero-role"),
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.45 },
            "-=0.35",
          )
          .fromTo(
            hero.querySelector(".hero-headline"),
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.55 },
            "-=0.25",
          )
          .fromTo(
            hero.querySelectorAll(".hero-cta"),
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.07 },
            "-=0.2",
          );
      }

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      document.querySelectorAll<HTMLElement>(".cta-primary, .cta-ghost").forEach((btn) => {
        const enter = () => gsap.to(btn, { y: -2, duration: 0.18, ease: "power2.out" });
        const leave = () => gsap.to(btn, { y: 0, duration: 0.22, ease: "power2.out" });
        btn.addEventListener("pointerenter", enter);
        btn.addEventListener("pointerleave", leave);
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const featured = content.caseStudies.find((c) => c.featured) ?? content.caseStudies[0];
  const rest = content.caseStudies.filter((c) => c.id !== featured.id);

  return (
    <div ref={rootRef} className="min-h-screen bg-ink text-foam">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className="font-display text-sm font-bold tracking-wide text-foam">
            {content.name.split(" ")[0]}
            <span className="text-teal">.</span>
          </a>
          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs font-medium uppercase tracking-[0.2em] text-mist transition hover:text-teal"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={content.contact.whatsapp}
            className="cta-primary text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </header>

      <main id="top">
        <section
          ref={heroRef}
          className="hero-field relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 sm:items-center sm:pb-24 sm:pt-32"
        >
          <div className="hero-scan absolute inset-0" aria-hidden />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
            <p className="hero-name font-display text-[clamp(2.75rem,9vw,6.5rem)] font-extrabold leading-[0.95] tracking-tight text-foam">
              {content.name}
            </p>
            <p className="hero-role mt-5 text-sm font-semibold uppercase tracking-[0.32em] text-amber">
              {content.role}
            </p>
            <h1 className="hero-headline mt-6 max-w-2xl font-display text-[clamp(1.45rem,3.4vw,2.35rem)] font-semibold leading-snug text-foam">
              {content.headline}
            </h1>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={content.contact.whatsapp}
                className="hero-cta cta-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Start a project
              </a>
              <a href="#work" className="hero-cta cta-ghost">
                See work
              </a>
            </div>
            <p className="mt-8 text-xs uppercase tracking-[0.24em] text-mist/70">{content.location}</p>
          </div>
        </section>

        <section id="about" className="border-t border-line bg-ink-2 py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="reveal overflow-hidden rounded-2xl border border-line">
              <img
                src={content.photo}
                alt={content.name}
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
            <div className="reveal">
              <p className="section-label">About</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                A short intro
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-mist">{content.intro}</p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-mist/85">{content.summary}</p>
            </div>
          </div>
        </section>

        <section id="services" className="border-t border-line py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="section-label reveal">Services</p>
            <h2 className="reveal mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              How I can help
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {content.services.map((service) => (
                <article key={service.id} className="reveal border-t border-teal/35 pt-5">
                  <h3 className="font-display text-xl font-bold text-foam">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{service.blurb}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="border-t border-line bg-ink-2 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="section-label reveal">Selected work</p>
            <h2 className="reveal mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Projects
            </h2>
            <p className="reveal mt-3 max-w-xl text-mist">A few builds clients can understand at a glance.</p>

            <article className="reveal mt-12 overflow-hidden rounded-2xl border border-teal/35 bg-ink">
              <div className="relative aspect-[16/9] overflow-hidden border-b border-line sm:aspect-[21/9]">
                <img
                  src={featured.image}
                  alt={featured.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">
                  Featured
                </p>
                <h3 className="mt-3 font-display text-3xl font-bold tracking-tight">{featured.name}</h3>
                <p className="mt-1 text-sm text-amber">{featured.tagline}</p>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist">{featured.blurb}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {featured.stack.map((tech) => (
                    <span key={tech} className="stack-chip">
                      {tech}
                    </span>
                  ))}
                </div>
                {featured.links && featured.links.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {featured.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta-primary text-sm"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {rest.map((study) => (
                <article key={study.id} className="reveal overflow-hidden rounded-2xl border border-line bg-ink">
                  <div className="aspect-[16/10] overflow-hidden border-b border-line">
                    <img
                      src={study.image}
                      alt={study.name}
                      className="h-full w-full object-cover object-top transition duration-500 hover:scale-[1.03]"
                    />
                  </div>
                  {study.photos && study.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-1 border-b border-line bg-ink-2 p-1 sm:grid-cols-5">
                      {study.photos.map((photo) => (
                        <div key={photo} className="aspect-square overflow-hidden">
                          <img
                            src={photo}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="p-5 sm:p-6">
                    <h3 className="font-display text-xl font-bold">{study.name}</h3>
                    <p className="mt-1 text-sm text-amber">{study.tagline}</p>
                    <p className="mt-3 text-sm leading-relaxed text-mist">{study.blurb}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {study.stack.map((tech) => (
                        <span key={tech} className="stack-chip">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {study.links && study.links.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {study.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-teal underline-offset-4 hover:underline"
                          >
                            {link.label} →
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <MazeQuest />

        <section id="automations" className="border-t border-line py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="section-label reveal">Automations</p>
            <h2 className="reveal mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              n8n, Sheets & workflows
            </h2>
            <p className="reveal mt-3 max-w-xl text-mist">
              Production automations that move CRM data without manual copy-paste.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {content.automations.map((item) => (
                <article key={item.id} className="reveal border border-line bg-ink-2 p-5 sm:p-6">
                  <h3 className="font-display text-xl font-bold text-foam">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{item.blurb}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.stack.map((tech) => (
                      <span key={tech} className="stack-chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {item.links && item.links.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {item.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-teal underline-offset-4 hover:underline"
                        >
                          {link.label} →
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="other" className="border-t border-line bg-ink-2 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="section-label reveal">Also</p>
            <h2 className="reveal mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Other experience
            </h2>
            <ul className="mt-8 divide-y divide-line">
              {content.otherWork.map((item) => (
                <li
                  key={`${item.title}-${item.org}`}
                  className="reveal flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <div>
                    <p className="font-display text-base font-semibold text-foam">{item.title}</p>
                    <p className="mt-1 text-sm text-mist">
                      {item.org} · {item.date}
                    </p>
                  </div>
                  <p className="max-w-md text-sm text-mist/80 sm:text-right">{item.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="border-t border-line bg-ink-2 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
            <p className="section-label reveal">Contact</p>
            <h2 className="reveal mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Let’s build your CRM
            </h2>
            <p className="reveal mx-auto mt-5 max-w-lg text-mist">
              Tell me what you're running today and what you want instead. I'll reply with a clear next step.
            </p>
            <div className="reveal mt-10 flex flex-wrap justify-center gap-3">
              <a
                href={content.contact.whatsapp}
                className="cta-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
              <a href={`mailto:${content.contact.email}`} className="cta-ghost">
                Email
              </a>
            </div>
            <div className="reveal mt-8 flex flex-wrap justify-center gap-5 text-sm text-mist">
              {content.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-8 text-center text-xs tracking-wide text-mist/70">
        © {new Date().getFullYear()} {content.name} · Cairo
      </footer>
    </div>
  );
}

export default App;
