import { lazy, Suspense } from "react";
import { content } from "../content";

const ComicPortrait = lazy(() => import("../comic/ComicPortrait"));

const FACE: [number, number] = [0.39, 0.74];

const facts = [
  { k: "Home dimension", v: "Cairo, Egypt" },
  { k: "Day job", v: "AI Engineering student" },
  { k: "Night job", v: "Freelance & part-time builds" },
  { k: "Signature move", v: "Shipping to production" },
];

const counters = [
  { n: content.caseStudies.length, l: "products built" },
  { n: content.maintained.length, l: "platforms maintained" },
  { n: 18, l: "branches on my CRM" },
];

export function About() {
  return (
    <section id="about" className="about relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="reveal relative mx-auto w-full max-w-md">
          <div className="about__frame">
            <div className="aspect-[660/742] w-full">
              <Suspense fallback={null}>
                <ComicPortrait
                  src={`${import.meta.env.BASE_URL}me/portrait.jpg`}
                  aspect={660 / 742}
                  face={FACE}
                  alt={`${content.name}, drawn in comic style`}
                />
              </Suspense>
            </div>
            <span className="about__corner about__corner--tl" />
            <span className="about__corner about__corner--br" />
          </div>
          <p className="caption absolute -bottom-6 -left-3 sm:-left-8">
            This is me. <b>Earth-20.</b>
          </p>
          <p className="dimension-tag absolute -top-4 right-3 rotate-2 !bg-[var(--color-night)]">Variant: Engineer</p>
        </div>

        <div>
          <p className="reveal dimension-tag">Inside the laptop · character file</p>
          <h2 className="reveal section-title mt-6">
            Hey, I'm
            <br />
            <em>Mohamed.</em>
          </h2>
          <p className="reveal mt-8 max-w-xl text-lg leading-relaxed text-[var(--color-text)]">{content.intro}</p>
          <p className="reveal mt-4 max-w-xl leading-relaxed text-[var(--color-muted)]">{content.summary}</p>

          <div className="reveal mt-10 grid grid-cols-3 gap-px border border-[var(--color-line)] bg-[var(--color-line)]">
            {counters.map((c) => (
              <div key={c.l} className="bg-[var(--color-surface)] px-4 py-5">
                <p className="text-5xl leading-none text-[var(--color-yellow)]" style={{ fontFamily: "var(--font-comic)" }}>
                  {c.n}
                </p>
                <p
                  className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {c.l}
                </p>
              </div>
            ))}
          </div>

          <dl className="reveal mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
            {facts.map((f) => (
              <div key={f.k} className="border-l-2 border-[var(--color-magenta)] pl-3">
                <dt
                  className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[var(--color-magenta)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {f.k}
                </dt>
                <dd className="mt-1 font-semibold">{f.v}</dd>
              </div>
            ))}
          </dl>

          <div className="reveal mt-10 flex flex-wrap gap-4">
            <a href={content.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="bubble bubble--magenta">
              Start a project
            </a>
            <a href={content.contact.cv} target="_blank" rel="noopener noreferrer" className="bubble">
              Grab my CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
