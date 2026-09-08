import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { content } from "./content";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
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
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        tl.fromTo(
          hero.querySelector(".hero-name"),
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.75 },
        )
          .fromTo(
            hero.querySelector(".hero-role"),
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.55 },
            "-=0.35",
          )
          .fromTo(
            hero.querySelector(".hero-headline"),
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7 },
            "-=0.3",
          )
          .fromTo(
            hero.querySelector(".hero-summary"),
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.55 },
            "-=0.35",
          )
          .fromTo(
            hero.querySelectorAll(".hero-cta"),
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 },
            "-=0.25",
          );
      }

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".case-block").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 78%",
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
          <a href={content.contact.whatsapp} className="cta-primary text-sm" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hero — one composition: brand, offer, support, CTAs, atmospheric field */}
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
            <h1 className="hero-headline mt-6 max-w-3xl font-display text-[clamp(1.45rem,3.4vw,2.35rem)] font-semibold leading-snug text-foam">
              {content.headline}
            </h1>
            <p className="hero-summary mt-5 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
              {content.summary}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={content.contact.whatsapp}
                className="hero-cta cta-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Start a project
              </a>
              <a href={`mailto:${content.contact.email}`} className="hero-cta cta-ghost">
                Email
              </a>
              <a
                href={content.links[0]?.href}
                className="hero-cta cta-ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
            <p className="mt-8 text-xs uppercase tracking-[0.24em] text-mist/70">{content.location}</p>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="border-t border-line bg-ink-2 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="section-label reveal">Loadouts</p>
            <h2 className="reveal mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              What I build for clients
            </h2>
            <p className="reveal mt-3 max-w-2xl text-mist">
              Three offers — CRM builds, migrations, and ops automation — scoped to ship.
            </p>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {content.services.map((service) => (
                <article key={service.id} className="board-tile reveal p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber">
                    {service.label}
                  </p>
                  <h3 className="mt-4 font-display text-xl font-bold text-foam">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{service.blurb}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Featured work */}
        <section id="work" className="border-t border-line py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="section-label reveal">Main quest</p>
            <h2 className="reveal mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Featured work
            </h2>
            <p className="reveal mt-3 max-w-2xl text-mist">
              Soluo first — then supporting platforms that prove the same shipping muscle.
            </p>

            <article className="case-featured case-block mt-12 p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-teal">
                  {featured.quest}
                </span>
                <span className="text-mist/50">·</span>
                <span className="text-sm text-mist">{featured.role}</span>
              </div>
              <h3 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {featured.name}
              </h3>
              <p className="mt-4 max-w-3xl text-lg text-mist">{featured.summary}</p>

              <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">
                    Problem
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-foam/90">{featured.problem}</p>
                  <h4 className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-amber">
                    Build
                  </h4>
                  <ul className="mt-3 space-y-3">
                    {featured.build.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-mist">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">
                    Outcomes
                  </h4>
                  <ul className="mt-3 space-y-3">
                    {featured.outcomes.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-foam/90">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {featured.stack.map((tech) => (
                      <span key={tech} className="stack-chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {featured.links && featured.links.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-3">
                      {featured.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={link.label === "Live" ? "cta-primary text-sm" : "cta-ghost text-sm"}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>

            <div className="quest-rail mt-14 space-y-10 pl-5 sm:pl-6">
              {rest.map((study) => (
                <article key={study.id} className="case-block relative">
                  <span className="quest-node absolute -left-[1.4rem] top-2 sm:-left-[1.65rem]" />
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">
                    {study.quest}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold">{study.name}</h3>
                  <p className="mt-1 text-sm text-mist">{study.role}</p>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foam/85">{study.summary}</p>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-mist">{study.problem}</p>
                  <ul className="mt-4 max-w-3xl space-y-2">
                    {study.build.slice(0, 2).map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-mist">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {study.stack.map((tech) => (
                      <span key={tech} className="stack-chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {study.links && study.links.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-3">
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
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Stack */}
        <section id="stack" className="border-t border-line bg-ink-2 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="section-label reveal">Inventory</p>
            <h2 className="reveal mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Stack I ship with
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(content.stack).map(([group, items]) => (
                <div key={group} className="reveal">
                  <h3 className="font-display text-lg font-bold text-foam">{group}</h3>
                  <ul className="mt-4 space-y-2">
                    {items.map((item) => (
                      <li key={item} className="text-sm text-mist">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="border-t border-line py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="section-label reveal">How I ship</p>
            <h2 className="reveal mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              From ops map to production
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {content.process.map((step) => (
                <article key={step.step} className="reveal border-t border-teal/40 pt-5">
                  <p className="font-display text-sm font-bold text-amber">{step.step}</p>
                  <h3 className="mt-3 font-display text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{step.blurb}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Other work */}
        <section id="other" className="border-t border-line bg-ink-2 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="section-label reveal">Side quests</p>
            <h2 className="reveal mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Other work
            </h2>
            <p className="reveal mt-3 max-w-2xl text-mist">
              Marketing, PR, and brand experience — kept secondary to software delivery.
            </p>
            <ul className="mt-10 divide-y divide-line">
              {content.otherWork.map((item) => (
                <li
                  key={`${item.title}-${item.org}`}
                  className="reveal flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <div>
                    <p className="font-display text-base font-semibold text-foam">{item.title}</p>
                    <p className="mt-1 text-sm text-mist">
                      {item.org} · {item.date}
                    </p>
                  </div>
                  <p className="max-w-md text-sm text-mist/90 sm:text-right">{item.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* About */}
        <section id="about" className="border-t border-line py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="reveal">
              <p className="section-label">About</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Ops-first engineer
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist">{content.about}</p>
            </div>
            <div className="reveal space-y-8">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">
                  Education
                </h3>
                <ul className="mt-4 space-y-3">
                  {content.education.map((edu) => (
                    <li key={edu.title}>
                      <p className="font-semibold text-foam">{edu.title}</p>
                      <p className="text-sm text-mist">
                        {edu.org} · {edu.date}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">
                  Languages
                </h3>
                <p className="mt-3 text-sm text-mist">{content.languages.join(" · ")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="border-t border-line bg-ink-2 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
            <p className="section-label reveal">Next map</p>
            <h2 className="reveal mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Need a CRM that actually ships?
            </h2>
            <p className="reveal mx-auto mt-5 max-w-xl text-mist">
              Tell me about the ops workflow, the legacy tool, or the cutover date — I’ll reply with a
              clear build path.
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
                {content.contact.email}
              </a>
              <a
                href={`tel:${content.contact.phone.replace(/\s/g, "")}`}
                className="cta-ghost"
              >
                {content.contact.phone}
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
        © {new Date().getFullYear()} {content.name} · Django CRM engineer · Cairo
      </footer>
    </div>
  );
}

export default App;
