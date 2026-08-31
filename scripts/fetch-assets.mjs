/**
 * Fetch the site's brand images into client/public/manus-storage/ before build.
 *
 * The six /manus-storage/*.png assets referenced by client/src/lib/site.ts were
 * never exported from Manus into this repo — they exist only on the original
 * Manus deployment. This script vendors them into the static output of every
 * build so the deployed site self-hosts them.
 *
 * - A file already present in client/public/manus-storage/ is left untouched
 *   (so committing the real binaries later makes this script a no-op).
 * - A failed download for a missing file FAILS the build — better a loud build
 *   error than silently shipping a site with broken images.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_BASE = "https://rebootblood.manus.space/manus-storage/";

const ASSETS = [
    "logo_mark_b729685e.png",
    "hero_blood_abstract_91aac753.png",
    "plasma_abstract_c523d8bc.png",
    "clinic_interior_13ed0b23.png",
    "cta_band_7f242402.png",
    "eboo_device_real_812e4903.png",
  ];

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "client", "public", "manus-storage");
fs.mkdirSync(outDir, { recursive: true });

let fetched = 0;
let skipped = 0;
const failures = [];

for (const name of ASSETS) {
    const dest = path.join(outDir, name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
          skipped++;
          continue;
    }
    try {
          const res = await fetch(SOURCE_BASE + name, { redirect: "follow" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const buf = Buffer.from(await res.arrayBuffer());
          if (buf.length < 100 || !buf.subarray(0, 4).equals(PNG_MAGIC)) {
                  throw new Error(`response is not a PNG (${buf.length} bytes)`);
          }
          fs.writeFileSync(dest, buf);
          fetched++;
          console.log(`[fetch-assets] downloaded ${name} (${buf.length} bytes)`);
    } catch (err) {
          failures.push(`${name}: ${err instanceof Error ? err.message : String(err)}`);
    }
}

console.log(`[fetch-assets] done — ${fetched} downloaded, ${skipped} already present.`);

if (failures.length > 0) {
    console.error(
          `[fetch-assets] FAILED to obtain ${failures.length} asset(s):\n  - ${failures.join("\n  - ")}\n` +
            "These images are required by the site (see ASSETS in client/src/lib/site.ts).\n" +
            `Either restore access to ${SOURCE_BASE} or commit the PNG files directly to client/public/manus-storage/.`,
        );
    process.exit(1);
}
