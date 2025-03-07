/* -*- coding: utf-8 -*-

Copyright (c) 2016-2021 Rafael Villar Burke <pachi@rvburke.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import React from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/css/bootstrap-theme.css";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import AboutPage from "./AboutPage";
import ClimatePage from "./ClimatePage";
import ElementsPage from "./ElementsPage";
import BuildingPage from "./BuildingPage";
import HelpPage from "./HelpPage";
import MainPage from "./MainPage";

const App = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" render={(props) => <MainPage {...props} />} />
        <Route exact path="/building" component={BuildingPage} />
        <Route exact path="/climate" component={ClimatePage} />
        <Route exact path="/elements" component={ElementsPage} />
        <Route exact path="/help" render={(props) => <HelpPage {...props} />} />
        <Route exact path="/about" component={AboutPage} />
        <Route path="*" render={() => <Redirect to="/" />} />
      </Switch>
    </HashRouter>
  );
};

export default App;
