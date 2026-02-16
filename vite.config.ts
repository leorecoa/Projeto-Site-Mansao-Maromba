/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@hooks': path.resolve(__dirname, './hooks'),
      '@components': path.resolve(__dirname, './components'),
      '@lib': path.resolve(__dirname, './lib'),
      '@store': path.resolve(__dirname, './store'),
      '@types': path.resolve(__dirname, './types'),
      '@utils': path.resolve(__dirname, './utils'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})