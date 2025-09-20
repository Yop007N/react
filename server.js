// PROBLEMA ARREGLADO: Se limpió el código comentado y se mejoró la implementación del servidor
const express = require('express');
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('./swaggerConfig');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configuración de transformadores
const transformerConfig = {
  A: {
    name: 'Transformador Alpha',
    capacity: 3000,
    location: 'Sector Norte',
    voltage: '13.8/0.4 kV'
  },
  B: {
    name: 'Transformador Beta',
    capacity: 2500,
    location: 'Sector Centro',
    voltage: '13.8/0.4 kV'
  },
  C: {
    name: 'Transformador Gamma',
    capacity: 3500,
    location: 'Sector Sur',
    voltage: '13.8/0.4 kV'
  },
};

// Datos de transformadores con patrones realistas
const transformers = {
  A: generateRealisticData('A'),
  B: generateRealisticData('B'),
  C: generateRealisticData('C'),
};

// Función para generar datos históricos realistas
function generateRealisticData(transformerId) {
  const data = [];
  const now = new Date();
  const config = transformerConfig[transformerId];

  for (let i = 0; i < 100; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);

    for (let j = 0; j < 24; j++) {
      const hour = j;
      const timeStamp = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour);

      // Patrón de consumo realista basado en la hora del día
      let baseLoad = config.capacity * 0.3; // Carga base 30%

      // Picos de consumo en horas específicas
      if (hour >= 6 && hour <= 9) baseLoad *= 1.5; // Pico matutino
      if (hour >= 17 && hour <= 21) baseLoad *= 1.8; // Pico vespertino
      if (hour >= 22 || hour <= 5) baseLoad *= 0.7; // Consumo nocturno reducido

      // Variación aleatoria ±15%
      const variation = (Math.random() - 0.5) * 0.3;
      const value = Math.max(0, baseLoad * (1 + variation));

      data.push({
        time: timeStamp.toISOString(),
        value: Math.round(value),
        percentage: Math.round((value / config.capacity) * 100),
        status: value > config.capacity * 0.9 ? 'critical' :
                value > config.capacity * 0.7 ? 'warning' : 'normal'
      });
    }
  }

  console.log(`✅ Generated realistic data for ${config.name} from ${data[data.length - 1].time} to ${data[0].time}`);
  return data.reverse(); // Ordenar cronológicamente
}

// Función para actualizar datos en tiempo real
function updateRealTimeData() {
  const now = new Date();

  Object.keys(transformers).forEach(transformerId => {
    const config = transformerConfig[transformerId];
    const hour = now.getHours();

    // Patrón realista para tiempo real
    let baseLoad = config.capacity * 0.3;
    if (hour >= 6 && hour <= 9) baseLoad *= 1.5;
    if (hour >= 17 && hour <= 21) baseLoad *= 1.8;
    if (hour >= 22 || hour <= 5) baseLoad *= 0.7;

    const variation = (Math.random() - 0.5) * 0.3;
    const value = Math.max(0, baseLoad * (1 + variation));

    const newPoint = {
      time: now.toISOString(),
      value: Math.round(value),
      percentage: Math.round((value / config.capacity) * 100),
      status: value > config.capacity * 0.9 ? 'critical' :
              value > config.capacity * 0.7 ? 'warning' : 'normal'
    };

    transformers[transformerId].push(newPoint);

    // Mantener solo los últimos 30 puntos para tiempo real
    if (transformers[transformerId].length > 2400) { // 100 días * 24 horas
      transformers[transformerId] = transformers[transformerId].slice(-2400);
    }
  });
}

// Actualizar datos cada 5 segundos (más realista que cada segundo)
setInterval(updateRealTimeData, 5000);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    transformers: Object.keys(transformers).length
  });
});

// Root endpoint con información de la API
app.get('/', (req, res) => {
  res.json({
    name: 'Energy Dashboard Transformers API',
    version: '1.0.0',
    description: 'API para monitoreo de transformadores eléctricos',
    endpoints: {
      documentation: '/api-docs',
      health: '/health',
      transformers: '/api/transformers',
      historicalData: '/api/historical-data/:transformer',
      realTimeData: '/api/real-time-data/:transformer',
      capacity: '/api/transformer-capacity/:transformer'
    }
  });
});

/**
 * @swagger
 * /api/transformers:
 *   get:
 *     summary: Lista todos los transformadores disponibles
 *     responses:
 *       200:
 *         description: Lista de transformadores
 */
app.get('/api/transformers', (req, res) => {
  const transformerList = Object.keys(transformerConfig).map(id => ({
    id,
    ...transformerConfig[id],
    currentStatus: transformers[id][transformers[id].length - 1]?.status || 'unknown',
    dataPoints: transformers[id].length
  }));

  res.json(transformerList);
});

/**
 * @swagger
 * /api/historical-data/{transformer}:
 *   get:
 *     summary: Obtiene datos históricos de un transformador específico
 */
app.get('/api/historical-data/:transformer', (req, res) => {
  const { transformer } = req.params;
  const { start, end, limit = 100 } = req.query;

  if (!transformers[transformer]) {
    return res.status(404).json({
      error: 'Transformador no encontrado',
      available: Object.keys(transformers)
    });
  }

  let data = transformers[transformer];

  // Filtrar por rango de fechas si se proporciona
  if (start && end) {
    data = data.filter(item => {
      const itemDate = new Date(item.time);
      return itemDate >= new Date(start) && itemDate <= new Date(end);
    });
  }

  // Limitar resultados
  data = data.slice(-parseInt(limit));

  res.json({
    transformer: transformerConfig[transformer],
    data,
    count: data.length,
    timeRange: {
      start: data[0]?.time,
      end: data[data.length - 1]?.time
    }
  });
});

/**
 * @swagger
 * /api/real-time-data/{transformer}:
 *   get:
 *     summary: Obtiene datos en tiempo real de un transformador
 */
app.get('/api/real-time-data/:transformer', (req, res) => {
  const { transformer } = req.params;

  if (!transformers[transformer]) {
    return res.status(404).json({
      error: 'Transformador no encontrado',
      available: Object.keys(transformers)
    });
  }

  // Últimos 30 puntos para gráfico en tiempo real
  const realTimeData = transformers[transformer].slice(-30).map(item => ({
    ...item,
    time: new Date(item.time).getTime() / 1000, // Timestamp para lightweight-charts
  }));

  res.json({
    transformer: transformerConfig[transformer],
    data: realTimeData,
    lastUpdate: new Date().toISOString()
  });
});

/**
 * @swagger
 * /api/transformer-capacity/{transformer}:
 *   get:
 *     summary: Obtiene información de capacidad de un transformador
 */
app.get('/api/transformer-capacity/:transformer', (req, res) => {
  const { transformer } = req.params;

  if (!transformerConfig[transformer]) {
    return res.status(404).json({
      error: 'Transformador no encontrado',
      available: Object.keys(transformerConfig)
    });
  }

  const config = transformerConfig[transformer];
  const currentData = transformers[transformer][transformers[transformer].length - 1];

  res.json({
    ...config,
    currentLoad: currentData?.value || 0,
    currentPercentage: currentData?.percentage || 0,
    status: currentData?.status || 'unknown',
    efficiency: Math.round(Math.random() * 5 + 92), // 92-97% efficiency
    temperature: Math.round(Math.random() * 20 + 35), // 35-55°C
    lastMaintenance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
  });
});

/**
 * @swagger
 * /api/multi-series-data:
 *   get:
 *     summary: Obtiene datos comparativos de todos los transformadores
 */
app.get('/api/multi-series-data', (req, res) => {
  const { hours = 24 } = req.query;
  const hoursBack = parseInt(hours);

  const compareData = Object.keys(transformers).map(transformerId => {
    const data = transformers[transformerId].slice(-hoursBack).map(item => ({
      time: new Date(item.time).getTime() / 1000,
      value: item.value
    }));

    return {
      transformer: transformerConfig[transformerId],
      data
    };
  });

  res.json(compareData);
});

// Error handler
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.method} ${req.originalUrl} no existe`,
    documentation: '/api-docs'
  });
});

const server = app.listen(port, () => {
  console.log(`🚀 Energy Dashboard API corriendo en puerto ${port}`);
  console.log(`📊 Swagger docs disponible en http://localhost:${port}/api-docs`);
  console.log(`🔌 Monitoreando ${Object.keys(transformers).length} transformadores`);

  // Mostrar estado inicial
  Object.keys(transformerConfig).forEach(id => {
    const config = transformerConfig[id];
    console.log(`   ${config.name}: ${config.capacity}kVA - ${config.location}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado exitosamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado exitosamente');
    process.exit(0);
  });
});