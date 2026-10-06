import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { initMorningBriefingCron } from './src/services/morningBriefingCron';

// Middleware & Routes
import { requestLogger } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import queueRoutes from './routes/queueRoutes';
import taskRoutes from './routes/taskRoutes';
import briefingRoutes from './routes/briefingRoutes';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware'ler
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(requestLogger);

  // Her sabah saat 06:00 Cron zamanlayicisini baslat
  initMorningBriefingCron();

  // API Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Moduler Route'lar (API V1)
  app.use('/api/queue', queueRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/morning-briefing', briefingRoutes);

  // Geliştirme (Vite) vs Üretim (Dist) Ortamı
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev && fs.existsSync(path.resolve(process.cwd(), 'vite.config.ts'))) {
    console.log('[Dev] Vite middleware baslatiliyor...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    console.log('[Prod] Statik dosyalar sunuluyor...');
    const clientPath = path.resolve(process.cwd(), 'dist/client');
    if (fs.existsSync(clientPath)) {
      app.use(express.static(clientPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(clientPath, 'index.html'));
      });
    } else {
      console.warn('[Prod] Uyari: dist/client klasoru bulunamadi.');
    }
  }

  // 404 ve Merkezi Hata Yonetimi
  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(\[Server] 🚀 Sistem calisiyor: http://localhost:\\);
    console.log(\[Server] Mod: \\);
  });
}

startServer().catch(err => {
  console.error('[Server] Baslatma hatasi:', err);
  process.exit(1);
});
