import React from 'react';
import { Link } from "react-router-dom";
import {
  Nav,
  Navbar
} from 'react-bootstrap';
import Username from './Username';
import ConnectionStatus from './ConnectionStatus';

function PageNavbar() {

  return (
    <>
      <Navbar bg="light">
        <Navbar.Brand>
          3 - 13
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
            <Link className="nav-link" to="/">Home</Link>
              <Link className="nav-link mr-5" to="/board">Board</Link>
              <Navbar.Text>
                Signed in as: <Username />
              </Navbar.Text>
              <Navbar.Text className="ml-3 pt-2">
                <ConnectionStatus />
              </Navbar.Text>
            </Nav>
          </Navbar.Collapse>

      </Navbar>
    </>
  );
}

export default PageNavbar;
