import React from 'react';
import {SocketProvider} from './providers/SocketConnection';
import {Container} from 'react-bootstrap';
import ConnectionStatus from './components/ConnectionStatus';
import './App.scss'

function App() {
  return (
    <SocketProvider>
      <div className="App">
        <Container fluid>
          app
          <ConnectionStatus />
        </Container>
      </div>
    </SocketProvider>
  );
}

export default App;
