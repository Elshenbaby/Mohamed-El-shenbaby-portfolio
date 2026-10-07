import { useEffect, useRef, type CSSProperties } from "react";
import { content, type CaseStudy } from "../content";

/** Full-screen case study: the story, every real page, and how to see the parts behind the login. */
export function CaseFile({ study, onClose }: { study: CaseStudy; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const vars = {
    "--u-bg": study.palette.bg,
    "--u-surface": study.palette.surface,
    "--u-accent": study.palette.accent,
    "--u-accent2": study.palette.accent2,
    "--u-text": study.palette.text,
  } as CSSProperties;

  return (
    <div role="dialog" aria-modal="true" aria-label={`${study.name} case file`} className="casefile" style={vars}>
      <div className="casefile__scroll">
        <header className="casefile__head">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <p className="universe__meta !m-0">
              <span>Case file</span>
              <span>{study.universe}</span>
            </p>
            <button ref={closeBtn} type="button" onClick={onClose} className="casefile__close" aria-label="Close case file">
              Close ✕
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
          <section className="pt-10 sm:pt-16">
            <h2 className="universe__name !text-[clamp(3.5rem,12vw,9rem)]">{study.name}</h2>
            <p className="universe__tagline">{study.tagline}</p>
            <dl className="casefile__facts">
              <div>
                <dt>Role</dt>
                <dd>{study.role}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{study.year}</dd>
              </div>
              <div>
                <dt>Built with</dt>
                <dd>{study.stack.join(" · ")}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className="casefile__live" /> Live in production
                </dd>
              </div>
            </dl>
          </section>

          <section className="casefile__story">
            <div>
              <p className="universe__label">The problem</p>
              <p>{study.problem}</p>
            </div>
            <div>
              <p className="universe__label universe__label--fix">The fix</p>
              <p>{study.blurb}</p>
            </div>
          </section>

          <section className="mt-16">
            <p className="universe__label">What's inside</p>
            <ul className="universe__chips mt-4">
              {study.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>

          <section className="mt-20">
            <p className="universe__label">Page by page</p>
            <div className="mt-8 grid gap-12">
              {study.pages.map((p, i) => (
                <figure key={p.src} className="casefile__shot">
                  <div className="browser">
                    <div className="browser__bar">
                      <span className="browser__dot bg-[#ff5f57]" />
                      <span className="browser__dot bg-[#febc2e]" />
                      <span className="browser__dot bg-[#28c840]" />
                      <span className="ml-2 truncate">{new URL(study.links[0].href).host}</span>
                    </div>
                    <img src={p.src} alt={`${study.name}: ${p.caption}`} loading="lazy" className="w-full" />
                  </div>
                  <figcaption>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {p.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {study.photos && (
            <section className="mt-20">
              <p className="universe__label">On the day</p>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {study.photos.map((src) => (
                  <img key={src} src={src} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-md object-cover" />
                ))}
              </div>
            </section>
          )}

          {study.private && (
            <section className="casefile__private">
              <p className="universe__label">Behind the login</p>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed">
                Most of {study.name} sits behind a sign-in and holds real member data, so it isn't public. I'm happy to
                walk you through the inside live on a call.
              </p>
              <a href={content.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="universe__cta mt-6">
                Book a live walkthrough <span aria-hidden>→</span>
              </a>
            </section>
          )}

          <section className="mt-20 flex flex-wrap gap-4">
            {study.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="universe__link">
                {l.label} ↗
              </a>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
