import React from 'react';
//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { HashRouter as Router, Route, Switch} from 'react-router-dom';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import FirstTime from './components/Set-Password';
import Root from './components/root-component/root';
import './sass/app.scss';

import RoleView from './components/role-details-view/index';

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk),
);

ReactDOM.render(
    <Router>
        <Provider store={ store }>
            <div>
                <Switch>
                    <Route path="/first-time/:digest" component={FirstTime}/>
                    <Root/>
                </Switch>
            </div>
        </Provider>
    </Router>,
  document.getElementById('root')
);
