import React, {useState, useEffect} from 'react';
import SocketIOClient from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

export const STATUS = {
  connected: 'connected',
  disconnected: 'disconnected',
  error: 'error',
  checking: 'checking',
  loading: 'loading'
};

export const STATUS_LABELS = {
  [STATUS.connected]: 'Connected',
  [STATUS.disconnected]: 'Disconnected',
  [STATUS.error]: 'Error',
  [STATUS.checking]: 'Checking connection',
  [STATUS.loading]: 'Loading connection status'
};

export const SocketContext = React.createContext({
  socketId: null,
  status: STATUS.loading,
  statusLabel: STATUS_LABELS.loading
});

export const SocketProvider = function ({children}) {

  const [SocketState, setSocket] = useState({
    status: STATUS.loading,
    statusLabel: STATUS_LABELS.loading,
    connection: null
  });

  useEffect(() => {

    const Socket = SocketIOClient(SOCKET_URL);
    Socket.on('connect', function() {
      console.log('socket connected');
      setSocket({
        status: STATUS.connected,
        statusLabel: STATUS_LABELS.connected,
        connection: Socket
      });
    });

    Socket.on('disconnect', function() {
      console.log('socket disconnected');
      setSocket({
        status: STATUS.disconnected,
        statusLabel: STATUS_LABELS.disconnected,
        connection: null
      });
    });
  }, []);

  return (
    <SocketContext.Provider value={SocketState}>
      {children}
    </SocketContext.Provider>
  );
}
