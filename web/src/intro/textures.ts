import { CanvasTexture, SRGBColorSpace } from "three";

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

function finish(c: HTMLCanvasElement) {
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function halftoneDisc(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, step: number, color: string) {
  ctx.fillStyle = color;
  for (let y = -r; y <= r; y += step) {
    for (let x = -r; x <= r; x += step) {
      const d = Math.hypot(x, y);
      if (d > r) continue;
      ctx.beginPath();
      ctx.arc(cx + x, cy + y, (step / 2) * (1 - d / r) + 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** Cairo at night through the window: domes, minarets, the tower, lit flats. */
export function makeCityTexture() {
  const W = 1024;
  const H = 680;
  const [c, ctx] = canvas(W, H);
  const r = rand(7);

  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#0d0a24");
  sky.addColorStop(0.55, "#3a1460");
  sky.addColorStop(0.85, "#b0236e");
  sky.addColorStop(1, "#ff5e7e");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 140; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.7})`;
    ctx.fillRect(r() * W, r() * H * 0.55, 2, 2);
  }

  // moon with a comic halftone shadow
  ctx.fillStyle = "#fff4d6";
  ctx.beginPath();
  ctx.arc(780, 150, 70, 0, Math.PI * 2);
  ctx.fill();
  halftoneDisc(ctx, 805, 165, 62, 9, "rgba(176,35,110,0.55)");

  const back = "#24123f";
  const front = "#120a24";

  // far skyline
  ctx.fillStyle = back;
  let x = 0;
  while (x < W) {
    const w = 40 + r() * 70;
    const h = 120 + r() * 170;
    ctx.fillRect(x, H - h, w, h);
    x += w - 4;
  }

  // Cairo Tower: lattice shaft with a flared crown
  ctx.fillStyle = back;
  ctx.beginPath();
  ctx.moveTo(312, H);
  ctx.lineTo(322, H - 420);
  ctx.lineTo(338, H - 420);
  ctx.lineTo(348, H);
  ctx.fill();
  ctx.fillRect(306, H - 455, 48, 38);
  ctx.fillRect(326, H - 500, 8, 50);
  ctx.fillStyle = "#ff2a6d";
  ctx.fillRect(328, H - 504, 4, 6);

  // near skyline with domes and minarets
  ctx.fillStyle = front;
  x = -20;
  while (x < W) {
    const w = 60 + r() * 90;
    const h = 60 + r() * 120;
    ctx.fillRect(x, H - h, w, h);
    if (r() > 0.6) {
      ctx.beginPath();
      ctx.arc(x + w / 2, H - h, w * 0.32, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(x + w / 2 - 2, H - h - w * 0.32 - 22, 4, 24);
    }
    if (r() > 0.75) {
      const mx = x + w - 10;
      ctx.fillRect(mx, H - h - 120, 12, 120);
      ctx.beginPath();
      ctx.moveTo(mx - 3, H - h - 120);
      ctx.lineTo(mx + 6, H - h - 150);
      ctx.lineTo(mx + 15, H - h - 120);
      ctx.fill();
    }
    // lit windows
    for (let wy = H - h + 14; wy < H - 10; wy += 18) {
      for (let wx = x + 8; wx < x + w - 10; wx += 15) {
        if (r() > 0.72) {
          ctx.fillStyle = r() > 0.8 ? "#05d9e8" : "#ffd36b";
          ctx.fillRect(wx, wy, 7, 9);
          ctx.fillStyle = front;
        }
      }
    }
    x += w + 2;
  }

  return finish(c);
}

export function makePosterTexture(kind: "ship" | "beck") {
  const W = 512;
  const H = 720;
  const [c, ctx] = canvas(W, H);

  if (kind === "ship") {
    ctx.fillStyle = "#ffe14d";
    ctx.fillRect(0, 0, W, H);
    const rays = 28;
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * Math.PI * 2;
      ctx.fillStyle = i % 2 ? "#ffcc1a" : "#ffe14d";
      ctx.beginPath();
      ctx.moveTo(W / 2, H / 2);
      ctx.lineTo(W / 2 + Math.cos(a) * 900, H / 2 + Math.sin(a) * 900);
      ctx.lineTo(W / 2 + Math.cos(a + 0.11) * 900, H / 2 + Math.sin(a + 0.11) * 900);
      ctx.fill();
    }
    halftoneDisc(ctx, W / 2, H / 2, 200, 14, "rgba(255,42,109,0.55)");
    ctx.textAlign = "center";
    ctx.lineJoin = "round";
    ctx.font = "170px Bangers, Impact, sans-serif";
    ctx.lineWidth = 18;
    ctx.strokeStyle = "#0b0816";
    ctx.strokeText("SHIP", W / 2, 330);
    ctx.strokeText("IT.", W / 2, 490);
    ctx.fillStyle = "#ff2a6d";
    ctx.fillText("SHIP", W / 2, 330);
    ctx.fillText("IT.", W / 2, 490);
  } else {
    ctx.fillStyle = "#14102b";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#05d9e8";
    ctx.lineWidth = 10;
    ctx.strokeRect(24, 24, W - 48, H - 48);
    ctx.textAlign = "left";
    ctx.font = "78px Bangers, Impact, sans-serif";
    const lines: [string, string][] = [
      ["MAKE IT", "#efe9ff"],
      ["WORK.", "#05d9e8"],
      ["MAKE IT", "#efe9ff"],
      ["RIGHT.", "#ff2a6d"],
      ["MAKE IT", "#efe9ff"],
      ["FAST.", "#ffe14d"],
    ];
    lines.forEach(([t, col], i) => {
      ctx.fillStyle = col;
      ctx.fillText(t, 60, 140 + i * 88);
    });
  }

  return finish(c);
}
