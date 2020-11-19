import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './index.css';
import * as serviceWorker from './serviceWorker';

import Live from "./Live";
import Query from "./Query";

function App() {
  return (
    <Router>
      <div>
        {/* Using Boostrap Library to improve the speed of development. */}
        <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="/">Ben Coxford IoT App</a>
        <div className="collapse navbar-collapse">
          <div className="navbar-nav">
            <Link to="/" className="nav-item nav-link">Live</Link>
            <Link to="/search" className="nav-item nav-link">Analytics</Link>
          </div>
        </div>
        </nav>

        {/* React-Router-Dom */}
        <Route path="/" exact component={Live} />
        <Route path="/search" component={Query} />
      </div>
    </Router>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);



serviceWorker.unregister();