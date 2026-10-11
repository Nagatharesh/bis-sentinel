import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { handleApiRequest } from './server/apiRouter.js';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'sqlite-api-plugin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/api')) {
            const handled = handleApiRequest(req, res);
            if (handled) return;
          }
          next();
        });
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'BIS Sentinel – Consumer Checker',
        short_name: 'BIS Sentinel',
        description: 'Check whether a product BIS Standard Mark claim is consistent with official records.',
        theme_color: '#312E81',
        background_color: '#FBFBFA',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
  },
});
