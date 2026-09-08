import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { content } from "./content";

/** 0 path, 1 wall, 2 start, 3 goal, 4 coin */
const MAZE: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 4, 0, 1, 0, 0, 4, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 4, 0, 0, 0, 4, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 4, 1],
  [1, 0, 0, 4, 0, 0, 0, 0, 1, 0, 0, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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

function allCoins(): string[] {
  const list: string[] = [];
  for (let r = 0; r < MAZE.length; r++) {
    for (let c = 0; c < MAZE[r].length; c++) {
      if (MAZE[r][c] === 4) list.push(`${r},${c}`);
    }
  }
  return list;
}

const START = findCell(2);
const COIN_KEYS = allCoins();

/** Pre-baked attract-mode path through the maze */
const DEMO_PATH: Pos[] = [
  { r: 1, c: 1 },
  { r: 1, c: 2 },
  { r: 1, c: 3 },
  { r: 1, c: 4 },
  { r: 2, c: 4 },
  { r: 3, c: 4 },
  { r: 3, c: 5 },
  { r: 3, c: 6 },
  { r: 3, c: 7 },
  { r: 3, c: 8 },
  { r: 3, c: 9 },
  { r: 4, c: 9 },
  { r: 5, c: 9 },
  { r: 5, c: 10 },
  { r: 5, c: 11 },
  { r: 6, c: 11 },
  { r: 7, c: 11 },
  { r: 8, c: 11 },
  { r: 9, c: 11 },
];

type Phase = "attract" | "insert" | "play" | "win";

function beep(freq: number, ms = 60) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.value = freq;
    g.gain.value = 0.04;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      void ctx.close();
    }, ms);
  } catch {
    /* ignore */
  }
}

export function MazeQuest() {
  const [phase, setPhase] = useState<Phase>("attract");
  const [playerName, setPlayerName] = useState("");
  const [pos, setPos] = useState<Pos>(START);
  const [moves, setMoves] = useState(0);
  const [coins, setCoins] = useState<Set<string>>(() => new Set(COIN_KEYS));
  const [score, setScore] = useState(0);
  const [demoIndex, setDemoIndex] = useState(0);
  const [blink, setBlink] = useState(true);
  const boardRef = useRef<HTMLDivElement>(null);

  const displayName = useMemo(() => {
    const trimmed = playerName.trim();
    return trimmed.length > 0 ? trimmed.split(/\s+/)[0] : "PLAYER";
  }, [playerName]);

  const demoPos = DEMO_PATH[demoIndex] ?? START;

  useEffect(() => {
    if (phase !== "attract") return;
    const blinkId = window.setInterval(() => setBlink((b) => !b), 500);
    const moveId = window.setInterval(() => {
      setDemoIndex((i) => (i + 1) % DEMO_PATH.length);
    }, 280);
    return () => {
      window.clearInterval(blinkId);
      window.clearInterval(moveId);
    };
  }, [phase]);

  const resetBoard = () => {
    setPos(START);
    setMoves(0);
    setCoins(new Set(COIN_KEYS));
    setScore(0);
  };

  const tryMove = useCallback(
    (dr: number, dc: number) => {
      setPos((current) => {
        const next = { r: current.r + dr, c: current.c + dc };
        const cell = MAZE[next.r]?.[next.c];
        if (cell === undefined || cell === 1) {
          beep(120, 40);
          return current;
        }
        setMoves((m) => m + 1);
        const key = `${next.r},${next.c}`;
        setCoins((prev) => {
          if (!prev.has(key)) return prev;
          const nextSet = new Set(prev);
          nextSet.delete(key);
          setScore((s) => s + 100);
          beep(660, 50);
          return nextSet;
        });
        if (cell === 3) {
          beep(880, 120);
          setTimeout(() => {
            beep(1100, 160);
            setPhase("win");
          }, 140);
        } else {
          beep(320, 35);
        }
        return next;
      });
    },
    [],
  );

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
    resetBoard();
    setPhase("play");
    beep(440, 80);
    boardRef.current?.focus();
  };

  const whatsappHref = `${content.contact.whatsapp}?text=${encodeURIComponent(
    `Hey Mohamed, I'm ${displayName}. I cleared FIND THE BUILDER. Let's create something bigger.`,
  )}`;

  const renderCell = (r: number, c: number, player: Pos, interactive: boolean) => {
    const cell = MAZE[r][c];
    const isPlayer = player.r === r && player.c === c;
    const isGoal = cell === 3;
    const isWall = cell === 1;
    const coinKey = `${r},${c}`;
    const hasCoin = interactive ? coins.has(coinKey) : cell === 4 && !isPlayer;

    let cls = "arcade-cell";
    if (isWall) cls += " arcade-wall";
    else if (isGoal) cls += " arcade-goal";
    else cls += " arcade-path";
    if (isPlayer) cls += " arcade-player";

    return (
      <div
        key={`${r}-${c}`}
        className={cls}
        role="gridcell"
        aria-label={isPlayer ? "You" : isGoal ? "Mohamed" : isWall ? "Wall" : hasCoin ? "Coin" : "Path"}
      >
        {isPlayer && <span className="arcade-sprite">{displayName.slice(0, 1).toUpperCase()}</span>}
        {!isPlayer && isGoal && <span className="arcade-sprite goal">M</span>}
        {!isPlayer && hasCoin && <span className="arcade-coin">●</span>}
      </div>
    );
  };

  const board = (player: Pos, interactive: boolean) => (
    <div
      className="arcade-board"
      style={{ gridTemplateColumns: `repeat(${MAZE[0].length}, minmax(0, 1fr))` }}
      role="grid"
      aria-label="Arcade maze"
      ref={interactive ? boardRef : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {MAZE.map((row, r) => row.map((_, c) => renderCell(r, c, player, interactive)))}
    </div>
  );

  return (
    <section id="play" className="border-t border-line bg-ink py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="section-label reveal">Arcade</p>
        <h2 className="reveal mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Find the builder
        </h2>
        <p className="reveal mt-3 max-w-2xl text-mist">
          Insert your name. Clear the maze. Reach Mohamed. Winner gets a real build conversation.
        </p>

        <div className="arcade-cabinet reveal mt-10">
          <div className="arcade-marquee">
            <span>★ FIND THE BUILDER ★ HIGH SCORE 9999 ★ INSERT NAME TO PLAY ★</span>
          </div>

          <div className="arcade-screen">
            <div className="arcade-hud">
              <span>1P {String(score).padStart(4, "0")}</span>
              <span className="arcade-title-chip">FTB-01</span>
              <span>COINS {interactiveCoinCount(phase, coins)}</span>
            </div>

            {phase === "attract" && (
              <div className="arcade-attract">
                <div className="arcade-preview-wrap">
                  <p className="arcade-preview-label">LIVE PREVIEW</p>
                  {board(demoPos, false)}
                  <div className="arcade-preview-caption">
                    <span>YOU</span>
                    <span className="arcade-arrow">→</span>
                    <span>MAZE</span>
                    <span className="arcade-arrow">→</span>
                    <span className="text-amber">MOHAMED</span>
                  </div>
                </div>
                <div className="arcade-attract-copy">
                  <p className={`arcade-blink ${blink ? "on" : "off"}`}>PRESS START</p>
                  <p className="arcade-tagline">
                    Can you reach the builder who ships CRMs for real?
                  </p>
                  <ul className="arcade-bullets">
                    <li>Grab coins for score</li>
                    <li>Beat the maze to unlock contact</li>
                    <li>Win line: let&apos;s create something bigger</li>
                  </ul>
                  <button type="button" className="arcade-start-btn" onClick={() => setPhase("insert")}>
                    ▶ INSERT COIN
                  </button>
                </div>
              </div>
            )}

            {phase === "insert" && (
              <div className="arcade-insert">
                <p className="arcade-insert-title">PLAYER NAME</p>
                <input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") startGame();
                  }}
                  placeholder="TYPE NAME"
                  maxLength={12}
                  className="arcade-input"
                  autoFocus
                />
                <button type="button" className="arcade-start-btn" onClick={startGame}>
                  ▶ START GAME
                </button>
                <button type="button" className="arcade-ghost-btn" onClick={() => setPhase("attract")}>
                  BACK TO DEMO
                </button>
              </div>
            )}

            {phase === "play" && (
              <div className="arcade-play">
                <div className="arcade-play-meta">
                  <span>RUNNER {displayName}</span>
                  <span>MOVES {moves}</span>
                </div>
                {board(pos, true)}
                <div className="arcade-pad sm:hidden">
                  <button type="button" className="pad-btn" onClick={() => tryMove(-1, 0)}>
                    ↑
                  </button>
                  <div className="arcade-pad-row">
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
                <p className="arcade-hint hidden sm:block">ARROWS / WASD TO MOVE</p>
              </div>
            )}

            {phase === "win" && (
              <div className="arcade-win">
                <p className="arcade-win-banner">STAGE CLEAR</p>
                <h3 className="arcade-win-title">
                  {displayName}, YOU FOUND THE BUILDER
                </h3>
                <p className="arcade-win-score">
                  SCORE {score} · MOVES {moves} · COINS {COIN_KEYS.length - coins.size}/{COIN_KEYS.length}
                </p>
                <p className="arcade-win-copy">
                  Mohamed is the one who gets the work shipped. Now let&apos;s create something bigger
                  together.
                </p>
                <div className="arcade-win-actions">
                  <a href={whatsappHref} className="arcade-start-btn" target="_blank" rel="noopener noreferrer">
                    ▶ LET&apos;S BUILD
                  </a>
                  <a href={`mailto:${content.contact.email}`} className="arcade-ghost-btn">
                    EMAIL MOHAMED
                  </a>
                  <button
                    type="button"
                    className="arcade-ghost-btn"
                    onClick={() => {
                      resetBoard();
                      setPhase("attract");
                    }}
                  >
                    PLAY AGAIN
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="arcade-controls-bar">
            <span>A / ←</span>
            <span>W / ↑</span>
            <span>S / ↓</span>
            <span>D / →</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function interactiveCoinCount(phase: Phase, coins: Set<string>) {
  if (phase === "attract" || phase === "insert") return String(COIN_KEYS.length).padStart(2, "0");
  return String(coins.size).padStart(2, "0");
}
