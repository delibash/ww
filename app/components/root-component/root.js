import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import api from '../../utils/api'
import { Auth, Loading, Authz } from '../../utils/higher-order-components';
import AdminFormView from '../admin-view/form';
import AdminTableView from '../admin-view/table';
import RoleView from '../role-details-view/index';
import RootView from '../roles-view/index';
import PageNotFound from '../404/index';
import FirstTime from '../Set-Password';
import TermsOfUse from '../terms-of-use/index';
const { getInitialData, getRoleInfo, getSession } = api;
const logoutCall = api.logout;
import {
  sortId,
  sortRole,
  sortDate,
  sortRank,
  sortDateReverse,
  sortRankReverse,
  sortDateComplete,
  sortDateInvited,
  sortDateCompleteReverse,
  sortDateInvitedReverse,
  filterRoles,
  toggleButton,
  login,
  loadState,
  checkDefaultState,
  logout
} from '../../actions';

import {
  Header,
  Roles,
  Search,
  Applicants,
  RoleCard,
  Notification,
  LoginScreen
} from '../index';

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
      case sortDateReverse().type:
        dispatch(sortDateReverse(payload));
        break;
      case sortDateComplete().type:
        dispatch(sortDateComplete(payload));
        break;
      case sortDateInvited().type:
        dispatch(sortDateInvited(payload));
        break;
      case sortDateCompleteReverse().type:
        dispatch(sortDateCompleteReverse(payload));
        break;
      case sortDateInvitedReverse().type:
        dispatch(sortDateInvitedReverse(payload));
        break;
      case sortRankReverse().type:
        dispatch(sortRankReverse(payload));
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

class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.actionCreators = createHandlers(this.props.dispatch);
    this._handleClick = this._handleClick.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleToggle = this._handleToggle.bind(this);
    this._handleLogin = this._handleLogin.bind(this);
    this._handleLogout = this._handleLogout.bind(this);
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
    logoutCall()
        .then(() => {
            this.actionCreators.dispatchLogout(loggedInState);
            this.props.dispatch({type: "EMPTY_CACHE"});
            this.props.history.push('/');
        });
  }
  componentWillMount () {
    getSession()
      .then(data => this.actionCreators.dispatchDefaultState(data))
      .then(() => this.setState({loading: false}))
      .catch((e) => {
        console.log("error getting session! ", e);
        this.actionCreators.dispatchDefaultState(false);
        this.setState({loading: false});
      })
  }

  render() {
    return (
      <main id='main' role='main'>
        <Switch>
          <Route path="/terms-of-use" component={TermsOfUse}/>

          <Route path="/admin" render={() => (
            <Authz alternative={PageNotFound} roles={['CLIENT_ADMIN', 'WW_SUPPORT', 'UBER_ADMIN']} >
                <Switch>
                    <Route exact path='/admin/:type' render={({match}) => {
                        return (
                        <AdminTableView
                            onLogout={this._handleLogout}
                            admin={ match.params.type } />
                        )
                    }}/>

                    <Route exact path='/admin/create/:type' render={({match}) => {
                        return (
                        <AdminFormView
                            onLogout={this._handleLogout}
                            admin={ match.params.type } />
                        )
                    }}/>

                    <Route exact patch='/admin/edit/:type/:id' render={({match}) => {
                        return (
                        <AdminFormView
                            onLogout={this._handleLogout}
                            admin={ match.params.type } id={ +match.params.id }/>
                        )
                    }}/>
                </Switch>
            </Authz>

          )} />

          <Route exact path="/:roleId" render={({match}) => {
            const userId = this.props.reducer.isLoggedIn ? this.props.reducer.isLoggedIn.id : null;
            return(
              <Auth>
                <RootView
                  userId={ userId }
                  dispatchLoadState={ this.actionCreators.dispatchLoadState }
                  appProps={ this.props.reducer }
                  onClick={ this._handleClick }
                  onChange={ this._handleChange }
                  onToggle={ this._handleToggle }
                  onLogin={ this._handleLogin }
                  onLogout={ this._handleLogout }
                  roleId={ +match.params.roleId }
                />
              </Auth>
            )
          }}/>

          <Route exact path="/" render={() => {
            const userId = this.props.reducer.isLoggedIn ? this.props.reducer.isLoggedIn.id : null;
            return(
              <Auth>
                <RootView
                  userId={ userId }
                  dispatchLoadState={ this.actionCreators.dispatchLoadState }
                  appProps={ this.props.reducer }
                  onClick={ this._handleClick }
                  onChange={ this._handleChange }
                  onToggle={ this._handleToggle }
                  onLogin={ this._handleLogin }
                  onLogout={ this._handleLogout }
                  roleId={ undefined }
                />
              </Auth>
            )
          }}/>

          <Route exact path="/role/:roleId/:applicantId" render={({match}) => {
            return (
              <Auth>
                <RoleView
                  roleId={ match.params.roleId }
                  applicantId={ match.params.applicantId }
                  onLogout={ this._handleLogout }
                  onLogin={ this._handleLogin }
                />
              </Auth>
            )
          }}/>

          <Route component={PageNotFound}/>
        </Switch>
        { this.props.notification.open ? <Notification noticeText={this.props.notification.text} onClose={this.props.close}/> : '' }
      </main>
    )
  }

}

const mapStateToProps = (state) => {
  const { reducer, notification } = state;
  return {
      reducer,
      notification
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    close: () => dispatch({type: 'CLOSE'})
  }
};

const App = withRouter(connect(mapStateToProps, mapDispatchToProps)(AppComponent));

export default App;
