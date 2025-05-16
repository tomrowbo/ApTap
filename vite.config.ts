import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Connection', 'keep-alive');
          });
          proxy.on('error', (err) => {
            console.error('Proxy error:', err);
          });
        },
      },
    },
    hmr: {
      clientPort: 24678,
      port: 24678,
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
});
