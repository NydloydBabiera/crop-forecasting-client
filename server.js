import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const DIST_PATH = path.join(__dirname, 'dist');

// Serve static files
app.use(express.static(DIST_PATH));

// Catch-all route for SPA (all other paths serve index.html)
app.get('/*', (req, res) => {
  res.sendFile(path.join(DIST_PATH, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
