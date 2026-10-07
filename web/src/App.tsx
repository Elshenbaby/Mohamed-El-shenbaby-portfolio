import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { DimensionShift } from "./comic/DimensionShift";
import { content } from "./content";
import { IntroScene } from "./intro/IntroScene";
import { MazeQuest } from "./MazeQuest";
import { About } from "./sections/About";
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
          y: 40,
          scale: 0.94,
          duration: 0.5,
          // stepped easing so panels land like drawn frames, not tweens
          ease: "steps(4)",
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
        <About />
        <DimensionShift text="Entering the multiverse · every project is its own universe" />
        <Multiverse />
        <DimensionShift text="Variants detected · more universes ahead" />
        <Variants />
        <Powers />
        <MazeQuest />
        <Origin />
        <Contact />
      </main>
      <footer
        className="bg-[var(--color-ink)] py-8 text-center text-xs tracking-[0.25em] text-[#a79fc8]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        © {new Date().getFullYear()} {content.name.toUpperCase()} · DRAWN & CODED IN CAIRO
      </footer>
    </div>
  );
}

export default App;
