import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import axios from 'axios';

const MultiSeriesChart = () => {
  const chartContainerRef = useRef();
  const [selectedSeries, setSelectedSeries] = useState([]);
  const areaSeriesRefs = useRef({});
  const transformadores = ['A', 'B', 'C']; // Añade más transformadores si es necesario
  const colors = {
    A: { topColor: 'rgba(255, 0, 0, 0.5)', bottomColor: 'rgba(255, 0, 0, 0.1)', lineColor: 'red' },
    B: { topColor: 'rgba(0, 255, 0, 0.5)', bottomColor: 'rgba(0, 255, 0, 0.1)', lineColor: 'green' },
    C: { topColor: 'rgba(0, 0, 255, 0.5)', bottomColor: 'rgba(0, 0, 255, 0.1)', lineColor: 'blue' },
  };

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, { 
      width: 800, 
      height: 400,
      layout: {
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
      },
    });

    transformadores.forEach(transformador => {
      const areaSeries = chart.addAreaSeries({
        topColor: colors[transformador].topColor,
        bottomColor: colors[transformador].bottomColor,
        lineColor: colors[transformador].lineColor,
        lineWidth: 2,
      });
      areaSeriesRefs.current[transformador] = areaSeries;
    });

    const fetchSeriesData = async (transformador) => {
      try {
        const response = await axios.get(`http://localhost:3002/api/real-time-data/${transformador}`);
        const data = response.data.map(item => ({
          time: item.time,
          value: item.value,
        }));
        areaSeriesRefs.current[transformador].setData(data);
      } catch (error) {
        console.error(`Error fetching data for Transformador ${transformador}`, error);
      }
    };

    selectedSeries.forEach(transformador => {
      fetchSeriesData(transformador);
    });

    return () => chart.remove();
  }, [selectedSeries]);

  const handleSeriesToggle = (transformador) => {
    setSelectedSeries(prevSelectedSeries => {
      if (prevSelectedSeries.includes(transformador)) {
        return prevSelectedSeries.filter(item => item !== transformador);
      } else {
        return [...prevSelectedSeries, transformador];
      }
    });
  };

  return (
    <div className="chart-container">
      <div ref={chartContainerRef} />
      <div className="series-selector">
        {transformadores.map(transformador => (
          <button
            key={transformador}
            onClick={() => handleSeriesToggle(transformador)}
            className={selectedSeries.includes(transformador) ? 'active' : ''}
          >
            {`Transformador ${transformador}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultiSeriesChart;
