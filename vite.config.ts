import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@components': resolve(__dirname, './components'),
      '@hooks': resolve(__dirname, './hooks'),
      '@store': resolve(__dirname, './store'),
      '@services': resolve(__dirname, './services'),
      '@utils': resolve(__dirname, './utils'),
      '@types': resolve(__dirname, './types'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react'],
        },
      },
    },
    minify: 'esbuild',
    sourcemap: false,
  },
  server: {
    port: 3000,
  },
})