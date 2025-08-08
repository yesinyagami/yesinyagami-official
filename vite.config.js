import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // 確保 Vercel 能正確找到您的資源檔案
  base: '/',

  // 專案路徑別名，方便您在程式碼中引用檔案
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // 優化生產環境的建置設定
  build: {
    // 在生產環境中關閉 sourcemap，可以減小最終檔案的大小，提升性能
    sourcemap: false,
    
    // 提高大檔案警告的門檻，避免不必要的警告
    chunkSizeWarningLimit: 1000,

    // Rollup 優化選項
    rollupOptions: {
      output: {
        // 手動分割程式碼，將穩定的第三方庫（如 react）打包到一個獨立的 vendor.js 檔案中
        // 這能讓瀏覽器更好地快取這些不常變動的檔案，加快後續頁面載入速度
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  },

  // 開發伺服器設定
  server: {
    // 在您執行 `npm run dev` 時，自動在瀏覽器中打開您的網站
    open: true, 
    host: '0.0.0.0',
    port: 5173,
  },
});
