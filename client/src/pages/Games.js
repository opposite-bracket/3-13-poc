import React from 'react';
import {
  Table,
  Badge
} from 'react-bootstrap';

function GameMember({ gameMember }) {
  return (
    <Badge variant="info">{gameMember.name}</Badge>
  );
}

function Game({ game }) {
  return (<tr>
    <td>
      {game._id}
    </td>
    <td>
      {game.members.map(gameMember => (<GameMember key={`game-${gameMember._id}`} gameMember={gameMember} />))}
    </td>
  </tr>);
}

function Games() {

  const games = [];

  return (
    <>
      <h1>Games</h1>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>id</th>
            <th>Members</th>
          </tr>
        </thead>
        <tbody>
          {games.map(game => (<Game key={`game-${game._id}`} game={game} />))}
        </tbody>
      </Table>
    </>
  );
}

export default Games;
