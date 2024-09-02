// import React, { useEffect, useRef, useState } from 'react';
// import { createChart } from 'lightweight-charts';
// import axios from 'axios';

// const RealTimeChart = () => {
//   const chartContainerRef = useRef();
//   const lineSeriesRef = useRef();
//   const [transformerCapacity, setTransformerCapacity] = useState(0);

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
//     lineSeriesRef.current = lineSeries;

//     const fetchData = () => {
//       axios.get('http://localhost:3001/api/real-time-data')
//         .then(response => {
//           const sortedData = response.data.sort((a, b) => a.time - b.time);
//           lineSeries.setData(sortedData);
//         })
//         .catch(error => {
//           console.error('Error fetching real-time data', error);
//         });
//     };

//     axios.get('http://localhost:3001/api/transformer-capacity')
//       .then(response => {
//         setTransformerCapacity(response.data.capacity);
//       })
//       .catch(error => {
//         console.error('Error fetching transformer capacity', error);
//       });

//     fetchData();
//     const intervalId = setInterval(fetchData, 1000);

//     return () => {
//       clearInterval(intervalId);
//       chart.remove();
//     };
//   }, []);

//   return (
//     <div className="chart-container">
//       <div className="transformer-capacity">Capacidad del Transformador: {transformerCapacity} kW</div>
//       <div ref={chartContainerRef} />
//     </div>
//   );
// };

// export default RealTimeChart;



import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import axios from 'axios';

const RealTimeChart = ({ transformer }) => {
  const chartContainerRef = useRef();
  const lineSeriesRef = useRef();
  const [transformerCapacity, setTransformerCapacity] = useState(0);

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
    lineSeriesRef.current = lineSeries;

    const fetchRealTimeData = () => {
      axios.get(`http://localhost:3002/api/real-time-data/${transformer}`)
        .then(response => {
          const data = response.data || [];
          const sortedData = data.sort((a, b) => a.time - b.time);
          lineSeries.setData(sortedData);
        })
        .catch(error => {
          console.error('Error fetching real-time data', error);
        });
    };

    axios.get(`http://localhost:3002/api/transformer-capacity/${transformer}`)
      .then(response => {
        setTransformerCapacity(response.data.capacity);
      })
      .catch(error => {
        console.error('Error fetching transformer capacity', error);
      });

    fetchRealTimeData();
    const intervalId = setInterval(fetchRealTimeData, 1000);

    return () => {
      clearInterval(intervalId);
      chart.remove();
    };
  }, [transformer]);

  return (
    <div className="chart-container">
      <div className="transformer-capacity">Capacidad del Transformador: {transformerCapacity} kW</div>
      <div ref={chartContainerRef} />
    </div>
  );
};

export default RealTimeChart;
