// import React, { useEffect, useRef } from 'react';
// import { createChart } from 'lightweight-charts';
// import axios from 'axios';

// const HistoricalChart = () => {
//   const chartContainerRef = useRef();

//   useEffect(() => {
//     const chart = createChart(chartContainerRef.current, { 
//       width: 800, /* Ancho del gráfico */
//       height: 400, /* Alto del gráfico */
//       layout: {
//         backgroundColor: '#FFFFFF', /* Fondo claro */
//         textColor: '#000000', /* Texto en color negro */
//       },
//     });
//     const lineSeries = chart.addLineSeries();

//     axios.get('http://localhost:3001/api/historical-data')
//       .then(response => {
//         const formattedData = response.data.map(item => ({
//           time: item.time,
//           value: item.value
//         }));
//         lineSeries.setData(formattedData);
//       })
//       .catch(error => {
//         console.error('Error fetching historical data', error);
//       });

//     return () => chart.remove();
//   }, []);

//   return (
//     <div className="chart-container">
//       <div ref={chartContainerRef} />
//     </div>
//   );
// };

// export default HistoricalChart;
import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import axios from 'axios';

const HistoricalChart = ({ transformer }) => {
  const chartContainerRef = useRef();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [noDataMessage, setNoDataMessage] = useState('');

  const colors = {
    A: 'red',
    B: 'green',
    C: 'blue',
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

    const lineSeries = chart.addLineSeries({
      color: colors[transformer] || 'black',
    });

    const fetchHistoricalData = () => {
      axios.get(`http://localhost:3002/api/historical-data/${transformer}`, {
        params: {
          start: new Date(startDate).toISOString(),
          end: new Date(endDate).toISOString(),
        }
      })
      .then(response => {
        if (response.data.length > 0) {
          const formattedData = response.data.map(item => ({
            time: new Date(item.time).getTime() / 1000,
            value: item.value,
          }));
          lineSeries.setData(formattedData);
          setNoDataMessage('');
        } else {
          setNoDataMessage('No data available for the selected range');
          lineSeries.setData([]);
        }
      })
      .catch(error => {
        console.error('Error fetching historical data', error);
      });
    };

    const fetchDateRange = () => {
      setDateRange('Data available from 2024-02-25T02:00:00.000Z to 2024-06-02T04:00:00.000Z');
    };

    if (startDate && endDate) {
      fetchHistoricalData();
    }

    fetchDateRange();

    return () => chart.remove();
  }, [startDate, endDate, transformer]);

  return (
    <div className="chart-container">
      <div>
        <label>Start Date and Time:</label>
        <input 
          type="datetime-local" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
        />
        <label>End Date and Time:</label>
        <input 
          type="datetime-local" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
        />
      </div>
      <p>{dateRange}</p>
      <p>{noDataMessage}</p>
      <div ref={chartContainerRef} />
    </div>
  );
};

export default HistoricalChart;
