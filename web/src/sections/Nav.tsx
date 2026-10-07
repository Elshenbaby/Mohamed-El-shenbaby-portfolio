import { useEffect, useState } from "react";
import { content } from "../content";

const items = [
  { label: "Me", href: "#about" },
  { label: "Multiverse", href: "#work" },
  { label: "Variants", href: "#variants" },
  { label: "Powers", href: "#powers" },
  { label: "Play", href: "#play" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const intro = document.getElementById("top");
      const end = intro ? intro.offsetHeight - window.innerHeight * 1.05 : 0;
      setShown(window.scrollY > end);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={`comic-nav fixed inset-x-0 top-0 z-50 transition-transform duration-300 ${
        shown ? "translate-y-0" : "-translate-y-[110%]"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <a href="#top" className="text-2xl tracking-wide" style={{ fontFamily: "var(--font-comic)" }}>
          <span className="text-[var(--color-yellow)]">M</span>
          <span className="text-[var(--color-cyan)]">.</span>
          <span className="text-[var(--color-paper)]">Shenbaby</span>
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {items.map((i) => (
            <a key={i.href} href={i.href}>
              {i.label}
            </a>
          ))}
        </nav>
        <a href={content.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="bubble bubble--yellow !text-base !py-1.5">
          Hire me
        </a>
      </div>
    </header>
  );
}
