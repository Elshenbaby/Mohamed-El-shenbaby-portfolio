import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

export type PhoneMessage = { app: string; text: string };

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

function finish(c: HTMLCanvasElement, srgb = true) {
  const tex = new CanvasTexture(c);
  if (srgb) tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Walnut desk top: long grain streaks with darker knots. */
export function makeWoodTexture() {
  const W = 1024;
  const H = 512;
  const [c, ctx] = canvas(W, H);
  const r = rand(11);
  ctx.fillStyle = "#3b2416";
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 260; i++) {
    const y = r() * H;
    const amp = 2 + r() * 8;
    const freq = 0.004 + r() * 0.01;
    const phase = r() * 10;
    ctx.strokeStyle = r() > 0.5 ? `rgba(20,10,5,${0.15 + r() * 0.25})` : `rgba(120,78,46,${0.08 + r() * 0.18})`;
    ctx.lineWidth = 0.6 + r() * 2.2;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 8) {
      const yy = y + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 3.1) * amp * 0.3;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  for (let k = 0; k < 3; k++) {
    const kx = r() * W;
    const ky = r() * H;
    for (let i = 0; i < 14; i++) {
      ctx.strokeStyle = `rgba(25,12,6,${0.25 - i * 0.015})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(kx, ky, 6 + i * 5, 2 + i * 1.6, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  const tex = finish(c);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  return tex;
}

/** Cairo at night in the rain: towers, domes, minarets, the tower, lit flats. */
export function makeCityTexture() {
  const W = 2048;
  const H = 1024;
  const [c, ctx] = canvas(W, H);
  const r = rand(7);

  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#030308");
  sky.addColorStop(0.5, "#0b0a1f");
  sky.addColorStop(0.8, "#2a0f2e");
  sky.addColorStop(1, "#4a1630");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // low clouds lit from below by the city
  for (let i = 0; i < 40; i++) {
    const g = ctx.createRadialGradient(r() * W, H * (0.3 + r() * 0.3), 0, r() * W, H * 0.45, 260);
    g.addColorStop(0, "rgba(90,30,70,0.18)");
    g.addColorStop(1, "rgba(90,30,70,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  const layer = (color: string, minH: number, maxH: number, seed: number, lit: number) => {
    const rr = rand(seed);
    let x = -30;
    while (x < W) {
      const w = 50 + rr() * 130;
      const h = minH + rr() * (maxH - minH);
      ctx.fillStyle = color;
      ctx.fillRect(x, H - h, w, h);
      if (rr() > 0.7) {
        ctx.beginPath();
        ctx.arc(x + w / 2, H - h, w * 0.3, Math.PI, 0);
        ctx.fill();
      }
      if (rr() > 0.82) {
        const mx = x + w - 14;
        ctx.fillRect(mx, H - h - 170, 14, 170);
        ctx.beginPath();
        ctx.moveTo(mx - 4, H - h - 170);
        ctx.lineTo(mx + 7, H - h - 215);
        ctx.lineTo(mx + 18, H - h - 170);
        ctx.fill();
      }
      for (let wy = H - h + 16; wy < H - 8; wy += 20) {
        for (let wx = x + 8; wx < x + w - 10; wx += 16) {
          if (rr() < lit) {
            const warm = rr();
            ctx.fillStyle =
              warm > 0.85 ? "rgba(120,220,255,0.9)" : warm > 0.4 ? "rgba(255,196,110,0.85)" : "rgba(255,230,180,0.55)";
            ctx.fillRect(wx, wy, 8, 10);
          }
        }
      }
      x += w + 3;
    }
  };

  layer("#0d0b1d", 260, 520, 3, 0.12);

  // Cairo Tower
  ctx.fillStyle = "#0d0b1d";
  ctx.beginPath();
  ctx.moveTo(612, H);
  ctx.lineTo(630, H - 660);
  ctx.lineTo(654, H - 660);
  ctx.lineTo(672, H);
  ctx.fill();
  ctx.fillRect(600, H - 715, 84, 60);
  ctx.fillRect(637, H - 790, 10, 80);

  layer("#07060f", 120, 330, 9, 0.22);

  // neon shop signs at street level
  const signs = ["#ff2a6d", "#05d9e8", "#ffcf3a", "#9b5cff"];
  for (let i = 0; i < 14; i++) {
    ctx.fillStyle = signs[i % 4];
    ctx.globalAlpha = 0.85;
    ctx.fillRect(r() * W, H - 40 - r() * 70, 30 + r() * 60, 6);
  }
  ctx.globalAlpha = 1;

  // wet street haze
  const haze = ctx.createLinearGradient(0, H - 140, 0, H);
  haze.addColorStop(0, "rgba(255,90,140,0)");
  haze.addColorStop(1, "rgba(255,90,140,0.22)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, H - 140, W, 140);

  return finish(c);
}

/** Glowing neon tube lettering for the wall. */
export function makeNeonTexture(text: string, color: string) {
  const W = 1024;
  const H = 320;
  const [c, ctx] = canvas(W, H);
  ctx.clearRect(0, 0, W, H);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "italic 190px Bangers, Impact, sans-serif";
  ctx.lineJoin = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = 40;
  ctx.strokeStyle = color;
  ctx.lineWidth = 12;
  ctx.strokeText(text, W / 2, H / 2);
  ctx.shadowBlur = 12;
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#fff";
  ctx.strokeText(text, W / 2, H / 2);
  return finish(c);
}

/** Phone lock screen with one incoming notification. */
export class PhoneScreen {
  private canvas = Object.assign(document.createElement("canvas"), { width: 320, height: 640 });
  texture = new CanvasTexture(this.canvas);

  constructor() {
    this.texture.colorSpace = SRGBColorSpace;
  }

  show(msg: PhoneMessage) {
    drawPhoneScreen(this.canvas.getContext("2d")!, this.canvas.width, this.canvas.height, msg);
    this.texture.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
  }
}

function drawPhoneScreen(ctx: CanvasRenderingContext2D, w: number, h: number, msg: PhoneMessage) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#1b1036");
  g.addColorStop(1, "#05040c");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.font = "600 64px 'Space Mono', monospace";
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  ctx.fillText(`${hh}:${mm}`, w / 2, 110);
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  roundRect(ctx, 16, 160, w - 32, 120, 18);
  ctx.fill();
  ctx.textAlign = "left";
  ctx.fillStyle = "#25d366";
  ctx.font = "700 20px 'Space Mono', monospace";
  ctx.fillText(msg.app, 34, 196);
  ctx.fillStyle = "#fff";
  ctx.font = "500 20px 'Space Mono', monospace";
  wrap(ctx, msg.text, 34, 230, w - 68, 26);
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, lh: number) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > max && line) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lh;
    } else line = test;
  }
  ctx.fillText(line, x, yy);
}
