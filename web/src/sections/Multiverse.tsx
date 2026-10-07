import { useEffect, useState } from "react";
import { content, type CaseStudy, type Shot } from "../content";

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.5">
      <rect x="4" y="10.5" width="16" height="11" rx="1.5" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}

function Lightbox({ shot, onClose }: { shot: Shot; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={shot.caption}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(11,8,22,0.88)] p-4 sm:p-10"
      onClick={onClose}
    >
      <figure className="browser max-h-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <div className="browser__bar">
          <span className="browser__dot bg-[var(--color-magenta)]" />
          <span className="browser__dot bg-[var(--color-yellow)]" />
          <span className="browser__dot bg-[var(--color-cyan)]" />
          <span className="ml-2 truncate">{shot.caption}</span>
          <button type="button" onClick={onClose} className="ml-auto px-2 text-base leading-none" aria-label="Close">
            ✕
          </button>
        </div>
        <img src={shot.src} alt={shot.caption} className="max-h-[80vh] w-full object-contain" />
      </figure>
    </div>
  );
}

function BehindTheLogin({ study }: { study: CaseStudy }) {
  const [open, setOpen] = useState<Shot | null>(null);
  if (!study.insideShots?.length) return null;
  return (
    <div className="mt-16">
      <div className="reveal flex flex-wrap items-center gap-4">
        <span className="dimension-tag flex items-center gap-2 !bg-[var(--color-yellow)]">
          <LockIcon /> Behind the login
        </span>
        <p className="max-w-xl text-sm opacity-85">
          {study.name} sits behind a sign-in, so you would normally never see it. Here's what's inside.
        </p>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {study.insideShots.map((shot, i) => (
          <figure key={shot.src} className={`reveal ${i % 2 ? "md:mt-10 rotate-[0.8deg]" : "-rotate-[0.6deg]"}`}>
            <button type="button" onClick={() => setOpen(shot)} className="browser block w-full text-left">
              <div className="browser__bar">
                <span className="browser__dot bg-[var(--color-magenta)]" />
                <span className="browser__dot bg-[var(--color-yellow)]" />
                <span className="browser__dot bg-[var(--color-cyan)]" />
                <span className="ml-2 truncate">{shot.caption}</span>
              </div>
              <img src={shot.src} alt={shot.caption} loading="lazy" className="aspect-[16/10] w-full object-cover object-top" />
            </button>
            <figcaption className="caption caption--paper -mt-3 ml-4 text-xs">{shot.caption}</figcaption>
          </figure>
        ))}
      </div>
      {open && <Lightbox shot={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Universe({ study, index, total }: { study: CaseStudy; index: number; total: number }) {
  const live = study.links?.find((l) => l.label.toLowerCase().includes("live"));
  return (
    <section id={`u-${study.id}`} className={`universe u-${study.theme} scroll-mt-16 py-20 sm:py-28`}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="reveal flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="universe-label">
              {study.universe} · {study.tagline}
            </p>
            <h3 className="universe-name mt-3">{study.name}</h3>
          </div>
          <p className="dimension-tag">
            Universe {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <figure className="reveal panel halftone-veil -rotate-1 self-start overflow-hidden lg:col-span-7">
            <img src={study.image} alt={`${study.name} screenshot`} className="aspect-[16/10] w-full object-cover object-top" />
            {live && (
              <a
                href={live.href}
                target="_blank"
                rel="noopener noreferrer"
                className="caption caption--magenta absolute bottom-3 left-3 z-10 !text-xs"
              >
                Live in production ↗
              </a>
            )}
          </figure>

          <div className="flex flex-col gap-8 lg:col-span-5">
            <div className="reveal panel p-5 pt-7">
              <p className="caption caption--magenta absolute -top-5 left-4 !py-1 !text-xs">The problem</p>
              <p className="leading-relaxed">{study.problem}</p>
            </div>
            <div className="reveal panel p-5 pt-7">
              <p className="caption caption--cyan absolute -top-5 left-4 !py-1 !text-xs">The fix</p>
              <p className="leading-relaxed">{study.blurb}</p>
            </div>
            {study.highlights && (
              <ul className="reveal flex flex-wrap gap-2.5" aria-label="What's inside">
                {study.highlights.map((h) => (
                  <li key={h} className="sticker">
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="reveal flex flex-wrap items-center gap-2">
              <span className="universe-label mr-1 !text-[0.62rem]">Built with</span>
              {study.stack.map((t) => (
                <span key={t} className="sticker !bg-[var(--color-ink)] !text-[var(--color-paper)]">
                  {t}
                </span>
              ))}
            </div>
            {study.links && (
              <div className="reveal flex flex-wrap gap-4 pt-2">
                {study.links.map((l, i) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bubble ${i === 0 ? "bubble--yellow" : ""}`}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {study.photos && study.photos.length > 0 && (
          <div className={`mt-14 grid gap-4 ${study.photos.length > 3 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "sm:grid-cols-2"}`}>
            {study.photos.map((src, i) => (
              <div
                key={src}
                className={`reveal panel halftone-veil overflow-hidden ${i % 2 ? "rotate-1" : "-rotate-1"} ${
                  study.photos!.length > 3 ? "aspect-square" : "aspect-video"
                }`}
              >
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
              </div>
            ))}
          </div>
        )}

        <BehindTheLogin study={study} />
      </div>
    </section>
  );
}

export function Multiverse() {
  const studies = [...content.caseStudies].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  return (
    <div id="work">
      <section className="relative overflow-hidden bg-[var(--color-night)] py-20 text-[var(--color-paper)] sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="reveal dimension-tag">Selected work</p>
          <h2 className="reveal section-title mt-5">The Multiverse</h2>
          <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-[#cfc6ee]">
            Every project I've built lives in its own universe, drawn in its own style. Different problem, different
            world. Same guy shipping it.
          </p>
          <div className="reveal mt-10 flex flex-wrap gap-3">
            {studies.map((s) => (
              <a key={s.id} href={`#u-${s.id}`} className={`portal-chip portal-chip--${s.theme}`}>
                <span className="block text-[0.6rem] tracking-[0.25em] opacity-80" style={{ fontFamily: "var(--font-mono)" }}>
                  {s.universe}
                </span>
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </section>
      {studies.map((s, i) => (
        <Universe key={s.id} study={s} index={i} total={studies.length} />
      ))}
    </div>
  );
}
