const fs = require('fs');
const path = require('path');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

async function readJson(filePath, fallbackValue) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return fallbackValue;
    throw err;
  }
}

async function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  const tmpPath = filePath + '.tmp';
  await fs.promises.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf8');
  await fs.promises.rename(tmpPath, filePath);
}

module.exports = { readJson, writeJson };
