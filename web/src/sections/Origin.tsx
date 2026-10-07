import { content } from "../content";

const dots = ["var(--color-magenta)", "var(--color-cyan)", "var(--color-yellow)"];

export function Origin() {
  return (
    <section id="origin" className="paper py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p className="reveal dimension-tag">Beyond code</p>
        <h2 className="reveal section-title mt-6">
          Origin <em>story</em>
        </h2>
        <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">
          Before and alongside the code: PR, brand, events and sales. It's why I build for how a business actually runs,
          not just for how the database looks.
        </p>

        <ol className="relative mt-14 space-y-6 border-l border-dashed border-[var(--color-line)] pl-8 sm:pl-12">
          {content.otherWork.map((w, i) => (
            <li key={`${w.title}-${w.org}`} className="reveal relative">
              <span
                aria-hidden
                className="absolute -left-[2.3rem] top-6 h-3 w-3 rounded-full sm:-left-[3.3rem]"
                style={{ background: dots[i % 3], boxShadow: `0 0 14px ${dots[i % 3]}` }}
              />
              <div className="panel max-w-2xl p-5">
                <p
                  className="text-[0.64rem] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {w.date} · {w.org}
                </p>
                <h3 className="mt-2 text-3xl leading-none" style={{ fontFamily: "var(--font-comic)" }}>
                  {w.title}
                </h3>
                <p className="mt-2 text-[var(--color-muted)]">{w.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
