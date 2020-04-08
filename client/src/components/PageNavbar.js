import React from 'react';
import {Nav, Navbar} from 'react-bootstrap';
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
              <Navbar.Text>
                Signed in as: <a href="#login"><Username /></a>
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
