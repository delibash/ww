import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { applicants } from '../../mockDataApi'; import api from '../../utils/api';
import Candidates from '../candidate-list/index';
import CandidateCard from '../candidate-card/index';
import Candidate from '../Candidate/index';
import { Auth, Loading, Error } from '../../utils/higher-order-components';
const { getInitialData, getSession, getApplicant, getRoleInfo } = api;
import { checkCache } from '../../utils/helpers';

import {
  Header,
  Roles,
  Search,
  Applicants,
  RoleCard,
  LoginScreen
} from '../index';

const shapeCandidate = (responseObj) => {
  const applicantCard = responseObj.applicantCard;
  return {
    opening: {
      id: responseObj.role.id,
      jobTitle: {
        name: responseObj.role.jobTitle
      }
    },
    person: {
      full: responseObj.candidate.name,
      id: responseObj.candidate.id,
      dateInvited: applicantCard ? responseObj.applicantCard.candidate["date-invited"] : null,
        chatStatus: applicantCard ? responseObj.applicantCard.candidate["chat-status"]
                  ? responseObj.applicantCard.candidate["chat-status"].sym.name : 'not complete' : null,
      dateApplied: applicantCard ? responseObj.applicantCard.candidate["date-applied"] : null,
      ats: {
        name:'',
        id: responseObj.applicantCard ? responseObj.applicantCard.candidate["greenhouse-id"] : ''
      }
    },
    transcript: responseObj.applicantCard ? responseObj.applicantCard.transcript : null,
    answers: responseObj.applicantCard ? responseObj.applicantCard.answers : null,
    timeStamp: new Date().getTime()
  }
};

class Dash extends Component {
  constructor(){
    super();
    this.state = {
      error: false
    }
  }

  componentWillMount(){
    const { roleId, dispatch, timeStamp, applicantId } = this.props;

    const loader = () => {
      return Promise.all([getRoleInfo(roleId), getApplicant(roleId, applicantId)])
        .then(([role, applicant]) => {
          const activeRole = { ...role, candidates: role.applicants };
          const activeCandidate = shapeCandidate(applicant);
          if(role.id !== null) dispatch({type: "ADD_APPLICANTS", payload: {roleId: role.id, applicants: role.applicants}});
          dispatch({type: "LOAD_ROLE_SUCESS", payload: {...activeRole, activeCandidate}});
        })
        .catch((error) => {
          console.log("error getting applicant or role info: ", error)
          this.setState({error: true})
        });
    }

    loader();

  }

  componentWillReceiveProps({applicantId, dispatch, role, activeCandidate, roleId, roles}) {
    if(activeCandidate && !activeCandidate[applicantId]) {

      const [role] = roles.filter(role => role.id === +roleId);
      return Promise.all([getRoleInfo(roleId), getApplicant(roleId, applicantId)])
        .then(([role, applicant]) => {
          const activeRole = { ...role, candidates: role.applicants };
          const activeCandidate = shapeCandidate(applicant);
          if(role.id !== null) dispatch({type: "ADD_APPLICANTS", payload: {roleId: role.id, applicants: role.applicants}});
          dispatch({type: "LOAD_ROLE_SUCESS", payload: {...activeRole, activeCandidate}});
        })
        .catch((error) => {
          console.log("error getting applicant or role info: ", error)
          this.setState({error: true})
        });
    }
  }

  render() {
    const {
      onLogin,
      onLogout,
      roleId,
      role,
      appProps,
      isLoggedIn,
      userName,
      roles,
      dispatch,
      applicantCache,
      applicantId
    } = this.props;
    const { loading, candidates } = role;
    const applicants = role.id && applicantCache.roleId ? applicantCache.roleId.data : [];
    const activeCandidate = role.activeCandidate[applicantId];
    const candidateName = activeCandidate ? activeCandidate.person.full : '';
    const chatStatus = activeCandidate ? activeCandidate.person.chatStatus : '';
    const dateInvited = activeCandidate ? activeCandidate.person.dateInvited : '';
    const dateApplied = activeCandidate ? activeCandidate.person.dateApplied : '';
    const atsId = activeCandidate ? activeCandidate.person.ats.id : '';
    const {answers, transcript} = activeCandidate
      ? activeCandidate : {answers: 'loading', transcript: 'loading'};

    return (
      <Error error={this.state.error} >
          <div>
            <Header
              isLoggedIn={ isLoggedIn }
              handleLogin={ onLogin }
              handleLogout={ onLogout }
              userName={ userName }>Wade and Wendy Logo</Header>
            <section className='main-grid'>
              <div className='grid__item'>
                <Search/>
                <Candidates
                  candidates={candidates}
                  activeCandidate={activeCandidate}
                  activeCandidateId={+applicantId}
                  uri={`/role/${roleId}`}
                  role={role}
                />
              </div>
              <div className='grid__item'>
                <CandidateCard
                  name={candidateName}
                  chatStatus={chatStatus}
                  dateApplied={dateApplied}
                  dateInvited={dateInvited}
                  atsId={atsId}
                  email="Some Email" />
                <Candidate
                  answers={answers}
                  transcript={transcript}
                  loaded={!!activeCandidate}
                  candidateName={candidateName} />
              </div>
            </section>
          </div>
      </Error>
    )
  }
}

const connector = connect(state => {
  return {
    isLoggedIn: state.reducer.isLoggedIn,
    role: state.roleReducer,
    userName: state.reducer.userName,
    roles: state.reducer.roles,
    timeStamp: state.reducer.timeStamp,
    activeCandidate: state.roleReducer.activeCandidate,
    applicantCache: state.applicantCacheReducer,
    applicants: state.reducer.applicants
  }
})

const DashBoard = connector(Dash);


export default DashBoard;
