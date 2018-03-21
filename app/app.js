import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Auth, Loading } from './utils/higher-order-components';
import api from './utils/api';
const { getInitialData, getRoleInfo, getSession } = api;
import {
  sortId,
  sortRole,
  sortDate,
  sortRank,
  sortDateReverse,
  sortDateComplete,
  sortDateInvited,
  sortRankReverse,
  filterRoles,
  toggleButton,
  login,
  loadState,
  checkDefaultState,
  logout
} from './actions';

import {
  Header,
  Roles,
  Search,
  Applicants,
  RoleCard,
  LoginScreen
} from './components';


import { applicants } from './mockDataApi';

const createHandlers = (dispatch) => {
  const dispatchDefaultState = (payload) => dispatch(checkDefaultState(payload));
  const dispatchLoadState = (payload) => dispatch(loadState(payload));
  const dispatchToggle = (payload) => dispatch(toggleButton(payload));
  const dispatchLogin = (payload) => dispatch(login(payload));
  const dispatchFilter = (payload) => dispatch(filterRoles(payload));
  const dispatchLogout = (payload) => dispatch(logout(payload));
  const dispatchSort = (target, payload) => {
    switch(target) {
      case sortId().type:
        dispatch(sortId(payload));
        break;
      case sortRole().type:
        dispatch(sortRole(payload));
        break;
      case sortRank().type:
        dispatch(sortRank(payload));
        break;
      case sortDate().type:
        dispatch(sortDate(payload));
        break;
      case sortRankReverse().type:
        dispatch(sortRankReverse(payload));
        break;
      case sortDateReverse().type:
        dispatch(sortDateReverse(payload));
        break;
      case sortDateComplete().type:
        dispatch(sortDateInvited(payload));
        break;
      case sortDateInvited().type:
        dispatch(sortDateInvited(payload));
        break;
      default:
        return payload;
        break;
    }
  }
  return {
    dispatchDefaultState,
    dispatchLoadState,
    dispatchFilter,
    dispatchSort,
    dispatchToggle,
    dispatchLogin,
    dispatchLogout
  }
}

class DashBoard extends Component {
  constructor (props) {
    super(props);
    this.state = { loading: true };
  }
  componentWillMount () {
    getInitialData()
      .then(this.props.dispatchLoadState)
      .then(() => this.setState({ loading: false }));
  }

  render () {
    const { loading } = this.state;

    return (
      <Loading loading={loading}>
        <div>
          <Header
            isLoggedIn={ this.props.appProps.isLoggedIn }
            handleLogin={ this.props.onLogin }
            userName={ this.props.appProps.userName }
            handleLogout={ this.props.appProps.onLogout }>Wade and Wendy Logo</Header>
          <section className='main-grid'>
            <div className='grid__item'>
              <Search
                searchString='Search'
                roles={ this.props.appProps.roles }
                applicants={ applicants } />
              <Roles
                roles={ this.props.appProps.roles }
                isActive={ this.props.appProps.role.isActive }
                handleClick={ this.props.onClick }
                handleChange={ this.props.onChange } />
            </div>
            <div className='grid__item'>
              <RoleCard
                props={ this.props.appProps }
                handleToggle={ this.props.onToggle } />
              <Applicants
                role={ this.props.appProps.role.candidates }
                handleChange={ this.props.onChange } />
            </div>
          </section>
        </div>
      </Loading>
    )
  }

}

class AppComponent extends Component {
  constructor(props) {
    super(props);

    this.actionCreators = createHandlers(this.props.dispatch);
    this._handleClick = this._handleClick.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleToggle = this._handleToggle.bind(this);
    this._handleLogin = this._handleLogin.bind(this);
    this.state = { loading: true }
  }
  _handleClick (role) {
    this.actionCreators.dispatchFilter(role);
  }
  _handleChange (payload, target) {
    this.actionCreators.dispatchSort(target, payload);
  }
  _handleToggle (toggleState) {
    this.actionCreators.dispatchToggle(toggleState);
  }
  _handleLogin (loggedInState) {
    this.actionCreators.dispatchLogin(loggedInState)
  }
  _handleLogout (loggedInState) {
    this.actionCreators.dispatchLogout(loggedInState)
  }
  componentWillMount () {
    getSession()
      .then(data => this.actionCreators.dispatchDefaultState(data))
      .then(() => this.setState({loading: false}))
      .catch(() => {
        this.actionCreators.dispatchDefaultState(false);
        this.setState({loading: false});
      })
  }

  render() {
    const { loading } = this.state;
    return (
      <Loading loading={loading}>
        <main id='main' role='main'>
          <Auth>
            <DashBoard
              userId={ this.props.reducer.isLoggedIn.id }
              dispatchLoadState={ this.actionCreators.dispatchLoadState }
              appProps={ this.props.reducer }
              onClick={ this._handleClick }
              onChange={ this._handleChange }
              onToggle={ this._handleToggle }
              onLogin={ this._handleLogin }

              onLogout={ this._handleLogout } />
          </Auth>
        </main>
      </Loading>
    )
  }

}

const mapStateToProps = (state) => {
  const { reducer } = state;
  return {
    reducer
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  }
};

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;
