import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Home} from "./pages/Home";
import {Orders} from "./pages/Orders";
import {Navbar} from "./components/Navbar";

function App() {
  return (
      <BrowserRouter>
          <Navbar/>
        <Switch>
          <Route path={'/'} exact>
            <Home/>
          </Route>
          <Route path={'/orders'}>
            <Orders/>
          </Route>
        </Switch>
      </BrowserRouter>
  );
}

export default App;