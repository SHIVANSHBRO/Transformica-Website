import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const ROOT = path.resolve(".");
const targets = [
  // Transformation photos — large displays in dark transformations grid (~640px wide)
  { in: "1.png", out: "1.webp", width: 800 },
  { in: "2.png", out: "2.webp", width: 800 },
  { in: "3.png", out: "3.webp", width: 800 },
  { in: "4.png", out: "4.webp", width: 800 },
  { in: "5.png", out: "5.webp", width: 800 },
  { in: "6.png", out: "6.webp", width: 800 },
  // App UI screenshots — used at maxWidth ~380-420px
  { in: "App Ui 2.png", out: "App Ui 2.webp", width: 800 },
  { in: "Transformica App UI.png", out: "Transformica App UI.webp", width: 800 },
];

let totalBefore = 0;
let totalAfter = 0;

for (const t of targets) {
  const src = path.join(ROOT, t.in);
  const dst = path.join(ROOT, t.out);
  try {
    const before = (await fs.stat(src)).size;
    await sharp(src)
      .resize({ width: t.width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(dst);
    const after = (await fs.stat(dst)).size;
    totalBefore += before;
    totalAfter += after;
    const pct = ((1 - after / before) * 100).toFixed(1);
    console.log(
      `${t.in.padEnd(28)} ${(before / 1024).toFixed(0).padStart(6)} KB → ` +
        `${(after / 1024).toFixed(0).padStart(5)} KB  (-${pct}%)`
    );
  } catch (e) {
    console.error(`Failed for ${t.in}:`, e.message);
  }
}

console.log("─".repeat(60));
console.log(
  `TOTAL: ${(totalBefore / 1024 / 1024).toFixed(2)} MB → ${(totalAfter / 1024 / 1024).toFixed(2)} MB ` +
    `(saved ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)} MB)`
);
