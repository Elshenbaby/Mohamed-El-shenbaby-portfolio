import { content } from "../content";

const tints = ["#05d9e8", "#ffd23f", "#ff2a6d", "#8b5cff"];

/** Platforms I helped build and keep alive: trading cards that flip to show their back. */
export function Variants() {
  return (
    <section id="variants" className="paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="reveal dimension-tag">Also shipping · contributed & maintained</p>
        <h2 className="reveal section-title mt-6">
          <em>Variants</em>
        </h2>
        <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">
          Other universes I didn't start, but helped build, extend and keep alive in production. Hover a card to flip it.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {content.maintained.map((m, i) => (
            <article
              key={m.id}
              className="reveal flip-card"
              style={{ ["--tint" as string]: tints[i % tints.length] }}
              tabIndex={0}
              aria-label={`${m.name}: ${m.tagline}`}
            >
              <div className="flip-card__inner">
                <div className="flip-card__face flip-card__front">
                  <div className="flip-card__top">
                    <span>Variant #{String(i + 1).padStart(2, "0")}</span>
                    <span>Live</span>
                  </div>
                  {m.image && (
                    <div className="flip-card__img">
                      <img src={m.image} alt={`${m.name} screenshot`} loading="lazy" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-4xl leading-none" style={{ fontFamily: "var(--font-comic)" }}>
                      {m.name}
                    </h3>
                    <p className="flip-card__tag">{m.tagline}</p>
                  </div>
                </div>
                <div className="flip-card__face flip-card__back">
                  <p className="flip-card__tag">{m.role}</p>
                  <h3 className="mt-2 text-4xl leading-none" style={{ fontFamily: "var(--font-comic)" }}>
                    {m.name}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">{m.blurb}</p>
                  <div className="mt-auto pt-5">
                    {m.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="universe__link">
                        {l.label} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
