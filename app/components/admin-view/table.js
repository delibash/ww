import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, withRouter } from 'react-router-dom';
import { Auth, Loading, Error } from '../../utils/higher-order-components';
import style from "./styles.scss";
import api from '../../utils/api';
import CSSModules from 'react-css-modules';
import { checkCache } from '../../utils/helpers';
const { getInitialData, getRoleInfo, getSession, getAdminData } = api;

import {
  Header,
  Search
} from '../index';

import {
  AdminNav,
  AdminTable,
} from './components';


class DashBoard extends Component {

  constructor({users, roles, companies}) {
    super();
    this.state = {
      error: false,
      navItems: [
        {handle: 'Users', count: users.length, isActive: true, id: 'users' },
        {handle: 'Companies', count: companies.length, isActive: false, id: 'companies' },
        {handle: 'Roles', count: roles.length, isActive: false, id: 'roles' }
      ]
    }
  }

    componentWillMount(){
      getAdminData()
        .then(res => {
            const { setRoles, setUsers, setCompanies } = this.props;
            const [roles, users, companies] = res;
            setCompanies(companies);
            setRoles(roles);
            setUsers(users);
        })
        .catch(e => console.log('error getting admin data: ', e));
    }

    componentWillReceiveProps(newProps) {
        const { users, roles, companies } = newProps;
        const [usersNav, companiesNav, rolesNav] = this.state.navItems;

        this.setState({navItems: [{...usersNav, count: users.length}, {...companiesNav, count: companies.length}, {...rolesNav, count: roles.length}]});
    }

  render () {
      const { loggedUser, onLogout, admin } = this.props;
    return (
      <Error>
        <Loading>
          <div>
              <Header
                isLoggedIn={ loggedUser }
                handleLogout={ onLogout }
                navLabel="Back to App"
                navPath="/"
              >Wade and Wendy Logo</Header>
            <section className='main-grid'>
                <div styleName="center">
                    <AdminNav navItems={ this.state.navItems } />
                    <AdminTable type={this.props.admin}/>
                </div>
            </section>
          </div>
        </Loading>
      </Error>
    )
  }

}

const mapDispatchToProps = dispatch => {
    return {
        setRoles: roles => dispatch({type: 'LOAD_ROLES_SUCCESS', payload: roles}),
        setUsers: users => dispatch({type: 'LOAD_USERS_SUCCESS', payload: users}),
        setCompanies: companies => dispatch({type: 'LOAD_COMPANIES_SUCCESS', payload: companies}),
    }
}
const connector = connect(state => ({...state.adminReducer, loggedUser: state.reducer.isLoggedIn}), mapDispatchToProps);


/* export default DashBoard;*/
export default withRouter(connector(CSSModules(DashBoard, style)));
