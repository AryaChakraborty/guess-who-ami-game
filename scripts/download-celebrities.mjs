// Downloads all celebrity images from Wikimedia to public/celebrities/<id>.jpg
// and rewrites lib/celebrities.ts to use the local paths.
//
// Wikimedia requires a descriptive User-Agent — without one, they 429 you.
// See https://meta.wikimedia.org/wiki/User-Agent_policy

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CELEB_FILE = path.join(ROOT, "lib/celebrities.ts");
const OUT_DIR = path.join(ROOT, "public/celebrities");

// Wikimedia requires a contactable UA per their policy.
// A short app name with a contact email works; browser-style UAs get 429'd.
const UA = "CelebrityHeadGame/1.0 contact-aryachakraborty2002@gmail.com";

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const source = await fs.readFile(CELEB_FILE, "utf-8");

  // Match each { id: N, ... image: "URL" } block
  const entryRegex =
    /\{\s*id:\s*(\d+),[\s\S]*?image:\s*"([^"]+)"/g;

  const entries = [];
  let m;
  while ((m = entryRegex.exec(source)) !== null) {
    entries.push({ id: parseInt(m[1], 10), url: m[2] });
  }
  console.log(`Found ${entries.length} celebrity entries.`);

  let replaced = source;
  let failed = 0;
  let succeeded = 0;

  for (const { id, url } of entries) {
    const localPath = `/celebrities/${id}.jpg`;
    const filePath = path.join(OUT_DIR, `${id}.jpg`);

    // Skip if already downloaded
    let needsDownload = true;
    try {
      const stat = await fs.stat(filePath);
      if (stat.size > 1000) needsDownload = false;
    } catch {
      /* not exists */
    }

    if (needsDownload) {
      // Retry on 429 using the retry-after header (up to 3 attempts)
      let attempts = 0;
      let done = false;
      while (attempts < 3 && !done) {
        attempts++;
        try {
          const res = await fetch(url, { headers: { "User-Agent": UA } });
          if (res.status === 429) {
            const retryAfter = parseInt(res.headers.get("retry-after") || "60", 10);
            console.warn(`  [${id}] 429 — sleeping ${retryAfter}s (attempt ${attempts}/3)`);
            await new Promise((r) => setTimeout(r, (retryAfter + 5) * 1000));
            continue;
          }
          if (!res.ok) {
            console.error(`  [${id}] HTTP ${res.status} ${res.statusText}`);
            failed++;
            break;
          }
          const buf = Buffer.from(await res.arrayBuffer());
          if (buf.length < 1000) {
            console.error(`  [${id}] suspiciously small (${buf.length}B)`);
            failed++;
            break;
          }
          await fs.writeFile(filePath, buf);
          console.log(`  [${id}] ✓ ${(buf.length / 1024).toFixed(1)}KB`);
          succeeded++;
          done = true;
        } catch (err) {
          console.error(`  [${id}] error:`, err.message);
          failed++;
          break;
        }
      }
      if (!done && attempts >= 3) {
        console.error(`  [${id}] gave up after ${attempts} attempts`);
        failed++;
      }
      // Polite delay to not trip Wikimedia's rate limiter
      await new Promise((r) => setTimeout(r, 2000));
    } else {
      console.log(`  [${id}] already downloaded, skipping`);
      succeeded++;
    }

    // Rewrite the URL in the source
    const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
      `(id:\\s*${id},[\\s\\S]*?image:\\s*")${escaped}(")`,
      ""
    );
    replaced = replaced.replace(pattern, `$1${localPath}$2`);
  }

  await fs.writeFile(CELEB_FILE, replaced);
  console.log(
    `\nDone. ${succeeded} downloaded, ${failed} failed. lib/celebrities.ts rewritten.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
