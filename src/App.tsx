import React from 'react';
import './App.css';
import Login from './Login'
import Home from './Home'
import Scanner from './Scanner'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/scanner" component={Scanner} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
