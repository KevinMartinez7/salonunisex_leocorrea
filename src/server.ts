// server.ts
import express from 'express';
import { join } from 'path';

const app = express();
const PORT = process.env['PORT'] || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

// Servir archivos estáticos
app.use(express.static(DIST_FOLDER));

// Servir index.html para todas las rutas (SPA)
app.get('*', (req, res) => {
  res.sendFile(join(DIST_FOLDER, 'index.html'));
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`App corriendo en http://localhost:${PORT}`);
});
