import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': new URL('./src', import.meta.url).pathname,
        },
    },
    base: process.env.NODE_ENV === 'production' ? '/yesinyagami-official/' : '/',
    server: {
        host: true,
        port: 5173,
        open: true,
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['vue', 'vue-router', 'pinia']
                }
            }
        },
        chunkSizeWarningLimit: 1000
    },
    define: {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    },
});
