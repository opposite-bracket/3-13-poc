import React, {useContext} from 'react';
import { Badge } from 'react-bootstrap';
import {SocketContext, STATUS} from '../providers/SocketConnection';

const CONNECTION_VARIANT = {
  [STATUS.connected]: 'success',
  [STATUS.disconnected]: 'danger',
  [STATUS.reconnecting]: 'reconnecting',
  [STATUS.error]: 'danger',
  [STATUS.checking]: 'info',
  [STATUS.loading]: 'secondary'
};

function ConnectionStatus() {
  
  const Socket = useContext(SocketContext);
  const variant = CONNECTION_VARIANT[Socket.status];

  return (
    <Badge variant={variant}>{Socket.statusLabel}</Badge>
  );
}

export default ConnectionStatus;
