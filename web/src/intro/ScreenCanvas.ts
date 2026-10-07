import { CanvasTexture, SRGBColorSpace } from "three";

const W = 1024;
const H = 664;

type Tok = [string, string];

const C = {
  kw: "#ff4fa3",
  fn: "#46e3ff",
  str: "#ffe14d",
  cm: "#7d76a8",
  tx: "#efe9ff",
  num: "#b98cff",
};

const CODE: Tok[][] = [
  [["# crm/models.py", C.cm]],
  [["class ", C.kw], ["Deal", C.fn], ["(models.Model):", C.tx]],
  [["    company ", C.tx], ["= ", C.kw], ["models.ForeignKey(Company)", C.tx]],
  [["    stage   ", C.tx], ["= ", C.kw], ["models.CharField(choices=Stage)", C.tx]],
  [["    value   ", C.tx], ["= ", C.kw], ["models.DecimalField(", C.tx], ["12", C.num], [")", C.tx]],
  [["    owner   ", C.tx], ["= ", C.kw], ["models.ForeignKey(Member)", C.tx]],
  [["", C.tx]],
  [["    def ", C.kw], ["advance", C.fn], ["(self):", C.tx]],
  [["        self", C.kw], [".stage = self.stage.next()", C.tx]],
  [["        self", C.kw], [".save()  ", C.tx], ["# webhook -> n8n", C.cm]],
  [["", C.tx]],
  [["$ ", C.str], ["git push origin main", C.tx]],
  [["  deployed to production ", C.tx], ["OK", C.str]],
];

const TOTAL_CHARS = CODE.reduce((n, line) => n + line.reduce((m, [s]) => m + s.length, 0) + 1, 0);

export class ScreenCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: CanvasTexture;
  private lastKey = "";

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = W;
    this.canvas.height = H;
    this.ctx = this.canvas.getContext("2d")!;
    this.texture = new CanvasTexture(this.canvas);
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.anisotropy = 4;
  }

  /** portal: 0 = code editor, 1 = full comic burst. Redraws at most 12x per second. */
  draw(time: number, portal: number) {
    const tq = Math.floor(time * 12);
    const key = `${tq}|${portal.toFixed(2)}`;
    if (key === this.lastKey) return;
    this.lastKey = key;

    const { ctx } = this;
    this.drawEditor(time);
    if (portal > 0.001) this.drawPortal(time, portal);
    ctx.restore();
    this.texture.needsUpdate = true;
  }

  private drawEditor(time: number) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = "#0e0b1c";
    ctx.fillRect(0, 0, W, H);

    // window chrome
    ctx.fillStyle = "#181332";
    ctx.fillRect(0, 0, W, 54);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(30 + i * 26, 27, 8, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#241d4a";
    ctx.fillRect(130, 10, 210, 44);
    ctx.fillStyle = "#efe9ff";
    ctx.font = "600 20px 'Space Mono', ui-monospace, monospace";
    ctx.fillText("models.py", 160, 40);
    ctx.fillStyle = "#7d76a8";
    ctx.fillText("views.py", 380, 40);
    ctx.fillText("n8n.json", 520, 40);

    // typing loop: ~11s to write the file, then hold, then restart
    const cycle = 14;
    const t = time % cycle;
    const shown = Math.min(TOTAL_CHARS, Math.floor((t / 11) * TOTAL_CHARS));

    ctx.font = "500 25px 'Space Mono', ui-monospace, monospace";
    let budget = shown;
    let cx = 78;
    let cy = 100;
    CODE.forEach((line, i) => {
      const y = 100 + i * 41;
      ctx.fillStyle = "#4a4372";
      ctx.fillText(String(i + 1).padStart(2, " "), 22, y);
      if (budget <= 0) return;
      let x = 78;
      cx = x;
      cy = y;
      for (const [s, color] of line) {
        if (budget <= 0) break;
        const part = s.slice(0, budget);
        budget -= part.length;
        ctx.fillStyle = color;
        ctx.fillText(part, x, y);
        x += ctx.measureText(part).width;
        cx = x;
      }
      budget -= 1;
    });
    if (Math.floor(time * 2) % 2 === 0) {
      ctx.fillStyle = "#46e3ff";
      ctx.fillRect(cx + 2, cy - 22, 13, 28);
    }
  }

  private drawPortal(time: number, portal: number) {
    const { ctx } = this;
    const cx = W / 2;
    const cy = H / 2;
    const tq = Math.floor(time * 12) / 12;

    ctx.save();
    ctx.globalAlpha = Math.min(1, portal * 1.6);

    // horizontal glitch slices tear the editor apart first
    const slices = 9;
    for (let i = 0; i < slices; i++) {
      const h = H / slices;
      const shift = Math.sin(tq * 37 + i * 12.3) * 60 * portal;
      ctx.drawImage(this.canvas, 0, i * h, W, h, shift, i * h, W, h);
    }

    // speed-line burst
    const colors = ["#ff2a6d", "#05d9e8", "#ffe14d", "#7b2cff"];
    const rays = 48;
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * Math.PI * 2 + tq * 0.4;
      const a2 = a + (Math.PI * 2) / rays / 1.7;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * 1400, cy + Math.sin(a) * 1400);
      ctx.lineTo(cx + Math.cos(a2) * 1400, cy + Math.sin(a2) * 1400);
      ctx.closePath();
      ctx.fill();
    }

    // halftone core
    const coreR = 120 + portal * 320;
    for (let y = -coreR; y <= coreR; y += 14) {
      for (let x = -coreR; x <= coreR; x += 14) {
        const d = Math.hypot(x, y);
        if (d > coreR) continue;
        const r = 6.5 * (1 - d / coreR) + 1;
        ctx.fillStyle = "#0e0b1c";
        ctx.beginPath();
        ctx.arc(cx + x, cy + y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // title in comic lettering
    ctx.globalAlpha = Math.min(1, Math.max(0, (portal - 0.25) * 2));
    ctx.textAlign = "center";
    ctx.font = "120px Bangers, Impact, sans-serif";
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#0e0b1c";
    ctx.lineJoin = "round";
    ctx.strokeText("ENTER", cx + 6, cy + 46);
    ctx.fillStyle = "#ffe14d";
    ctx.fillText("ENTER", cx, cy + 40);
    ctx.restore();
  }

  dispose() {
    this.texture.dispose();
  }
}
