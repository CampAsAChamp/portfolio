import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      components: path.resolve(__dirname, './src/components'),
      assets: path.resolve(__dirname, './src/assets'),
      data: path.resolve(__dirname, './src/data'),
      styles: path.resolve(__dirname, './src/styles'),
      hooks: path.resolve(__dirname, './src/hooks'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/test-utils.jsx',
    include: ['tests/**/*.{test,spec}.{js,jsx}'],
    css: true,
  },
})
