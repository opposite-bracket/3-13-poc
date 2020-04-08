import React, { useState, useEffect} from 'react';
import SocketIOClient from "socket.io-client";

let Socket = null;
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const CONNECTION_STATUS = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  checking: 'Checking connection',
  loading: 'Loading connection status'
};

function ConnectionStatus() {
  
  const [status, setStatus] = useState(CONNECTION_STATUS.loading);
  console.log('rendering SocketConnect', status);

  useEffect(() => {
    console.log('use effect called');
    if(Socket === null) {
      Socket = SocketIOClient(SOCKET_URL);
      Socket.on('connect', function() {
        console.log('socket connected');
        setStatus(CONNECTION_STATUS.connected);
      });

      Socket.on('disconnect', function() {
        console.log('socket disconnected');
        setStatus(CONNECTION_STATUS.disconnected);
      });
    }
  });

  return (
    <div>{status}</div>
  );
}

export default ConnectionStatus;
