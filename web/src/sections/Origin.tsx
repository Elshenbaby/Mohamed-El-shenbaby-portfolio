import { content } from "../content";

export function Origin() {
  return (
    <section id="origin" className="paper py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p className="reveal dimension-tag">Beyond code</p>
        <h2 className="reveal section-title mt-5">Origin story</h2>
        <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-[#3d3655]">
          Before and alongside the code: PR, brand, events and sales. It's why I build for how a business actually runs,
          not just for how the database looks.
        </p>

        <ol className="relative mt-14 space-y-8 border-l-[3px] border-dashed border-[var(--color-ink)] pl-8 sm:pl-12">
          {content.otherWork.map((w, i) => (
            <li key={`${w.title}-${w.org}`} className="reveal relative">
              <span
                aria-hidden
                className="absolute -left-[2.85rem] top-2 h-5 w-5 border-[3px] border-[var(--color-ink)] sm:-left-[3.85rem]"
                style={{ background: ["var(--color-magenta)", "var(--color-cyan)", "var(--color-yellow)"][i % 3] }}
              />
              <div className={`panel inline-block max-w-2xl p-5 ${i % 2 ? "rotate-[0.6deg]" : "-rotate-[0.6deg]"}`}>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-hoodie)]" style={{ fontFamily: "var(--font-mono)" }}>
                  {w.date} · {w.org}
                </p>
                <h3 className="mt-1 text-3xl leading-none" style={{ fontFamily: "var(--font-comic)" }}>
                  {w.title}
                </h3>
                <p className="mt-2 text-[#3d3655]">{w.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
