// import React from 'react';
// import HistoricalChart from './components/HistoricalChart';
// import RealTimeChart from './components/RealTimeChart';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <h1>Energy Dashboard</h1>
//       <h2 className="chart-title">Datos Históricos de Consumo Eléctrico</h2>
//       <HistoricalChart />
//       <h2 className="chart-title">Datos en Tiempo Real de Consumo Eléctrico</h2>
//       <RealTimeChart />
//     </div>
//   );
// }

// export default App;



import React, { useState } from 'react';
import HistoricalChart from './components/HistoricalChart';
import RealTimeChart from './components/RealTimeChart';
import MultiSeriesChart from './components/MultiSeriesChart';
import './App.css';

function App() {
  const [selectedTransformer, setSelectedTransformer] = useState('A');

  return (
    <div className="App">
      <h1>Energy Dashboard</h1>
      <div>
        <label htmlFor="transformer-select">Seleccionar Transformador:</label>
        <select 
          id="transformer-select" 
          value={selectedTransformer} 
          onChange={(e) => setSelectedTransformer(e.target.value)}
        >
          <option value="A">Transformador A</option>
          <option value="B">Transformador B</option>
          <option value="C">Transformador C</option>
        </select>
      </div>
      <h2 className="chart-title">Datos Históricos de Consumo Eléctrico</h2>
      <HistoricalChart transformer={selectedTransformer} />
      <h2 className="chart-title">Datos en Tiempo Real de Consumo Eléctrico</h2>
      <RealTimeChart transformer={selectedTransformer} />
      <h2 className="chart-title">Comparar Series de Transformadores</h2>
      <MultiSeriesChart />
    </div>
  );
}

export default App;
