// PROBLEMA ARREGLADO: Se limpió el código comentado y se mejoró la implementación del componente
import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import axios from 'axios';

const HistoricalChart = ({ transformer }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transformerInfo, setTransformerInfo] = useState(null);

  const colors = {
    A: '#e74c3c',
    B: '#27ae60',
    C: '#3498db',
  };

  const statusColors = {
    normal: '#27ae60',
    warning: '#f39c12',
    critical: '#e74c3c'
  };

  useEffect(() => {
    // Inicializar fechas por defecto (últimos 7 días)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);

    setStartDate(start.toISOString().slice(0, 16));
    setEndDate(end.toISOString().slice(0, 16));
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Crear chart solo una vez
    if (!chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          backgroundColor: '#ffffff',
          textColor: '#2c3e50',
          fontFamily: 'Arial, sans-serif',
        },
        grid: {
          vertLines: {
            color: '#f0f0f0',
          },
          horzLines: {
            color: '#f0f0f0',
          },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: '#cccccc',
        },
      });

      // Añadir series para datos principales
      chartRef.current.mainSeries = chartRef.current.addLineSeries({
        color: colors[transformer] || '#2c3e50',
        lineWidth: 2,
        title: `Transformador ${transformer}`,
      });

      // Añadir línea de capacidad
      chartRef.current.capacitySeries = chartRef.current.addLineSeries({
        color: '#e74c3c',
        lineWidth: 1,
        lineStyle: 2, // Dashed line
        title: 'Capacidad Máxima',
      });

      // Responsive
      const resizeObserver = new ResizeObserver(() => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      });

      resizeObserver.observe(chartContainerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [transformer]);

  useEffect(() => {
    if (startDate && endDate && chartRef.current) {
      fetchHistoricalData();
    }
  }, [startDate, endDate, transformer]);

  const fetchHistoricalData = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError('');

    try {
      // Fetch datos históricos
      const [dataResponse, capacityResponse] = await Promise.all([
        axios.get(`http://localhost:3002/api/historical-data/${transformer}`, {
          params: {
            start: new Date(startDate).toISOString(),
            end: new Date(endDate).toISOString(),
            limit: 1000
          }
        }),
        axios.get(`http://localhost:3002/api/transformer-capacity/${transformer}`)
      ]);

      const { data: historicalData, transformer: transformerData } = dataResponse.data;
      const capacityData = capacityResponse.data;

      setTransformerInfo(transformerData);

      if (historicalData && historicalData.length > 0) {
        // Formatear datos principales
        const formattedData = historicalData.map(item => ({
          time: new Date(item.time).getTime() / 1000,
          value: item.value,
        }));

        // Crear línea de capacidad
        const capacityLine = historicalData.map(item => ({
          time: new Date(item.time).getTime() / 1000,
          value: capacityData.capacity,
        }));

        chartRef.current.mainSeries.setData(formattedData);
        chartRef.current.capacitySeries.setData(capacityLine);

        // Configurar escalas
        chartRef.current.timeScale().fitContent();

      } else {
        setError('No hay datos disponibles para el rango seleccionado');
        chartRef.current.mainSeries.setData([]);
        chartRef.current.capacitySeries.setData([]);
      }

    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError('Error al cargar los datos históricos');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    setStartDate(start.toISOString().slice(0, 16));
    setEndDate(end.toISOString().slice(0, 16));
  };

  return (
    <div className="historical-chart-container">
      <div className="chart-header">
        <h3>
          Datos Históricos - {transformerInfo?.name || `Transformador ${transformer}`}
        </h3>
        {transformerInfo && (
          <div className="transformer-info">
            <span>📍 {transformerInfo.location}</span>
            <span>⚡ {transformerInfo.capacity} kVA</span>
            <span>🔌 {transformerInfo.voltage}</span>
          </div>
        )}
      </div>

      <div className="chart-controls">
        <div className="date-inputs">
          <label>
            Fecha inicio:
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={loading}
            />
          </label>

          <label>
            Fecha fin:
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={loading}
            />
          </label>
        </div>

        <div className="quick-ranges">
          <button onClick={() => handleQuickRange(1)} disabled={loading}>
            Último día
          </button>
          <button onClick={() => handleQuickRange(7)} disabled={loading}>
            Última semana
          </button>
          <button onClick={() => handleQuickRange(30)} disabled={loading}>
            Último mes
          </button>
          <button onClick={() => handleQuickRange(90)} disabled={loading}>
            Últimos 3 meses
          </button>
        </div>
      </div>

      {loading && <div className="loading">Cargando datos...</div>}
      {error && <div className="error">{error}</div>}

      <div className="chart-wrapper">
        <div ref={chartContainerRef} className="chart" />
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <span
            className="legend-color"
            style={{ backgroundColor: colors[transformer] }}
          ></span>
          Consumo Actual
        </div>
        <div className="legend-item">
          <span
            className="legend-color"
            style={{ backgroundColor: '#e74c3c' }}
          ></span>
          Capacidad Máxima
        </div>
      </div>
    </div>
  );
};

export default HistoricalChart;