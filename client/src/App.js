import React from 'react';
import './App.scss'
import {SocketProvider} from './providers/SocketConnection';
import {Container} from 'react-bootstrap';
import PageNavbar from './components/PageNavbar';

function App() {
  return (
    <SocketProvider>
      <Container fluid className="pl-0 pr-0">
        <PageNavbar />
      </Container>
    </SocketProvider>
  );
}

export default App;
