import React, { useContext } from 'react';
import {
  Table,
  Badge
} from 'react-bootstrap';
import { SessionContext } from '../providers/SessionConnection';

function Player({ user }) {
  return (<tr>
    <td>
      {user.name}
    </td>
    <td>
      <Badge variant="success">Connected</Badge>
    </td>
  </tr>);
}

function Players() {

  const Session = useContext(SessionContext);
  // console.log('displaying', Session.users);

  return (
    <>
      <h1>Players</h1>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Session.users.map(user => (<Player key={`user-${user._id}`} user={user} player />))}
        </tbody>
      </Table>
    </>
  );
}

export default Players;
