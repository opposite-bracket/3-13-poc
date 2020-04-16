import React from 'react';
import { Link } from "react-router-dom";
import {
  Nav,
} from 'react-bootstrap';

function Sidebar() {

  return (
    <Nav className="flex-column">
      <Link className="nav-link" to="/">
        Home
      </Link>
      <Link className="nav-link" to="/game">
        Game
      </Link>
      <Link className="nav-link" to="/players">
        Players
      </Link>
    </Nav>
  );
}

export default Sidebar;
