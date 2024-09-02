// const express = require('express');
// const cors = require('cors');
// const app = express();
// const port = 3001;

// app.use(cors());

// const historicalData = Array.from({ length: 30 }, (_, i) => ({
//   time: `2023-06-${String(i + 1).padStart(2, '0')}`,
//   value: Math.floor(Math.random() * 100)
// }));

// let realTimeData = [];
// let baseTime = Math.floor(Date.now() / 1000);

// for (let i = 0; i < 30; i++) {
//   realTimeData.push({
//     time: baseTime + i,
//     value: Math.random() * 100
//   });
// }

// const transformerCapacity = 3000;

// setInterval(() => {
//   baseTime = Math.floor(Date.now() / 1000);
//   realTimeData.push({
//     time: baseTime,
//     value: Math.random() * 100
//   });
//   if (realTimeData.length > 30) {
//     realTimeData.shift();
//   }
// }, 1000);

// app.get('/api/historical-data', (req, res) => {
//   res.json(historicalData);
// });

// app.get('/api/real-time-data', (req, res) => {
//   realTimeData.sort((a, b) => a.time - b.time);
//   res.json(realTimeData);
// });

// app.get('/api/transformer-capacity', (req, res) => {
//   res.json({ capacity: transformerCapacity });
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });




// const express = require('express');
// const cors = require('cors');
// const app = express();
// const port = 3001;

// app.use(cors());

// const transformers = {
//   A: generateHistoricalData(),
//   B: generateHistoricalData(),
//   C: generateHistoricalData(),
// };

// // Función para generar datos históricos
// function generateHistoricalData() {
//   const data = [];
//   const now = new Date();
//   for (let i = 0; i < 100; i++) { // Generar datos para 100 días
//     const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
//     for (let j = 0; j < 24; j++) {
//       data.push({
//         time: new Date(date.getFullYear(), date.getMonth(), date.getDate(), j).toISOString(),
//         value: Math.floor(Math.random() * 100),
//       });
//     }
//   }
//   return data;
// }

// // Actualiza datos en tiempo real cada segundo
// function updateRealTimeData() {
//   const now = new Date();
//   Object.keys(transformers).forEach(transformer => {
//     transformers[transformer].push({
//       time: now.toISOString(),
//       value: Math.floor(Math.random() * 100),
//     });
//     // Mantener solo los últimos 30 puntos de datos en tiempo real
//     if (transformers[transformer].length > 30) {
//       transformers[transformer] = transformers[transformer].slice(-30);
//     }
//   });
// }

// setInterval(updateRealTimeData, 1000);

// // Ruta para obtener datos históricos de un transformador específico por rango de fechas y horas
// app.get('/api/historical-data/:transformer', (req, res) => {
//   const { transformer } = req.params;
//   const { start, end } = req.query;
//   if (!transformers[transformer]) {
//     return res.status(404).send('Transformador no encontrado');
//   }
//   const data = transformers[transformer].filter(item => {
//     return new Date(item.time) >= new Date(start) && new Date(item.time) <= new Date(end);
//   });
//   res.json(data);
// });

// app.get('/api/real-time-data/:transformer', (req, res) => {
//   const { transformer } = req.params;
//   if (!transformers[transformer]) {
//     return res.status(404).send('Transformador no encontrado');
//   }
//   const realTimeData = transformers[transformer].slice(-30).map(item => ({
//     ...item,
//     time: new Date(item.time).getTime() / 1000,
//   }));
//   res.json(realTimeData);
// });

// app.get('/api/transformer-capacity/:transformer', (req, res) => {
//   res.json({ capacity: 3000 });
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


const express = require('express');
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('./swaggerConfig'); // Añade esto
const app = express();
const port = 3002;

app.use(cors());

const transformers = {
  A: generateHistoricalData(),
  B: generateHistoricalData(),
  C: generateHistoricalData(),
};

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

function generateHistoricalData() {
  const data = [];
  const now = new Date();
  for (let i = 0; i < 100; i++) { // Generar datos para 100 días
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    for (let j = 0; j < 24; j++) {
      data.push({
        time: new Date(date.getFullYear(), date.getMonth(), date.getDate(), j).toISOString(),
        value: Math.floor(Math.random() * 100),
      });
    }
  }
  console.log(`Data generated from ${data[data.length - 1].time} to ${data[0].time}`);
  return data;
}

function updateRealTimeData() {
  const now = new Date();
  Object.keys(transformers).forEach(transformer => {
    transformers[transformer].push({
      time: now.toISOString(),
      value: Math.floor(Math.random() * 100),
    });
    // Mantener solo los últimos 30 puntos de datos en tiempo real
    if (transformers[transformer].length > 30) {
      transformers[transformer] = transformers[transformer].slice(-30);
    }
  });
}

setInterval(updateRealTimeData, 1000);

/**
 * @swagger
 * /api/historical-data/{transformer}:
 *   get:
 *     summary: Obtiene datos históricos de un transformador específico por rango de fechas y horas
 *     parameters:
 *       - in: path
 *         name: transformer
 *         schema:
 *           type: string
 *         required: true
 *         description: El nombre del transformador
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: Fecha de inicio del rango
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: Fecha de fin del rango
 *     responses:
 *       200:
 *         description: Datos históricos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   time:
 *                     type: string
 *                     format: date-time
 *                   value:
 *                     type: number
 */
app.get('/api/historical-data/:transformer', (req, res) => {
  const { transformer } = req.params;
  const { start, end } = req.query;
  if (!transformers[transformer]) {
    return res.status(404).send('Transformador no encontrado');
  }
  const data = transformers[transformer].filter(item => {
    return new Date(item.time) >= new Date(start) && new Date(item.time) <= new Date(end);
  });
  res.json(data);
});

/**
 * @swagger
 * /api/real-time-data/{transformer}:
 *   get:
 *     summary: Obtiene datos en tiempo real de un transformador específico
 *     parameters:
 *       - in: path
 *         name: transformer
 *         schema:
 *           type: string
 *         required: true
 *         description: El nombre del transformador
 *     responses:
 *       200:
 *         description: Datos en tiempo real
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   time:
 *                     type: number
 *                   value:
 *                     type: number
 */
app.get('/api/real-time-data/:transformer', (req, res) => {
  const { transformer } = req.params;
  if (!transformers[transformer]) {
    return res.status(404).send('Transformador no encontrado');
  }
  const realTimeData = transformers[transformer].slice(-30).map(item => ({
    ...item,
    time: new Date(item.time).getTime() / 1000,
  }));
  res.json(realTimeData);
});

/**
 * @swagger
 * /api/transformer-capacity/{transformer}:
 *   get:
 *     summary: Obtiene la capacidad de un transformador específico
 *     parameters:
 *       - in: path
 *         name: transformer
 *         schema:
 *           type: string
 *         required: true
 *         description: El nombre del transformador
 *     responses:
 *       200:
 *         description: Capacidad del transformador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 capacity:
 *                   type: number
 */
app.get('/api/transformer-capacity/:transformer', (req, res) => {
  res.json({ capacity: 3000 });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
