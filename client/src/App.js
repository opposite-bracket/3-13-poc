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
  Container
} from 'react-bootstrap';
import PageNavbar from './components/PageNavbar';
import Home from './pages/Home';
import Board from './pages/Board';
import SignIn from './pages/SignIn';

function App() {
  return (
    <Router>
      <CookiesProvider>
        <SessionProvider>
          <Container fluid className="pl-0 pr-0">
            <PageNavbar />

            <div className="ml-3 mr-3 mt-3">
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/board">
                  <Board />
                </Route>
                <Route exact path="/sign-in">
                  <SignIn />
                </Route>
              </Switch>
            </div>
          </Container>
        </SessionProvider>
      </CookiesProvider>
    </Router>
  );
}

export default App;
