import { lazy, Suspense } from "react";
import { content } from "../content";

const ComicPortrait = lazy(() => import("../comic/ComicPortrait"));

const facts = [
  { k: "Home dimension", v: "Cairo, Egypt" },
  { k: "Day job", v: "AI Engineering student" },
  { k: "Night job", v: "Freelance & part-time builds" },
  { k: "Signature move", v: "Shipping to production" },
];

const FACE: [number, number] = [0.39, 0.74];

export function About() {
  return (
    <section id="about" className="paper relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="reveal relative mx-auto w-full max-w-md">
          <div className="panel -rotate-2 overflow-hidden bg-[var(--color-ink)]">
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
          </div>
          <p className="caption absolute -bottom-5 -left-3 sm:-left-8">This is me. Earth-20.</p>
          <p className="dimension-tag absolute -top-4 right-4 rotate-3">Variant: Engineer</p>
        </div>

        <div>
          <p className="reveal dimension-tag">Inside the laptop</p>
          <h2 className="reveal section-title mt-5">
            Hey, I'm
            <br />
            Mohamed.
          </h2>
          <div className="reveal panel mt-8 p-6 sm:p-7">
            <p className="text-lg leading-relaxed">{content.intro}</p>
            <p className="mt-4 leading-relaxed text-[#3d3655]">{content.summary}</p>
          </div>
          <dl className="reveal mt-8 grid grid-cols-2 gap-3">
            {facts.map((f) => (
              <div key={f.k} className="border-[3px] border-[var(--color-ink)] bg-[var(--color-paper)] px-3 py-2">
                <dt className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--color-hoodie)]" style={{ fontFamily: "var(--font-mono)" }}>
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
