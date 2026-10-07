import { content } from "../content";

const tints = ["var(--color-cyan)", "var(--color-yellow)", "var(--color-magenta)", "var(--color-violet)"];

export function Variants() {
  return (
    <section id="variants" className="paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="reveal dimension-tag">Also shipping</p>
        <h2 className="reveal section-title mt-5">Variants</h2>
        <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-[#3d3655]">
          Other universes I didn't start, but helped build, extend and keep alive in production.
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          {content.maintained.map((m, i) => (
            <article key={m.id} className={`reveal variant-card panel overflow-hidden ${i % 2 ? "sm:mt-12 rotate-1" : "-rotate-1"}`}>
              <div className="flex items-center justify-between border-b-[3px] border-[var(--color-ink)] px-4 py-2" style={{ background: tints[i % 4] }}>
                <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ fontFamily: "var(--font-mono)" }}>
                  Variant #{String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-mono)" }}>
                  {m.role}
                </span>
              </div>
              {m.image && (
                <div className="halftone-veil aspect-[16/10] border-b-[3px] border-[var(--color-ink)]">
                  <img src={m.image} alt={`${m.name} screenshot`} loading="lazy" className="h-full w-full object-cover object-top" />
                </div>
              )}
              <div className="p-5 sm:p-6">
                <h3 className="text-4xl leading-none" style={{ fontFamily: "var(--font-comic)" }}>
                  {m.name}
                </h3>
                <p className="mt-1 text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-hoodie)]" style={{ fontFamily: "var(--font-mono)" }}>
                  {m.tagline}
                </p>
                <p className="mt-4 leading-relaxed text-[#3d3655]">{m.blurb}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {m.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="bubble !text-lg !py-1">
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
