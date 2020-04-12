import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { SessionContext } from '../providers/SessionConnection';

function Username() {

  const Session = useContext(SessionContext);
  const username = Session.isConnected()
    ? Session.session.name
    : 'Guest';
  return (
    <Link to="/sign-in">{username}</Link>
  );
}

export default Username;
