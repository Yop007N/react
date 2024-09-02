import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const Chart = () => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, { width: 600, height: 300 });
    const lineSeries = chart.addLineSeries();
    
    fetch('/api/data')  // Suponiendo que tu backend expone una API para obtener los datos
      .then(response => response.json())
      .then(data => {
        lineSeries.setData(data);
      });

    return () => chart.remove();
  }, []);

  return <div ref={chartContainerRef} />;
};

export default Chart;
