import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "breeze-form-hooks",
      formats: ["es", "umd"],
      fileName: (format) => `breeze-form-hooks.${format}.js`,
    },
    rollupOptions: {
      external: Object.keys(pkg.dependencies),
    },
  },
});
