import preact from '@preact/preset-vite';
import {vanillaExtractPlugin} from '@vanilla-extract/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import {defineConfig} from 'vitest/config';

/*
 * Constants.
 */

const host = process.env.TAURI_DEV_HOST;

/*
 * Config.
 */

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [tsconfigPaths(), vanillaExtractPlugin(), preact()],

  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  },

  // Keep Tauri packages out of Vite pre-bundling so `window.__TAURI_INTERNALS__` resolves in the webview.
  optimizeDeps: {
    exclude: ['@tauri-apps/api', '@tauri-apps/plugin-dialog', '@tauri-apps/plugin-fs']
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**']
    }
  }
}));
