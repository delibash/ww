import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { Link, NavLink, withRouter } from 'react-router-dom';
import Select from './../Select';
import { Loading } from '../../utils/higher-order-components.js';
import Spinner from '../Spinner/index.js';

import style from './candidates.scss';

const candidate = ({ person, active, onClick, uri, history, location }) => {
  const { full, id, email } = person;
  const route = url => () => history.push(url);
  const isActive = location.pathname === `${uri}/${id}`;

  return (
    <li onClick={route(`${uri}/${id}`)} className={ isActive ? style.active : ''}>
      <div>
        <div className={ style.jobId }>
          <span>{ email || '' }</span>
        </div>
        <span className={ style.jobTitle }>{ full }</span>
      </div>
      <sup className={ style.num }></sup>
    </li>
  )
}

const Candidate = withRouter(candidate);

const Candidates = ({candidates, activeCandidateId, uri, role, history}) => {
  const clicker = person => () => onClick(person);
  const isActive = person => activeCandidateId === person.person.id;
  const backUri = "/" + uri.split("/")[2];
  const cands = candidates || [];
  const numCandidates = cands.length;
  const loading = candidates === null;
  console.log('role: ', role);

  return (
    <div styleName='roles'>
      <div styleName='roles-sort'>
        <span>{ numCandidates } Applicants</span>
      </div>
      <div styleName="role-card">
        <div onClick={() => history.push(backUri)}>
          <span styleName="jobId">
            <i style={{marginRight: '3px'}} className="fa fa-arrow-left" aria-hidden="true"/>
            BACK TO ROLES LIST
          </span>
        </div>
        <span styleName="jobId">{role.id}</span>
        <span styleName="jobTitle">{role.title || role.jobTitle}</span>
      </div>

      <Loading
          loading={loading}
          loadingComponent={<Spinner text="Loading Applicants"/>}
      >
        <ol styleName='roles-list'>
        { cands.map((candidate, i) => {
            return( <Candidate
            active={isActive(candidate)}
            person={ candidate.person }
            dateChatted={candidate.person["date-chatted"]}
            dateInvited={candidate.person["date-invited"]}
            dateApplied={candidate.time}
            chatStatus={ candidate.person["chat-status"] ? candidate.person["chat-status"].sym.name : 'no chat' }
            uri={uri}
            key={ i } /> )
        })}
        </ol>
      </Loading>
    </div>
  )
}

export default withRouter(CSSModules(Candidates, style));
