import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import SocketIOClient from "socket.io-client";
import { useCookies } from 'react-cookie';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const API_URL = process.env.REACT_APP_API_URL;
const USERS_API = '/v1/users/';
const USER_ID_COOKIE = 'USER_ID_COOKIE';

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

export const SessionContext = React.createContext({
  socketId: null,
  status: STATUS.loading,
  statusLabel: STATUS_LABELS.loading
});

export const SessionProvider = function ({children}) {

  const [cookies, setCookie] = useCookies([
    USER_ID_COOKIE
  ]);
  const [SessionState, setSession] = useState({
    status: STATUS.disconnected,
    statusLabel: STATUS_LABELS.disconnected,
    session: null,
    users: [],
    connection: null
  });

  useEffect(function () {

    const session = cookies[USER_ID_COOKIE];
    if( session !== undefined ) {
      // @TODO: Move socket into their own module
      const Socket = SocketIOClient(`${SOCKET_URL}?token=${session.token}`);
      Socket.on('connect', function() {
        setSession(state => {
          return {
            ...state,
            status: STATUS.connected,
            statusLabel: STATUS_LABELS.connected,
            connection: Socket,
            users: [],
            session,
          }
        });
      });

      Socket.on('update-users', function(data) {
        console.debug('this was triggered');
        setSession(state => {
          return {
            ...state,
            users: data.users
          };
        });
      });
  
      Socket.on('disconnect', function() {
        setSession(state => {
          return {
            ...state,
            status: STATUS.disconnected,
            statusLabel: STATUS_LABELS.disconnected,
            connection: null,
            users: [],
            session: null,
          }
        });
      });
    }
  }, [cookies]);

  SessionState.isConnected = function() {
    return this.status === STATUS.connected;
  };

  SessionState.signIn = async (email, name) => {
    // @TODO: Move API into their own module
    const response = await Axios.post(`${API_URL}${USERS_API}`, {email, name});
    const session = response.data;
    // @TODO: Move socket into their own module
    const Socket = SocketIOClient(`${SOCKET_URL}?token=${session.token}`);
    Socket.on('connect', function() {
      setCookie(USER_ID_COOKIE, session);
      setSession({
        ...SessionState,
        status: STATUS.connected,
        statusLabel: STATUS_LABELS.connected,
        connection: Socket,
        session,
      });
    });

    Socket.on('disconnect', function() {
      setSession({
        ...SessionState,
        status: STATUS.disconnected,
        statusLabel: STATUS_LABELS.disconnected,
        connection: null,
        session: null,
      });
    });
  };

  return (
    <SessionContext.Provider value={SessionState}>
      {children}
    </SessionContext.Provider>
  );
}
