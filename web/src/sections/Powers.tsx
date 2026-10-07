import { content } from "../content";

const moveColors = ["bubble--magenta", "bubble--cyan", "bubble--yellow"];

export function Powers() {
  return (
    <section id="powers" className="relative overflow-hidden bg-[var(--color-night)] py-20 text-[var(--color-paper)] sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="reveal dimension-tag">Services & skills</p>
        <h2 className="reveal section-title mt-5">Powers</h2>

        <h3 className="reveal mt-14 text-3xl tracking-wide text-[var(--color-yellow)]" style={{ fontFamily: "var(--font-comic)" }}>
          Special moves · what you can hire me for
        </h3>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {content.services.map((s, i) => (
            <article key={s.id} className={`reveal panel p-6 ${i === 1 ? "md:mt-8" : ""}`}>
              <span className={`bubble ${moveColors[i % 3]} !text-base !py-1 -mt-11 mb-4`}>Move 0{i + 1}</span>
              <h4 className="text-3xl leading-none" style={{ fontFamily: "var(--font-comic)" }}>
                {s.title}
              </h4>
              <p className="mt-3 leading-relaxed text-[#3d3655]">{s.blurb}</p>
            </article>
          ))}
        </div>

        <h3 className="reveal mt-20 text-3xl tracking-wide text-[var(--color-cyan)]" style={{ fontFamily: "var(--font-comic)" }}>
          Abilities
        </h3>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.skillGroups.map((g) => {
            const side = g.id === "extras";
            return (
              <article
                key={g.id}
                className={`reveal border-[3px] p-5 ${
                  side
                    ? "border-[var(--color-ink)] bg-[var(--color-yellow)] text-[var(--color-ink)] shadow-[6px_6px_0_var(--color-magenta)]"
                    : "border-[var(--color-cyan)] bg-[rgba(5,217,232,0.06)]"
                }`}
              >
                <h4 className="text-2xl leading-none" style={{ fontFamily: "var(--font-comic)" }}>
                  {side ? "Side powers" : g.title}
                </h4>
                {side && (
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.15em]" style={{ fontFamily: "var(--font-mono)" }}>
                    I get the business side too
                  </p>
                )}
                <ul className="mt-4 space-y-2 text-sm">
                  {g.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden className={side ? "text-[var(--color-hoodie)]" : "text-[var(--color-magenta)]"}>
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

        <h3 className="reveal mt-20 text-3xl tracking-wide text-[var(--color-magenta)]" style={{ fontFamily: "var(--font-comic)" }}>
          Gadgets · automations running in production
        </h3>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {content.automations.map((a) => (
            <article key={a.id} className="reveal border-[3px] border-[var(--color-magenta)] bg-[rgba(255,42,109,0.07)] p-5">
              <h4 className="text-2xl leading-none" style={{ fontFamily: "var(--font-comic)" }}>
                {a.title}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-[#cfc6ee]">{a.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {a.stack.map((t) => (
                  <span key={t} className="sticker !text-[0.62rem]">
                    {t}
                  </span>
                ))}
              </div>
              {a.links?.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-bold text-[var(--color-yellow)] underline underline-offset-4"
                >
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
