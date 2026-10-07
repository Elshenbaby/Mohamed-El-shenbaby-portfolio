import { CanvasTexture, SRGBColorSpace } from "three";
import { roundRect } from "./textures";

const W = 1280;
const H = 830;
const MONO = "'Space Mono', ui-monospace, monospace";

type Tok = [string, string];
const C = { kw: "#ff6ab4", fn: "#62e2ff", str: "#ffd866", cm: "#6d6a8a", tx: "#e8e6f5", num: "#b59cff" };

const CODE: Tok[][] = [
  [["# rouh/queue/models.py", C.cm]],
  [["class ", C.kw], ["Lead", C.fn], ["(models.Model):", C.tx]],
  [["    member  ", C.tx], ["= ", C.kw], ["models.ForeignKey(Member)", C.tx]],
  [["    branch  ", C.tx], ["= ", C.kw], ["models.ForeignKey(Branch)", C.tx]],
  [["    stage   ", C.tx], ["= ", C.kw], ["models.CharField(choices=Stage)", C.tx]],
  [["    synced  ", C.tx], ["= ", C.kw], ["models.DateTimeField(auto_now=", C.tx], ["True", C.num], [")", C.tx]],
  [["", C.tx]],
  [["    def ", C.kw], ["advance", C.fn], ["(self, by):", C.tx]],
  [["        self", C.kw], [".stage = self.stage.next()", C.tx]],
  [["        ", C.tx], ["log", C.fn], ["(self, by)  ", C.tx], ["# every change is logged", C.cm]],
  [["        self", C.kw], [".save()", C.tx]],
];
const CODE_CHARS = CODE.reduce((n, l) => n + l.reduce((m, [s]) => m + s.length, 0) + 1, 0);

const DEPLOY: [string, string][] = [
  ["$ git push origin main", "#e8e6f5"],
  ["Enumerating objects: 42, done.", "#8f8cab"],
  ["remote: running tests ......... 128 passed", "#8f8cab"],
  ["remote: migrating database .... OK", "#8f8cab"],
  ["remote: collecting static ..... OK", "#8f8cab"],
  ["remote: restarting gunicorn ... OK", "#8f8cab"],
  ["", ""],
  ["✓ Deployed to production", "#3dff9a"],
  ["  https://rouh.aiesec.org.eg", "#62e2ff"],
];

const PROJECTS = [
  { name: "Rouh", color: "#e8502e" },
  { name: "Dream Day", color: "#e3262f" },
  { name: "Soluo", color: "#2f8cff" },
  { name: "IRIS", color: "#7b5cff" },
  { name: "Global Village", color: "#ff7a1a" },
  { name: "Omar", color: "#ffd23f" },
];

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export class ScreenCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: CanvasTexture;
  /** true while text is appearing, so the keyboard and hands know to type */
  typing = false;
  private last = -1;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = W;
    this.canvas.height = H;
    this.ctx = this.canvas.getContext("2d")!;
    this.texture = new CanvasTexture(this.canvas);
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.anisotropy = 8;
  }

  draw(time: number, p: number) {
    const frame = Math.floor(time * 30);
    if (frame === this.last) return;
    this.last = frame;

    if (p < 0.4) this.editor(time);
    else if (p < 0.58) this.terminal((p - 0.4) / 0.18, time);
    else if (p < 0.76) this.dashboard((p - 0.58) / 0.18, time);
    else this.portal((p - 0.76) / 0.24, time);
    this.texture.needsUpdate = true;
  }

  private chrome(title: string, accent = "#62e2ff") {
    const { ctx } = this;
    ctx.fillStyle = "#0b0a14";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#14121f";
    ctx.fillRect(0, 0, W, 56);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(30 + i * 26, 28, 8, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#9b98b8";
    ctx.font = `600 20px ${MONO}`;
    ctx.textAlign = "center";
    ctx.fillText(title, W / 2, 35);
    ctx.textAlign = "left";
    ctx.fillStyle = accent;
    ctx.fillRect(0, 54, W, 2);
  }

  private editor(time: number) {
    const { ctx } = this;
    this.chrome("models.py — rouh");
    // sidebar
    ctx.fillStyle = "#100e1a";
    ctx.fillRect(0, 56, 220, H - 56);
    ctx.font = `500 19px ${MONO}`;
    ["▾ rouh", "  ▸ accounts", "  ▾ queue", "    models.py", "    views.py", "    sync.py", "  ▸ icomm", "  ▸ kpis"].forEach(
      (t, i) => {
        ctx.fillStyle = t.includes("models") ? "#62e2ff" : "#7d7a99";
        ctx.fillText(t, 18, 98 + i * 34);
      },
    );

    const cycle = 13;
    const t = time % cycle;
    const shown = Math.min(CODE_CHARS, Math.floor((t / 9.5) * CODE_CHARS));
    this.typing = shown < CODE_CHARS;

    ctx.font = `500 25px ${MONO}`;
    let budget = shown;
    let cx = 300;
    let cy = 110;
    CODE.forEach((line, i) => {
      const y = 110 + i * 44;
      ctx.fillStyle = "#3d3a57";
      ctx.fillText(String(i + 1).padStart(2, " "), 244, y);
      if (budget <= 0) return;
      let x = 300;
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
    if (Math.floor(time * 2.2) % 2 === 0) {
      ctx.fillStyle = "#62e2ff";
      ctx.fillRect(cx + 2, cy - 22, 3, 30);
    }

    // status bar
    ctx.fillStyle = "#5b2bd6";
    ctx.fillRect(0, H - 34, W, 34);
    ctx.fillStyle = "#fff";
    ctx.font = `600 17px ${MONO}`;
    ctx.fillText("⎇ main   ✓ 128 tests   Python 3.12   Django 5", 18, H - 11);
  }

  private terminal(k: number, time: number) {
    const { ctx } = this;
    this.chrome("zsh — deploy", "#3dff9a");
    const n = Math.floor(smooth(0, 0.8, k) * DEPLOY.length * 1.0001);
    this.typing = n < DEPLOY.length;
    ctx.font = `500 27px ${MONO}`;
    DEPLOY.slice(0, n).forEach(([t, c], i) => {
      ctx.fillStyle = c;
      ctx.fillText(t, 50, 120 + i * 50);
    });
    if (n >= DEPLOY.length) {
      const pulse = 0.5 + 0.5 * Math.sin(time * 6);
      ctx.strokeStyle = `rgba(61,255,154,${0.3 + pulse * 0.5})`;
      ctx.lineWidth = 3;
      roundRect(ctx, 34, 120 + 6.4 * 50, 640, 104, 10);
      ctx.stroke();
    } else if (Math.floor(time * 2.2) % 2 === 0) {
      ctx.fillStyle = "#3dff9a";
      ctx.fillRect(50, 120 + n * 50 - 24, 14, 30);
    }
  }

  private dashboard(k: number, time: number) {
    const { ctx } = this;
    this.typing = false;
    // browser chrome
    ctx.fillStyle = "#e6e2dd";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#d6d1cb";
    ctx.fillRect(0, 0, W, 62);
    ctx.fillStyle = "#fff";
    roundRect(ctx, 150, 13, W - 300, 36, 18);
    ctx.fill();
    ctx.fillStyle = "#555";
    ctx.font = `500 19px ${MONO}`;
    ctx.fillText("🔒 rouh.aiesec.org.eg", 178, 38);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(30 + i * 26, 31, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // app header
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 62, W, 64);
    ctx.fillStyle = "#e8502e";
    ctx.fillRect(28, 76, 36, 36);
    ctx.fillStyle = "#fff";
    ctx.font = `700 26px Impact, sans-serif`;
    ctx.fillText("ROUH", 78, 104);

    ctx.fillStyle = "#111";
    ctx.font = `700 46px Impact, sans-serif`;
    ctx.fillText("GOOD EVENING, MOHAMED", 40, 200);

    const reveal = smooth(0, 0.6, k);
    const kpis: [string, number, number][] = [
      ["OPEN WORK", 12, 0],
      ["CONTACTED", 18, 20],
      ["APPLIED", 7, 10],
      ["APPROVED", 4, 6],
    ];
    kpis.forEach(([label, v, of], i) => {
      const x = 40 + i * 300;
      const y = 240;
      const dark = i === 0;
      ctx.fillStyle = dark ? "#111" : "#fff";
      ctx.fillRect(x, y, 276, 150);
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, 276, 150);
      ctx.fillStyle = dark ? "#bbb" : "#666";
      ctx.font = `600 17px ${MONO}`;
      ctx.fillText(label, x + 20, y + 36);
      ctx.fillStyle = dark ? "#fff" : "#111";
      ctx.font = `700 58px Impact, sans-serif`;
      const shown = Math.round(v * reveal);
      ctx.fillText(of ? `${shown}/${of}` : String(shown), x + 20, y + 104);
      if (of) {
        ctx.fillStyle = "#eee";
        ctx.fillRect(x + 20, y + 124, 236, 8);
        ctx.fillStyle = "#e8502e";
        ctx.fillRect(x + 20, y + 124, 236 * (shown / of), 8);
      }
    });

    ctx.fillStyle = "#666";
    ctx.font = `600 17px ${MONO}`;
    ctx.fillText("MY QUEUE", 40, 440);
    const rows: [string, string, string][] = [
      ["New sign-up", "NEW", "#e8502e"],
      ["Application received", "APPLIED", "#1fae6b"],
      ["Follow-up call", "CONTACTED", "#777"],
      ["Interview booked", "APPLIED", "#1fae6b"],
    ];
    rows.forEach(([t, tag, col], i) => {
      const y = 470 + i * 70;
      const slide = smooth(0.1 + i * 0.1, 0.4 + i * 0.1, k);
      ctx.globalAlpha = slide;
      ctx.fillStyle = "#fff";
      ctx.fillRect(40 + (1 - slide) * 60, y, W - 80, 58);
      ctx.fillStyle = "#111";
      ctx.font = `500 22px ${MONO}`;
      ctx.fillText(t, 64 + (1 - slide) * 60, y + 37);
      ctx.fillStyle = col;
      ctx.fillRect(W - 220, y + 14, 150, 30);
      ctx.fillStyle = "#fff";
      ctx.font = `700 16px ${MONO}`;
      ctx.fillText(tag, W - 205, y + 35);
    });
    ctx.globalAlpha = 1;

    // live dot
    const blink = Math.sin(time * 5) > 0;
    ctx.fillStyle = blink ? "#e8502e" : "#ffb39d";
    ctx.beginPath();
    ctx.arc(W - 150, 94, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = `700 18px ${MONO}`;
    ctx.fillText("LIVE", W - 132, 100);
  }

  private portal(k: number, time: number) {
    const { ctx } = this;
    this.typing = false;
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.75);
    g.addColorStop(0, "#1a0b2e");
    g.addColorStop(1, "#030208");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const spin = time * 0.6 + k * 6;

    // rings of the portal
    for (let i = 0; i < 14; i++) {
      const rr = 40 + i * 34 + k * 260;
      ctx.strokeStyle = i % 2 ? "rgba(255,42,109,0.55)" : "rgba(5,217,232,0.5)";
      ctx.lineWidth = 3 + (i % 3);
      ctx.setLineDash([30 + i * 4, 18]);
      ctx.lineDashOffset = (i % 2 ? 1 : -1) * time * 120;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rr, rr * 0.92, spin * (i % 2 ? 1 : -1) * 0.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // project worlds orbiting into the vortex
    PROJECTS.forEach((pj, i) => {
      const a = spin + (i / PROJECTS.length) * Math.PI * 2;
      const rad = (300 - k * 260) * (1 + 0.08 * Math.sin(time * 2 + i));
      const x = cx + Math.cos(a) * rad * 1.35;
      const y = cy + Math.sin(a) * rad * 0.8;
      const s = 1 - k * 0.6;
      ctx.globalAlpha = 1 - smooth(0.7, 1, k);
      ctx.fillStyle = pj.color;
      ctx.beginPath();
      ctx.arc(x, y, 34 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = `700 ${Math.round(20 * s + 6)}px ${MONO}`;
      ctx.textAlign = "center";
      ctx.fillText(pj.name, x, y + 62 * s);
    });
    ctx.globalAlpha = 1;

    // core
    const core = 30 + k * 420;
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, core);
    cg.addColorStop(0, "rgba(255,255,255,1)");
    cg.addColorStop(0.35, "rgba(5,217,232,0.9)");
    cg.addColorStop(1, "rgba(255,42,109,0)");
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(cx, cy, core, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = "center";
    ctx.globalAlpha = 1 - smooth(0.5, 0.85, k);
    ctx.fillStyle = "#fff";
    ctx.font = `700 22px ${MONO}`;
    ctx.fillText("6 UNIVERSES FOUND", cx, 120);
    ctx.font = "88px Bangers, Impact, sans-serif";
    ctx.fillText("ENTER THE MULTIVERSE", cx, H - 150);
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
  }

  dispose() {
    this.texture.dispose();
  }
}
