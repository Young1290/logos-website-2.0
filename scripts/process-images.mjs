import sharp from "sharp";
import { rename } from "fs/promises";
import path from "path";

const imgDir = new URL("../image/", import.meta.url).pathname.slice(1);

async function trimWhiteBorder(inputPath, outputPath) {
  // Trim white border by finding content bounds
  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const isWhite = (idx) => {
    return data[idx] > 240 && data[idx + 1] > 240 && data[idx + 2] > 240;
  };

  let top = 0, bottom = height - 1, left = 0, right = width - 1;

  // Find top bound
  outer: for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      if (!isWhite(idx)) { top = Math.max(0, y - 8); break outer; }
    }
  }
  // Find bottom bound
  outer: for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      if (!isWhite(idx)) { bottom = Math.min(height - 1, y + 8); break outer; }
    }
  }
  // Find left bound
  outer: for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * channels;
      if (!isWhite(idx)) { left = Math.max(0, x - 8); break outer; }
    }
  }
  // Find right bound
  outer: for (let x = width - 1; x >= 0; x--) {
    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * channels;
      if (!isWhite(idx)) { right = Math.min(width - 1, x + 8); break outer; }
    }
  }

  const cropWidth = right - left;
  const cropHeight = bottom - top;

  console.log(`  Trim: ${width}x${height} → ${cropWidth}x${cropHeight} (cut ${left}px left, ${top}px top)`);

  const tmp = outputPath + ".tmp.jpg";
  await sharp(inputPath)
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(tmp);
  await rename(tmp, outputPath);
}

async function processFounderPortrait(inputPath, outputPath, focusY = 0.25) {
  const meta = await sharp(inputPath).metadata();
  const { width, height } = meta;

  // Target 3:4 portrait crop, focused on upper portion (face)
  const targetW = width;
  const targetH = Math.round(width * (4 / 3));

  // If image is already taller than needed, crop from focusY point
  if (height > targetH) {
    const cropTop = Math.round(height * focusY - targetH * 0.35);
    const safeTop = Math.max(0, Math.min(cropTop, height - targetH));

    console.log(`  Portrait crop: ${width}x${height} → ${targetW}x${targetH} (top=${safeTop})`);

    const tmp = outputPath + ".tmp.jpg";
    await sharp(inputPath)
      .extract({ left: 0, top: safeTop, width: targetW, height: Math.min(targetH, height - safeTop) })
      .resize(800, 1067, { fit: "cover", position: "top" })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(tmp);
    await rename(tmp, outputPath);
  } else {
    const tmp = outputPath + ".tmp.jpg";
    await sharp(inputPath)
      .resize(800, 1067, { fit: "cover", position: "top" })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(tmp);
    await rename(tmp, outputPath);
  }
}

async function optimizeImage(inputPath, outputPath, options = {}) {
  const meta = await sharp(inputPath).metadata();
  const ext = path.extname(inputPath).toLowerCase();

  let pipeline = sharp(inputPath);
  if (options.resize) pipeline = pipeline.resize(options.resize.w, options.resize.h, { fit: "inside", withoutEnlargement: true });

  const tmp = outputPath + ".tmp" + ext;
  if (ext === ".jpg" || ext === ".jpeg") {
    await pipeline.jpeg({ quality: 92, mozjpeg: true }).toFile(tmp);
  } else if (ext === ".png") {
    await pipeline.png({ compressionLevel: 8, palette: false }).toFile(tmp);
  }
  await rename(tmp, outputPath);

  const inMeta = await sharp(inputPath).metadata();
  const outMeta = await sharp(outputPath).metadata();
  console.log(`  ${path.basename(inputPath)}: ${inMeta.width}x${inMeta.height} → ${outMeta.width}x${outMeta.height}`);
}

async function main() {
  console.log("=== Processing Chin Hsien (trim white border) ===");
  await trimWhiteBorder(
    `${imgDir}Chin Hsien.jpg`,
    `${imgDir}Chin Hsien.jpg`
  );

  console.log("\n=== Processing Lim Gin Young (portrait crop) ===");
  await processFounderPortrait(
    `${imgDir}young.jpg`,
    `${imgDir}young.jpg`,
    0.22  // focus 22% from top (face area for profile shot)
  );

  console.log("\n=== Optimizing LDE illustration ===");
  await optimizeImage(
    `${imgDir}LDE.jpg`,
    `${imgDir}LDE.jpg`,
    { resize: { w: 1400, h: 1400 } }
  );

  console.log("\n=== Optimizing product screenshots ===");
  await optimizeImage(
    `${imgDir}Main Aequitas.png`,
    `${imgDir}Main Aequitas.png`,
    { resize: { w: 1600, h: 1600 } }
  );
  await optimizeImage(
    `${imgDir}SPA creation.png`,
    `${imgDir}SPA creation.png`,
    { resize: { w: 1400, h: 1400 } }
  );
  await optimizeImage(
    `${imgDir}CheckApproval.png`,
    `${imgDir}CheckApproval.png`,
    { resize: { w: 1400, h: 1400 } }
  );

  console.log("\nDone!");
}

main().catch(console.error);
