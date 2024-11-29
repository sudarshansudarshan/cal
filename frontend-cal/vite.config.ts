import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { viteStaticCopy } from "vite-plugin-static-copy"
 
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
  },

  plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js',
            dest: './'
          },
          {
            src: 'node_modules/@ricky0123/vad-web/dist/silero_vad.onnx',
            dest: './'
          },
          {
            src: 'node_modules/onnxruntime-web/dist/*.wasm',
            dest: './'
          }
        ]
      })],
      optimizeDeps: {
        exclude: ['onnxruntime-web' ,'ort-wasm-simd-threaded'], // Exclude the problematic module
      },
})