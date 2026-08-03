require('reflect-metadata');
const { AppDataSource } = require('../dist/config/data-source');
const app = require('../dist/app').default;

let initPromise = null;

function ensureDb() {
  if (!initPromise) {
    initPromise = AppDataSource.initialize().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

module.exports = async function handler(req, res) {
  try {
    await ensureDb();
  } catch (err) {
    console.error('Failed to initialize database:', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
  return app(req, res);
};
