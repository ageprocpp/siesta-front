import React from 'react';
import './App.css';
import Login from './components/Login'
import Home from './components/Home'
import Scanner from './components/Scanner'
import AdminHome from './components/AdminHome'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/admin">
                        <Route exact path="/admin" component={AdminHome} />
                        <Route exact path="/admin/login" component={Login} />
                    </Route>
                    <Route>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/scanner" component={Scanner} />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
