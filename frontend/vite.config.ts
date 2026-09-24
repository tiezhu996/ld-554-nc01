import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 2200,
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.message.includes('contains an annotation that Rollup cannot interpret') &&
          warning.id?.includes('@vueuse/core')
        ) {
          return;
        }
        warn(warning);
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 38404,
    proxy: {
      '/api': 'http://localhost:38504'
    }
  }
});
