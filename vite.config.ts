import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@components': path.resolve(__dirname, './components'),
      '@hooks': path.resolve(__dirname, './hooks'),
      '@store': path.resolve(__dirname, './store'),
      '@services': path.resolve(__dirname, './services'),
      '@utils': path.resolve(__dirname, './utils'),
      '@types': path.resolve(__dirname, './types'),
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
    port: 3001,
  },
})