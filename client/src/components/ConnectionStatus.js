import React, { useContext } from 'react';
import { Badge } from 'react-bootstrap';
import {SessionContext, STATUS} from '../providers/SessionConnection';

const CONNECTION_VARIANT = {
  [STATUS.connected]: 'success',
  [STATUS.disconnected]: 'danger',
  [STATUS.reconnecting]: 'reconnecting',
  [STATUS.error]: 'danger',
  [STATUS.checking]: 'info',
  [STATUS.loading]: 'secondary'
};

function ConnectionStatus() {
  
  const Session = useContext(SessionContext);
  const variant = CONNECTION_VARIANT[Session.status];

  return (
    <Badge variant={variant}>{Session.statusLabel}</Badge>
  );
}

export default ConnectionStatus;
