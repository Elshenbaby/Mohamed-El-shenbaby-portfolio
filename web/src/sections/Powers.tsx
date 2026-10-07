import { content } from "../content";

const moveColors = ["var(--color-magenta)", "var(--color-cyan)", "var(--color-yellow)"];

export function Powers() {
  return (
    <section id="powers" className="relative overflow-hidden bg-[var(--color-night)] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="reveal dimension-tag">Services & skills</p>
        <h2 className="reveal section-title mt-6">
          <em>Powers</em>
        </h2>

        <h3 className="reveal power-heading mt-16 text-[var(--color-yellow)]">Special moves · what you can hire me for</h3>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {content.services.map((s, i) => (
            <article key={s.id} className="reveal power-move" style={{ ["--move" as string]: moveColors[i % 3] }}>
              <span className="power-move__n">Move 0{i + 1}</span>
              <h4 className="mt-4 text-3xl leading-none" style={{ fontFamily: "var(--font-comic)" }}>
                {s.title}
              </h4>
              <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{s.blurb}</p>
            </article>
          ))}
        </div>

        <h3 className="reveal power-heading mt-20 text-[var(--color-cyan)]">Abilities</h3>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.skillGroups.map((g) => {
            const side = g.id === "extras";
            return (
              <article key={g.id} className={`reveal power-skill ${side ? "power-skill--side" : ""}`}>
                <h4 className="text-2xl leading-none" style={{ fontFamily: "var(--font-comic)" }}>
                  {side ? "Side powers" : g.title}
                </h4>
                {side && (
                  <p
                    className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[var(--color-yellow)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    I get the business side too
                  </p>
                )}
                <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
                  {g.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden className={side ? "text-[var(--color-yellow)]" : "text-[var(--color-cyan)]"}>
                        ✦
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <h3 className="reveal power-heading mt-20 text-[var(--color-magenta)]">Gadgets · automations running in production</h3>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {content.automations.map((a) => (
            <article key={a.id} className="reveal power-skill">
              <h4 className="text-2xl leading-none" style={{ fontFamily: "var(--font-comic)" }}>
                {a.title}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{a.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {a.stack.map((t) => (
                  <span key={t} className="sticker !text-[0.6rem]">
                    {t}
                  </span>
                ))}
              </div>
              {a.links?.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="universe__link mt-5 inline-block">
                  {l.label} ↗
                </a>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
