import React from 'react';
import ConnectionStatus from './components/ConnectionStatus';

function App() {
  console.log('rendering app')
  return (
    <div className="App">
      App -
      [<ConnectionStatus />]
    </div>
  );
}

export default App;
