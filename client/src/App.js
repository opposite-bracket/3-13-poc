import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.scss'
import { SessionProvider } from './providers/SessionConnection';
import { CookiesProvider } from 'react-cookie';
import {
  Container,
    Row,
    Col
} from 'react-bootstrap';
import PageNavbar from './components/PageNavbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Game from './pages/Game';
import SignIn from './pages/SignIn';
import Players from './pages/Players';

function App() {
  return (
    <Router>
      <CookiesProvider>
        <SessionProvider>
          <Container fluid className="pl-0 pr-0">
            <PageNavbar />

            <div className="ml-3 mr-3 mt-3">
              <Row>
                <Col sm="2">
                  <Sidebar />
                </Col>
                <Col sm="10">
                  <Switch>
                    <Route exact path="/">
                      <Home />
                    </Route>
                    <Route exact path="/game">
                      <Game />
                    </Route>
                    <Route exact path="/players">
                      <Players />
                    </Route>
                    <Route exact path="/sign-in">
                      <SignIn />
                    </Route>
                  </Switch>
                </Col>
              </Row>
            </div>
          </Container>
        </SessionProvider>
      </CookiesProvider>
    </Router>
  );
}

export default App;
