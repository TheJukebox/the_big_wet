import { defineConfig } from "vite";

export default defineConfig({
 build: {
   sourcemap: true,
   rollupOptions: {
     input: "module/system.ts",
     output: {
       dir: "dist",
       entryFileNames: "system.js",
       format: "es",
     },
   },
 }
});
