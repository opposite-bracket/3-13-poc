import React from 'react';
import ConnectionStatus from './components/ConnectionStatus';
import {Container} from 'react-bootstrap';
import './App.scss'

function App() {
  console.log('rendering app')
  return (
    <div className="App">
      <Container fluid>
        App - <ConnectionStatus />
      </Container>
    </div>
  );
}

export default App;
