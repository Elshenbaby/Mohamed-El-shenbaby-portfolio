import { useEffect, useRef, useState } from "react";
import { content } from "../content";

const LINES: [string, string][] = [
  ["> booting shenbaby.os", "#ece8f7"],
  ["> mounting /cairo/earth-20 ............... ok", "#9a94b3"],
  ["> loading skills: django, react, three.js, n8n", "#9a94b3"],
  [`> scanning multiverse ... ${content.caseStudies.length} universes found`, "#05d9e8"],
  ["> all systems in production", "#3dff9a"],
];

/** The moment after the dive: the laptop boots into the rest of the site. */
export function Boot() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let n = 0;
        const step = () => {
          n += 1;
          setShown(n);
          if (n < LINES.length) timer = window.setTimeout(step, 260);
        };
        timer = window.setTimeout(step, 150);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section ref={ref} className="boot" aria-label="Loading">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <pre className="boot__term" aria-hidden>
          {LINES.slice(0, shown).map(([t, c]) => (
            <span key={t} style={{ color: c }}>
              {t}
              {"\n"}
            </span>
          ))}
          <span className="boot__cursor">█</span>
        </pre>
        <p className={`boot__welcome ${shown >= LINES.length ? "is-on" : ""}`}>
          Welcome to the <em>Shenbaby-Verse</em>.
        </p>
      </div>
    </section>
  );
}
