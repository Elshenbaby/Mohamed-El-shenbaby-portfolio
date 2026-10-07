import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { content, type CaseStudy } from "../content";
import { CaseFile } from "./CaseFile";

const studies = content.caseStudies;
const N = studies.length;

function useIsWide() {
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.innerWidth >= 1024);
  useEffect(() => {
    const on = () => setWide(window.innerWidth >= 1024);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return wide;
}

/** Laptop-style frame that tilts toward the pointer and flips through the project's real pages. */
function Device({ study, active }: { study: CaseStudy; active: boolean }) {
  const [page, setPage] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const pages = study.pages;

  useEffect(() => {
    if (!active || pages.length < 2) return;
    const id = window.setInterval(() => setPage((p) => (p + 1) % pages.length), 3800);
    return () => window.clearInterval(id);
  }, [active, pages.length]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 10 });
  };

  return (
    <div className="device-stage" onPointerMove={onMove} onPointerLeave={() => setTilt({ x: 0, y: 0 })}>
      <div className="device" style={{ transform: `rotateX(${8 + tilt.x}deg) rotateY(${-10 + tilt.y}deg)` }}>
        <div className="device__screen">
          <div className="device__bar">
            <span className="browser__dot bg-[#ff5f57]" />
            <span className="browser__dot bg-[#febc2e]" />
            <span className="browser__dot bg-[#28c840]" />
            <span className="device__url">{new URL(study.links[0].href).host}</span>
            {study.private && <span className="device__lock">🔒 Sign-in app</span>}
          </div>
          <div className="device__view">
            {pages.map((p, i) => (
              <img
                key={p.src}
                src={p.src}
                alt={`${study.name}: ${p.caption}`}
                loading="lazy"
                className={`device__img ${i === page ? "is-on" : ""}`}
              />
            ))}
            <div className="device__glare" />
          </div>
        </div>
        <div className="device__base" />
      </div>
      {pages.length > 1 && (
        <div className="device__tabs" role="tablist" aria-label={`${study.name} pages`}>
          {pages.map((p, i) => (
            <button
              key={p.src}
              type="button"
              role="tab"
              aria-selected={i === page}
              onClick={() => setPage(i)}
              className={`device__tab ${i === page ? "is-on" : ""}`}
            >
              <span>{String(i + 1).padStart(2, "0")}</span> {p.caption}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Universe({
  study,
  index,
  active,
  shift,
  onOpen,
}: {
  study: CaseStudy;
  index: number;
  active: boolean;
  shift: number;
  onOpen: () => void;
}) {
  const live = study.links[0];
  const vars = {
    "--u-bg": study.palette.bg,
    "--u-surface": study.palette.surface,
    "--u-accent": study.palette.accent,
    "--u-accent2": study.palette.accent2,
    "--u-text": study.palette.text,
  } as CSSProperties;

  return (
    <article id={`u-${study.id}`} className="universe" style={vars} aria-label={`${study.name}, universe ${index + 1}`}>
      <div className="universe__ghost" style={{ transform: `translateX(${shift * 18}vw)` }} aria-hidden>
        {study.name}
      </div>
      <div className="universe__rift" aria-hidden />

      <div className="universe__inner">
        <div className="universe__copy" style={{ transform: `translateX(${shift * -6}vw)` }}>
          <p className="universe__meta">
            <span>{study.universe}</span>
            <span>{study.year}</span>
            <span>{study.role}</span>
          </p>
          <h3 className="universe__name">{study.name}</h3>
          <p className="universe__tagline">{study.tagline}</p>

          <div className="universe__story">
            <div>
              <p className="universe__label">The problem</p>
              <p>{study.problem}</p>
            </div>
            <div>
              <p className="universe__label universe__label--fix">The fix</p>
              <p>{study.blurb}</p>
            </div>
          </div>

          <ul className="universe__chips" aria-label="What's inside">
            {study.highlights.slice(0, 5).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="button" onClick={onOpen} className="universe__cta">
              Open case file <span aria-hidden>→</span>
            </button>
            <a href={live.href} target="_blank" rel="noopener noreferrer" className="universe__link">
              {live.label} ↗
            </a>
          </div>
        </div>

        <div className="universe__device" style={{ transform: `translateX(${shift * 10}vw)` }}>
          <Device study={study} active={active} />
        </div>
      </div>
    </article>
  );
}

export function Multiverse() {
  const wide = useIsWide();
  const rail = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const glitch = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);
  const [open, setOpen] = useState<CaseStudy | null>(null);

  useEffect(() => {
    if (!wide) return;
    let raf = 0;
    let shown = 0;
    const tick = () => {
      const el = rail.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const span = r.height - window.innerHeight;
        const target = Math.min(1, Math.max(0, -r.top / span)) * (N - 1);
        shown += (target - shown) * 0.12;
        if (Math.abs(target - shown) < 0.0005) shown = target;
        if (track.current) track.current.style.transform = `translate3d(${-shown * 100}vw,0,0)`;
        // tear the picture between worlds
        const frac = shown - Math.floor(shown);
        const tear = frac > 0.02 && frac < 0.98 ? Math.sin(frac * Math.PI) : 0;
        if (glitch.current) glitch.current.style.setProperty("--tear", tear.toFixed(3));
        setPos((p) => (Math.abs(p - shown) > 0.004 ? shown : p));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [wide]);

  const current = Math.round(pos);

  const jump = (i: number) => {
    const el = rail.current;
    if (!el || !wide) {
      document.getElementById(`u-${studies[i].id}`)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + (span * i) / (N - 1), behavior: "smooth" });
  };

  return (
    <div id="work">
      <section className="multiverse-head">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <p className="reveal dimension-tag">Selected work · {N} universes</p>
          <h2 className="reveal section-title mt-6">
            The <em>Multiverse</em>
          </h2>
          <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">
            Every product I've built lives in its own universe, painted in that product's own colours. Different
            problem, different world. Same guy shipping it to production.
          </p>
          <div className="reveal mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {studies.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => jump(i)}
                className="portal-chip"
                style={{ "--u-accent": s.palette.accent } as CSSProperties}
              >
                <span className="portal-chip__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="portal-chip__name">{s.name}</span>
                <span className="portal-chip__tag">{s.tagline}</span>
              </button>
            ))}
          </div>
          {wide && <p className="reveal scroll-hint mt-14">Scroll to travel sideways</p>}
        </div>
      </section>

      {wide ? (
        <div ref={rail} className="relative" style={{ height: `${N * 100}vh` }}>
          <div className="sticky top-0 h-screen overflow-hidden">
            <div ref={track} className="flex h-full will-change-transform" style={{ width: `${N * 100}vw` }}>
              {studies.map((s, i) => (
                <Universe
                  key={s.id}
                  study={s}
                  index={i}
                  active={current === i}
                  shift={Math.max(-1, Math.min(1, i - pos))}
                  onOpen={() => setOpen(s)}
                />
              ))}
            </div>
            <div ref={glitch} className="tear" aria-hidden />
            <div className="universe-hud" aria-hidden>
              <span>
                Universe {String(current + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
              </span>
              <span className="universe-hud__bar">
                <span style={{ width: `${(pos / (N - 1)) * 100}%` }} />
              </span>
              <span>{studies[current].name}</span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {studies.map((s, i) => (
            <Universe key={s.id} study={s} index={i} active shift={0} onOpen={() => setOpen(s)} />
          ))}
        </div>
      )}

      {open && <CaseFile study={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
