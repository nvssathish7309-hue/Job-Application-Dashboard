const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

let staticDir = path.join(__dirname, 'dist');
if (!fs.existsSync(path.join(staticDir, 'index.html'))) {
  staticDir = path.join(__dirname, 'frontend/dist');
}

app.use(express.static(staticDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`==================================================`);
  console.log(`🚀 Production Frontend Web Service running on port ${PORT}`);
  console.log(`Serving static files from: ${staticDir}`);
  console.log(`==================================================`);
});
