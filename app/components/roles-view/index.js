import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Auth, Loading, Error } from '../../utils/higher-order-components';
import api from '../../utils/api';
import { checkCache } from '../../utils/helpers';
const { getInitialData, getRoleInfo, getSession, getApplicants } = api;

import {
  Header,
  Roles,
  Search,
  Applicants,
  RoleCard,
  LoginScreen
} from '../index';


class DashBoard extends Component {
  constructor() {
    super();
    this.state = {
      error: false
    }
  }


  setActiveRole() {
    const { onClick, appProps, roleId } = this.props
    const { roles, role } = appProps;
    if(roles && role) {
        const [newActiveRole] = roles.filter(role => role.id === +roleId);
        onClick(newActiveRole);
    }
  }

  redirectIfNoId() {
    const { roleId, history, appProps } = this.props;
    const { roles } = appProps;
    if(!roleId && roles.length > 0) {
      history.push(`/${roles[0].id}`);
    }
  }

  redirectOrSet(){
    !this.props.roleId ? this.redirectIfNoId() : this.setActiveRole();
  }

  componentWillMount () {
    const { timeStamp } = this.props.appProps;
    const roleId = this.props.roleId;

    const loadRoles = () => {
      return getInitialData()
          .then(data => {
              return data;
          })
        .then(this.props.dispatchLoadState)
        .catch((e) => {
          console.log('error: ', e);
          this.setState({error: true, loading: false})
        });
    }

    checkCache(timeStamp, loadRoles)
      .then(this.redirectOrSet.bind(this))
      .catch((e) => console.log("error: ", e));

    if(roleId) this.loadApplicants(roleId);
  }

    loadApplicants(roleId) {
       const highlightRole = this.props.onClick;
        getRoleInfo(roleId)
            .then(res => {
                const newRole = {id: res.id, location: res.unparsedLocation, title: res.jobTitle, candidates: res.applicants};
                this.props.dispatch(({type: "ADD_APPLICANTS", payload: {roleId: res.id, applicants: res.applicants}}));
                highlightRole(newRole);
            })
          .catch(e => console.log("error getting role info: ", e));
    }

  componentWillReceiveProps({roleId, appProps, history, onClick}){
    const { roles, role } = appProps;
    if(!roleId && roles.length > 0) {
      history.push(`/${roles[0].id}`);
    } else if(roles && role.id && role.id != +roleId) {
        this.loadApplicants(roleId);
    }
  }

  render () {
    const loading = this.props.appProps.loading && !this.state.error;
    const applicants = this.pr
    const { roleId } = this.props;
    return (
        /* <Error error={this.state.error}>*/
          <div>
            <Header
              isLoggedIn={ this.props.appProps.isLoggedIn }
              handleLogin={ this.props.onLogin }
              userName={ this.props.appProps.userName }
              handleLogout={ this.props.onLogout }>Wade and Wendy Logo</Header>
            <section className='main-grid'>
              <div className='grid__item'>
                <Search/>
                <Roles
                  loading={loading}
                  activeRoleId={this.props.match.params.roleId}
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
                  role={this.props.appProps.role}
                  candidates={ this.props.appProps.role.candidates }
                  handleChange={ this.props.onChange }
                  filterTypes={ this.props.filterTypes } />
              </div>
            </section>
          </div>
     // </Error>
    )
  }

}

const connector = connect(state => ({applicantCache: state.applicantCacheReducer}));

/* export default DashBoard;*/
export default withRouter(connector(DashBoard));
