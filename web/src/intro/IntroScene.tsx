import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";

const IntroCanvas = lazy(() => import("./IntroCanvas"));

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    Promise.all([
      document.fonts.load("120px Bangers"),
      document.fonts.load("25px 'Space Mono'"),
    ])
      .catch(() => undefined)
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}

class GLBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type Beat = { from: number; to: number; node: ReactNode; className: string };

const BEATS: Beat[] = [
  {
    from: 0.13,
    to: 0.3,
    className: "left-[6%] top-[16%]",
    node: (
      <>
        <p className="caption">Alright. Let's start from the top.</p>
        <p className="caption caption--late mt-3 ml-8">My name is Mohamed El-Shenbaby.</p>
      </>
    ),
  },
  {
    from: 0.31,
    to: 0.47,
    className: "right-[6%] top-[14%] items-end text-right",
    node: (
      <>
        <p className="caption caption--cyan">Cairo. 2:14 AM.</p>
        <p className="caption caption--late mt-3 mr-6">
          Somewhere out there, a whole company is still running on spreadsheets.
        </p>
      </>
    ),
  },
  {
    from: 0.48,
    to: 0.63,
    className: "left-[6%] bottom-[14%]",
    node: (
      <>
        <p className="caption">That's where I come in.</p>
        <p className="caption caption--late mt-3 ml-6">
          I build custom CRMs, dashboards and automations. Then I ship them. To production.
        </p>
      </>
    ),
  },
  {
    from: 0.66,
    to: 0.88,
    className: "inset-x-0 top-[12%] items-center text-center",
    node: (
      <>
        <p className="sfx">ZWOOP!</p>
        <p className="caption caption--magenta mt-4">Wanna see how I work? Come inside.</p>
      </>
    ),
  },
];

export function IntroScene() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [p, setP] = useState(0);
  const [active, setActive] = useState(true);
  const fontsReady = useFontsReady();

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = section.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const span = rect.height - window.innerHeight;
        const next = Math.min(1, Math.max(0, -rect.top / span));
        progress.current = next;
        setP((prev) => (Math.abs(prev - next) > 0.002 ? next : prev));
        // stop rendering the 3D room once it has scrolled out of view
        setActive(rect.bottom > 0);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const flash = smooth(0.945, 0.995, p);

  const fallback = (
    <div className="flex h-full items-center justify-center bg-[var(--color-night)]">
      <h1 className="comic-logo text-center">Mohamed El-Shenbaby</h1>
    </div>
  );

  return (
    <section ref={section} id="top" className="relative h-[640vh] bg-[var(--color-night)]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <GLBoundary fallback={fallback}>
          {fontsReady && (
            <Suspense fallback={null}>
              <IntroCanvas progress={progress} active={active} />
            </Suspense>
          )}
        </GLBoundary>

        {/* title card */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center"
          style={{ opacity: 1 - smooth(0.06, 0.13, p), transform: `scale(${1 + smooth(0, 0.13, p) * 0.15})` }}
        >
          <p className="dimension-tag">Earth-20 · Cairo, Egypt</p>
          <h1 className="comic-logo mt-4">
            <span>Mohamed</span>
            <span>El-Shenbaby</span>
          </h1>
          <p className="caption mt-6">Software engineer · Custom CRMs · Django · Production</p>
        </div>

        {BEATS.map((beat, i) => {
          const on = p >= beat.from && p <= beat.to;
          return (
            <div
              key={i}
              className={`beat pointer-events-none absolute flex max-w-[min(30rem,88vw)] flex-col ${beat.className} ${on ? "beat--on" : ""}`}
              aria-hidden={!on}
            >
              {beat.node}
            </div>
          );
        })}

        <div
          className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 text-center"
          style={{ opacity: 1 - smooth(0.02, 0.08, p) }}
        >
          <p className="scroll-hint">Scroll</p>
        </div>

        <a
          href="#about"
          className="skip-intro absolute bottom-6 right-5 sm:right-8"
          style={{ opacity: p > 0.88 ? 0 : 1, pointerEvents: p > 0.88 ? "none" : "auto" }}
        >
          Skip intro
        </a>

        <div className="pointer-events-none absolute inset-0 bg-[var(--color-paper)]" style={{ opacity: flash }} />
      </div>
    </section>
  );
}
