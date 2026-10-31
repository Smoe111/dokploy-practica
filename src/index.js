const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    mensaje: 'Aplicacion desplegada con Dokploy!',
    institucion: 'Universidad del Quindio',
    programa: 'Ingenieria de Sistemas y Computacion',
    curso: 'Administracion de Infraestructura de TI',
    plataforma: 'Dokploy PaaS',
    fecha: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    estado: 'saludable',
    uptime: process.uptime(),
    version: process.version,
    plataforma: 'Dokploy'
  });
});

app.get('/info', (req, res) => {
  res.json({
    node_version: process.version,
    platform: process.platform,
    arch: process.arch,
    memory: {
      total: Math.round(require('os').totalmem() / 1024 / 1024) + ' MB',
      free: Math.round(require('os').freemem() / 1024 / 1024) + ' MB'
    }
  });
});

app.get('/db', async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    const [rows] = await conn.query('SELECT NOW() AS hora');
    await conn.end();
    res.json({ conexion: 'exitosa', hora_servidor_mysql: rows[0].hora });
  } catch (e) {
    res.status(500).json({ conexion: 'fallida', error: e.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${port}`);
  console.log('Plataforma: Dokploy PaaS');
});