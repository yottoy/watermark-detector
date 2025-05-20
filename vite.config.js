import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    imagetools(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg)$/i,
      includePublic: true,
      logStats: true,
      webp: {
        quality: 80,
        lossless: false,
        effort: 4
      },
      jpg: {
        quality: 80
      },
      png: {
        quality: 80
      },
      gif: {
        optimizationLevel: 7
      }
    })
  ],
  base: '/', // Set to '/' for custom domain or '/watermark-detector/' for GitHub Pages without custom domain
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['./src/utils/characterDetector.js', './src/utils/spacingAnalyzer.js']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
