// Renders the scroll sequence to numbered WebP frames in public/frames.
// Usage: npm run frames            full sequence
//        npm run frames -- --preview    five test frames in .frame-preview
import { createReadStream, existsSync } from "node:fs";
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const preview = process.argv.includes("--preview");

const SETS = [
  { name: "desktop", width: 1920, height: 1080, frames: 240, quality: 72, budgetMb: 40 },
  { name: "mobile", width: 720, height: 1280, frames: 120, quality: 66, budgetMb: 12 },
];

const MIME = { ".html": "text/html", ".js": "text/javascript" };

function serve() {
  const server = createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const file = url.pathname.startsWith("/three/")
      ? path.join(root, "node_modules/three/build", path.basename(url.pathname))
      : path.join(root, "scripts/frame-scene.html");
    if (!existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "content-type": MIME[path.extname(file)] ?? "text/plain" });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, () => resolve(server)));
}

async function renderSet(browser, port, set) {
  const page = await browser.newPage({ viewport: { width: set.width, height: set.height } });
  page.on("pageerror", (error) => console.error(error));
  page.on("console", (message) => {
    if (message.type() === "error") console.error(message.text());
  });
  await page.goto(`http://localhost:${port}/?w=${set.width}&h=${set.height}`);
  await page.waitForFunction(() => window.sceneReady === true, null, { timeout: 60000 });

  const outDir = path.join(root, preview ? ".frame-preview" : "public/frames", set.name);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const indices = preview
    ? [0, 0.3, 0.55, 0.75, 1].map((p) => Math.round(p * (set.frames - 1)))
    : Array.from({ length: set.frames }, (_, i) => i);

  const started = Date.now();
  for (const index of indices) {
    const dataUrl = await page.evaluate((p) => window.renderFrame(p), index / (set.frames - 1));
    const png = Buffer.from(dataUrl.split(",")[1], "base64");
    const name = `${String(index + 1).padStart(4, "0")}.webp`;
    await sharp(png).webp({ quality: set.quality, effort: 5 }).toFile(path.join(outDir, name));
    if ((index + 1) % 20 === 0) console.log(`${set.name}: ${index + 1}/${set.frames}`);
  }
  await page.close();

  let bytes = 0;
  for (const file of await readdir(outDir)) bytes += (await stat(path.join(outDir, file))).size;
  const mb = bytes / 1024 / 1024;
  console.log(
    `${set.name}: ${indices.length} frames, ${mb.toFixed(1)} MB, ${((Date.now() - started) / 1000).toFixed(0)}s`,
  );
  if (!preview && mb > set.budgetMb) {
    console.warn(`${set.name} is over its ${set.budgetMb} MB budget; lower its quality.`);
  }
}

const server = await serve();
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
try {
  for (const set of SETS) await renderSet(browser, server.address().port, set);
} finally {
  await browser.close();
  server.close();
}
