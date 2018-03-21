import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, withRouter, Switch } from 'react-router-dom';
import { Auth, Loading, Error } from '../../utils/higher-order-components';
import CSSModules from 'react-css-modules';
import style from './styles.scss';
import api from '../../utils/api';
import { checkCache } from '../../utils/helpers';
const { getInitialData, getRoleInfo, getSession } = api;

import {
  Header,
  Search
} from '../index';

import {
  AdminNav,
  AdminForm,
} from './components';


class DashBoard extends Component {

  constructor({users, roles, companies}) {
    super();
    this.state = {
      error: false,
      navItems: [
        {handle: 'Users', count: users.length, isActive: true, id: 'user' },
        {handle: 'Companies', count: companies.length, isActive: false, id: 'company' },
        {handle: 'Roles', count: roles.length, isActive: false, id: 'role' }
      ],
      formItems: [
        { id: 0, name: 'Create User' },
        { id: 1, name: 'Create Company' },
        { id: 2, name: 'Create Role' },
      ]
    }
  }

  componentWillReceiveProps(newProps) {
    const { users, roles, companies } = newProps;
    const [usersNav, companiesNav, rolesNav] = this.state.navItems;

    this.setState({navItems: [{...usersNav, count: users.length}, {...companiesNav, count: companies.length}, {...rolesNav, count: roles.length}]});
  }

  render () {
      const { loggedUser, onLogout } = this.props;
    return (
      <Error>
        <Loading>
          <div>
              <Header
                  handleLogout={ onLogout }
                  isLoggedIn={ loggedUser }
                  navLabel="Back to App"
                  navPath="/"
              >Wade and Wendy Logo</Header>
            <section className='main-grid'>
              <div styleName='center'>
                <AdminNav navItems={ this.state.navItems } />
                <div styleName='middle-column'>
                <Switch>
                    <Route path='/admin/create/:type' render={({match}) => {
                    return (
                        <AdminForm
                        type={match.params.type}
                        name={ `Create ${match.params.type}` } />
                    )
                    }} />
                    <Route path='/admin/edit/:type/:id' render={({match}) => {
                    return (
                        <AdminForm
                        type={match.params.type}
                        id={+match.params.id}
                        name={ `Edit ${match.params.type}` } />
                    )
                    }} />
                </Switch>
                </div>
              </div>
            </section>
          </div>
        </Loading>
      </Error>
    )
  }

}

const connector = connect(state => ({...state.adminReducer, loggedUser: state.reducer.isLoggedIn}));

/* export default DashBoard;*/
export default withRouter(connector(CSSModules(DashBoard, style)));
