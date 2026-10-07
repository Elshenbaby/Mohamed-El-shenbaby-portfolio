import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { DimensionShift } from "./comic/DimensionShift";
import { content } from "./content";
import { IntroScene } from "./intro/IntroScene";
import { MazeQuest } from "./MazeQuest";
import { About } from "./sections/About";
import { Boot } from "./sections/Boot";
import { Contact } from "./sections/Contact";
import { Multiverse } from "./sections/Multiverse";
import { Nav } from "./sections/Nav";
import { Origin } from "./sections/Origin";
import { Powers } from "./sections/Powers";
import { Variants } from "./sections/Variants";

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 48,
          filter: "blur(8px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <Nav />
      <main>
        <IntroScene />
        <Boot />
        <About />
        <DimensionShift text="Entering the multiverse · every product is its own universe" />
        <Multiverse />
        <DimensionShift text="Variants detected · more universes ahead" />
        <Variants />
        <Powers />
        <MazeQuest />
        <Origin />
        <Contact />
      </main>
      <footer
        className="border-t border-[var(--color-line)] bg-[var(--color-night)] py-8 text-center text-[0.65rem] tracking-[0.25em] text-[var(--color-muted)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        © {new Date().getFullYear()} {content.name.toUpperCase()} · DRAWN & CODED IN CAIRO
      </footer>
    </div>
  );
}

export default App;
