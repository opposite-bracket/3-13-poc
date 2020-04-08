import React, { useState, useEffect} from 'react';
import { Badge } from 'react-bootstrap';
import SocketIOClient from "socket.io-client";

let Socket = null;
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const CONNECTION_STATUS = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  checking: 'Checking connection',
  loading: 'Loading connection status'
};

const CONNECTION_VARIANT = {
  connected: 'success',
  disconnected: 'danger',
  checking: 'secondary',
  loading: 'info'
};

function ConnectionStatus() {
  
  const [status, setStatus] = useState('loading');
  console.log('rendering SocketConnect', status);

  useEffect(() => {
    console.log('use effect called');
    if(Socket === null) {
      Socket = SocketIOClient(SOCKET_URL);
      Socket.on('connect', function() {
        console.log('socket connected');
        setStatus('connected');
      });

      Socket.on('disconnect', function() {
        console.log('socket disconnected');
        setStatus('disconnected');
      });
    }
  });

  return (
    <Badge variant={CONNECTION_VARIANT[status]}>{CONNECTION_STATUS[status]}</Badge>
  );
}

export default ConnectionStatus;
