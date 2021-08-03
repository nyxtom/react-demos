import { defineConfig } from 'vite'
import eslint from '@rollup/plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      ...eslint({
        include: ['**/**.jsx', '**/**.js'],
        exclude: ['node_modules/**', 'dist/**'],
        configFile: '.eslintrc.json',
        throwOnError: false,
        throwOnWarning: false,
      }),
      enforce: 'pre',
    }
  ],
})
