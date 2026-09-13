import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import environmentHandler from './api/environment.js';
import healthHandler from './api/health.js';

function apiRoutesPlugin(): Plugin {
  const mountMiddleware = (server: any) => {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      const url = req.url?.split('?')[0];
      if (url === '/api/environment') {
        return environmentHandler(req, res);
      }
      if (url === '/api/health') {
        return healthHandler(req, res);
      }
      next();
    });
  };

  return {
    name: 'api-routes-plugin',
    configureServer(server) {
      mountMiddleware(server);
    },
    configurePreviewServer(server) {
      mountMiddleware(server);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiRoutesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
