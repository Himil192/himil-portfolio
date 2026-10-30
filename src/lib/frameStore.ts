// Loads the scroll sequence outside React so every player shares one set of frames.
// Frames stay as Image elements: the browser can evict their decoded pixels under memory
// pressure, whereas 240 ImageBitmaps at 1080p would pin about 2 GB.

const COUNTS = { desktop: 240, mobile: 120 } as const;
const KEY_STEP = 8;
const CONCURRENCY = 6;

let set: keyof typeof COUNTS = "desktop";
let frames: (HTMLImageElement | undefined)[] = [];
let started = false;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

export const frameUrl = (name: keyof typeof COUNTS, index: number) =>
  `/frames/${name}/${String(index + 1).padStart(4, "0")}.webp`;

export const frameCount = () => COUNTS[set];

export function subscribeFrames(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

async function loadFrame(index: number) {
  const image = new Image();
  image.src = frameUrl(set, index);
  try {
    await image.decode();
    frames[index] = image;
  } catch {
    // A missing frame falls back to its nearest neighbour at draw time.
  }
}

async function loadAll(indices: number[]) {
  let next = 0;
  const worker = async () => {
    while (next < indices.length) {
      await loadFrame(indices[next++]);
      notify();
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
}

export async function startLoadingFrames() {
  // Read directly: on the first render after hydration the reduced motion hook still reports false.
  if (started || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  started = true;
  set = window.matchMedia("(max-aspect-ratio: 1/1)").matches ? "mobile" : "desktop";
  const total = COUNTS[set];
  frames = new Array(total).fill(undefined);

  const all = Array.from({ length: total }, (_, index) => index);
  // Sparse frames first, so scrubbing works before the full sequence has arrived.
  await loadAll(all.filter((index) => index % KEY_STEP === 0 || index === total - 1));
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return;
  await loadAll(all.filter((index) => !frames[index]));
}

export function nearestFrame(index: number) {
  for (let distance = 0; distance < frames.length; distance++) {
    const frame = frames[index - distance] ?? frames[index + distance];
    if (frame) return frame;
  }
  return undefined;
}
