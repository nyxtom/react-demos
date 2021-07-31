import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import eslint from '@rollup/plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      ...eslint({
        include: ['**/**.jsx', '**/**.js'],
        exclude: ['node_modules/**', 'dist/**'],
        configFile: '.eslintrc.json',
        throwOnError: true,
        throwOnWarning: true,
      }),
      enforce: 'pre',
    },
    reactRefresh(),
  ],
})
