import {defineConfig} from "tsup";
import {cp} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

export default defineConfig({
  entry: ["index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
  outDir: "dist",
});
