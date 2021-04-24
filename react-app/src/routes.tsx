// @flow 
import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Positions } from './components/Positions';
import { Mapping } from './components/Mapping';

export const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Positions} />
                <Route exact path="/mapping" component={Mapping} />
            </Switch>
        </BrowserRouter>
    );
};

