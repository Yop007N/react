# Energy Dashboard Transformers

Un dashboard profesional para monitoreo de transformadores eléctricos con análisis de consumo energético en tiempo real.

## 🚀 Características

- **Monitoreo en Tiempo Real**: Visualización de datos de consumo energético en vivo
- **Análisis Histórico**: Consulta de datos históricos con filtros de fecha personalizables
- **Comparación Multi-Serie**: Comparar el rendimiento de múltiples transformadores
- **Alertas Inteligentes**: Sistema de alertas basado en umbrales de capacidad
- **Dashboard Responsivo**: Optimizado para dispositivos móviles y desktop
- **API REST**: Backend completo con documentación Swagger
- **Datos Realistas**: Simulación de patrones de consumo energético realistas

## 🛠️ Tecnologías

### Frontend
- **React 18** - Biblioteca de UI
- **Lightweight Charts** - Gráficos de alto rendimiento
- **Axios** - Cliente HTTP
- **CSS3** - Estilos modernos con gradientes y animaciones

### Backend
- **Node.js** - Runtime del servidor
- **Express** - Framework web
- **Swagger** - Documentación de API
- **CORS** - Configuración de seguridad

## 📋 Prerrequisitos

- Node.js >= 16.0.0
- npm >= 8.0.0

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**:
```bash
git clone https://github.com/yop007n/energy-dashboard-transformers.git
cd energy-dashboard-transformers
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
PORT=3002
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

4. **Ejecutar en desarrollo**:
```bash
# Ejecutar solo el frontend
npm start

# Ejecutar solo el backend
npm run server

# Ejecutar frontend y backend simultáneamente
npm run dev
```

5. **Acceder a la aplicación**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3002
- Documentación Swagger: http://localhost:3002/api-docs

## 📊 Transformadores Configurados

| ID | Nombre | Capacidad | Ubicación | Voltaje |
|----|--------|-----------|-----------|---------|
| A | Transformador Alpha | 3000 kVA | Sector Norte | 13.8/0.4 kV |
| B | Transformador Beta | 2500 kVA | Sector Centro | 13.8/0.4 kV |
| C | Transformador Gamma | 3500 kVA | Sector Sur | 13.8/0.4 kV |

## 🔧 Características del Dashboard

### Gráfico Histórico
- Consulta de datos por rango de fechas
- Botones de acceso rápido (último día, semana, mes, 3 meses)
- Línea de capacidad máxima para referencia
- Información detallada del transformador

### Gráfico en Tiempo Real
- Actualización automática cada 5 segundos
- Indicadores de estado (Normal, Advertencia, Crítico)
- Últimos 30 puntos de datos
- Monitoreo de carga actual

### Gráfico Multi-Serie
- Comparación simultánea de todos los transformadores
- Análisis de rendimiento relativo
- Identificación de patrones de consumo

## 🌐 API Endpoints

### Transformadores
- `GET /api/transformers` - Lista todos los transformadores
- `GET /api/transformer-capacity/:id` - Información de capacidad

### Datos
- `GET /api/historical-data/:id` - Datos históricos con filtros
- `GET /api/real-time-data/:id` - Datos en tiempo real
- `GET /api/multi-series-data` - Datos comparativos

### Utilidades
- `GET /health` - Estado del servidor
- `GET /api-docs` - Documentación Swagger

## 📈 Patrones de Datos

El sistema simula patrones realistas de consumo energético:

- **Carga Base**: 30% de la capacidad nominal
- **Pico Matutino**: 6:00-9:00 AM (+50% de carga)
- **Pico Vespertino**: 17:00-21:00 PM (+80% de carga)
- **Consumo Nocturno**: 22:00-5:00 AM (-30% de carga)
- **Variación Aleatoria**: ±15% para simular fluctuaciones reales

## 🎨 Personalización

### Modificar Transformadores
Editar la configuración en `server.js`:
```javascript
const transformerConfig = {
  A: {
    name: 'Tu Transformador',
    capacity: 5000,
    location: 'Tu Ubicación',
    voltage: 'Tu Voltaje'
  }
};
```

### Cambiar Colores
Modificar los colores en `src/components/HistoricalChart.js`:
```javascript
const colors = {
  A: '#tu-color',
  B: '#tu-color',
  C: '#tu-color',
};
```

### Ajustar Umbrales de Alerta
Configurar en `.env`:
```env
WARNING_THRESHOLD=70
CRITICAL_THRESHOLD=90
```

## 🏗️ Estructura del Proyecto

```
energy-dashboard-transformers/
├── src/
│   ├── components/
│   │   ├── HistoricalChart.js
│   │   ├── RealTimeChart.js
│   │   └── MultiSeriesChart.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── public/
├── server.js              # Backend API
├── swaggerConfig.js       # Configuración Swagger
├── package.json
├── .env                   # Variables de entorno
└── README.md
```

## 🚀 Despliegue

### Producción Local
```bash
npm run build
npm run server
```

### Docker (opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3002
CMD ["npm", "run", "server"]
```

### Variables de Entorno de Producción
```env
NODE_ENV=production
PORT=3002
CORS_ORIGIN=https://tu-dominio.com
LOG_LEVEL=warn
```

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm test

# Verificar API
curl http://localhost:3002/health
```

## 📚 Documentación Adicional

- **API Documentation**: http://localhost:3002/api-docs
- **Lightweight Charts**: https://tradingview.github.io/lightweight-charts/
- **React Documentation**: https://reactjs.org/

## 🔒 Seguridad

- CORS configurado para orígenes específicos
- Variables de entorno para configuración sensible
- Validación de parámetros de entrada
- Manejo seguro de errores

## 👨‍💻 Autor

**Enrique Bobadilla**
- GitHub: [@yop007n](https://github.com/yop007n)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas:
- Abrir un issue en GitHub
- Consultar la documentación Swagger
- Revisar los logs del servidor