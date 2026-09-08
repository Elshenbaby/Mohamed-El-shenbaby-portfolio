import { useCallback, useEffect, useMemo, useState } from "react";
import { content } from "./content";

/** 0 path, 1 wall, 2 start, 3 goal (Mohamed) */
const MAZE: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

type Pos = { r: number; c: number };

function findCell(kind: number): Pos {
  for (let r = 0; r < MAZE.length; r++) {
    for (let c = 0; c < MAZE[r].length; c++) {
      if (MAZE[r][c] === kind) return { r, c };
    }
  }
  return { r: 1, c: 1 };
}

const START = findCell(2);

type Phase = "intro" | "play" | "win";

export function MazeQuest() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [playerName, setPlayerName] = useState("");
  const [pos, setPos] = useState<Pos>(START);
  const [moves, setMoves] = useState(0);

  const displayName = useMemo(() => {
    const trimmed = playerName.trim();
    return trimmed.length > 0 ? trimmed.split(/\s+/)[0] : "Player";
  }, [playerName]);

  const tryMove = useCallback((dr: number, dc: number) => {
    setPos((current) => {
      const next = { r: current.r + dr, c: current.c + dc };
      const cell = MAZE[next.r]?.[next.c];
      if (cell === undefined || cell === 1) return current;
      setMoves((m) => m + 1);
      if (cell === 3) {
        setTimeout(() => setPhase("win"), 120);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["arrowup", "w"].includes(key)) {
        e.preventDefault();
        tryMove(-1, 0);
      } else if (["arrowdown", "s"].includes(key)) {
        e.preventDefault();
        tryMove(1, 0);
      } else if (["arrowleft", "a"].includes(key)) {
        e.preventDefault();
        tryMove(0, -1);
      } else if (["arrowright", "d"].includes(key)) {
        e.preventDefault();
        tryMove(0, 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, tryMove]);

  const startGame = () => {
    setPos(START);
    setMoves(0);
    setPhase("play");
  };

  const whatsappHref = `${content.contact.whatsapp}?text=${encodeURIComponent(
    `Hey Mohamed, I'm ${displayName}. I found you in the maze. Let's create something bigger.`,
  )}`;

  return (
    <section id="play" className="border-t border-line bg-ink py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="section-label reveal">Side quest</p>
        <h2 className="reveal mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Find the builder
        </h2>
        <p className="reveal mt-3 max-w-2xl text-mist">
          Drop your name, walk the maze, and reach Mohamed. The prize is not points. It is a real
          build conversation.
        </p>

        <div className="reveal mt-10 overflow-hidden rounded-2xl border border-line bg-ink-2">
          {phase === "intro" && (
            <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber">
                  How it works
                </p>
                <ol className="mt-4 space-y-3 text-sm leading-relaxed text-mist">
                  <li>1. Enter your name. You become the runner.</li>
                  <li>2. Move with arrow keys or the on-screen pad.</li>
                  <li>3. Reach Mohamed. He is the one who ships.</li>
                </ol>
                <label className="mt-8 block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">
                    Your name
                  </span>
                  <input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") startGame();
                    }}
                    placeholder="Type your name"
                    maxLength={32}
                    className="mt-2 w-full rounded-xl border border-line bg-ink px-4 py-3 text-foam outline-none ring-teal/40 placeholder:text-mist/50 focus:ring-2"
                  />
                </label>
                <button type="button" onClick={startGame} className="cta-primary mt-5">
                  Enter the maze
                </button>
              </div>
              <div className="rounded-xl border border-teal/30 bg-ink p-5">
                <p className="font-display text-lg font-bold text-foam">Why a maze?</p>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  Most portfolios ask you to scroll. This one asks you to choose a path. When you
                  arrive, you already proved you want the work done.
                </p>
              </div>
            </div>
          )}

          {phase === "play" && (
            <div className="p-6 sm:p-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-mist">
                  Runner: <span className="font-semibold text-foam">{displayName}</span>
                </p>
                <p className="text-sm text-mist">Moves: {moves}</p>
              </div>

              <div
                className="mx-auto grid max-w-md gap-1"
                style={{ gridTemplateColumns: `repeat(${MAZE[0].length}, minmax(0, 1fr))` }}
                role="grid"
                aria-label="Maze board"
              >
                {MAZE.map((row, r) =>
                  row.map((cell, c) => {
                    const isPlayer = pos.r === r && pos.c === c;
                    const isGoal = cell === 3;
                    const isWall = cell === 1;
                    let cls =
                      "aspect-square rounded-sm border border-transparent transition-colors duration-150";
                    if (isWall) cls += " bg-line/80";
                    else if (isGoal) cls += " bg-amber/25 border-amber/50";
                    else cls += " bg-ink";
                    if (isPlayer) cls += " !bg-teal shadow-[0_0_12px_rgba(46,196,182,0.55)]";
                    return (
                      <div
                        key={`${r}-${c}`}
                        className={cls}
                        role="gridcell"
                        aria-label={
                          isPlayer
                            ? "You"
                            : isGoal
                              ? "Mohamed"
                              : isWall
                                ? "Wall"
                                : "Path"
                        }
                      >
                        {isPlayer && (
                          <span className="flex h-full items-center justify-center text-[10px] font-bold text-ink sm:text-xs">
                            {displayName.slice(0, 1).toUpperCase()}
                          </span>
                        )}
                        {!isPlayer && isGoal && (
                          <span className="flex h-full items-center justify-center text-[9px] font-bold text-amber sm:text-[10px]">
                            M
                          </span>
                        )}
                      </div>
                    );
                  }),
                )}
              </div>

              <div className="mx-auto mt-6 flex max-w-[180px] flex-col items-center gap-2 sm:hidden">
                <button type="button" className="pad-btn" onClick={() => tryMove(-1, 0)}>
                  ↑
                </button>
                <div className="flex gap-2">
                  <button type="button" className="pad-btn" onClick={() => tryMove(0, -1)}>
                    ←
                  </button>
                  <button type="button" className="pad-btn" onClick={() => tryMove(1, 0)}>
                    ↓
                  </button>
                  <button type="button" className="pad-btn" onClick={() => tryMove(0, 1)}>
                    →
                  </button>
                </div>
              </div>
              <p className="mt-4 hidden text-center text-xs text-mist/70 sm:block">
                Use arrow keys or WASD
              </p>
            </div>
          )}

          {phase === "win" && (
            <div className="p-6 text-center sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">
                Path cleared
              </p>
              <h3 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {displayName}, you found the builder.
              </h3>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-mist">
                Mohamed is the one who gets the work shipped. Now let's create something bigger
                together.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={whatsappHref}
                  className="cta-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Let's build
                </a>
                <a href={`mailto:${content.contact.email}`} className="cta-ghost">
                  Email Mohamed
                </a>
                <button
                  type="button"
                  className="cta-ghost"
                  onClick={() => {
                    setPos(START);
                    setMoves(0);
                    setPhase("intro");
                  }}
                >
                  Play again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
