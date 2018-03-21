import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import ContactButton from './../Button';
import Select from './../Select';
import MultiSelect from './../MultiSelect';
import LazyLoad from 'react-lazyload';
import { applicants } from './../Select/options';
import { statusCodes } from './codes';
import style from './applicants.scss';
import { Link } from 'react-router-dom';
import { progress } from '../../utils/helpers';
import { Loading } from '../../utils/higher-order-components.js';
import Spinner from '../Spinner/index.js';

const Placeholder = () => (
  <div className={ style.placeholder }>
    <i className={ style.spinner } />
  </div>
);


class Applicants extends Component {
  constructor () {
    super();
    this.state = {
      filteredCandidates: null,
    };
  }

    //subscribes to the filter component to update filtered list of candidates
    subscription = (filteredCandidates) => {
        this.setState({filteredCandidates});
    }

  render () {
    const loading = this.props.candidates === null;
    const { candidates } = this.props;
    const { filteredCandidates } = this.state;

    const cands = filteredCandidates || candidates || [];

    const totalCandidates = candidates ? candidates.length : 0;
    const numFilteredCandidates = filteredCandidates ? filteredCandidates.length : totalCandidates;
    const filteredIndicator = `(showing ${numFilteredCandidates} out of ${totalCandidates})`;

    return (
      <div styleName='applicants'>
        <div styleName='applicants-filter'>
             <div styleName='select'>
                <MultiSelect handleFilter={ this.updateFilters } subscription={this.subscription} candidates={candidates || []}/>
                {filteredIndicator}
             </div>
          <div styleName='select'>
            <Select
                propType={ cands }
                options={ applicants }
                handleChange={ this.props.handleChange } />
          </div>
        </div>
        <Loading
            loading={loading}
            delay={500}
            loadingComponent={<Spinner text="Loading Applicants..."/>}
        >
            <ul styleName='list'>
                <li styleName="applicant-bold">
                    <div className={ style.name }>
                        <span></span>
                    </div>
                    <div className={ style.title }>Disqualified?</div>
                    <div className={ style.title }>Date Applied</div>
                    <div className={ style.title }>Date Chatted</div>
                    <div className={ style.title }></div>
                </li>
                {cands.map((applicant, i) => {
                    return (
                        <Applicant
                            key={i}
                            roleId={applicant.opening.id}
                            dateChatted={applicant.person["date-chatted"]}
                            dateInvited={applicant.person["date-invited"]}
                            dateApplied={applicant.time}
                            atsId={applicant.person["external-id"]}
                            name={ applicant.person.full }
                            title={ applicant.opening.jobtitle.name }
                            id={ applicant.person.id }
                            location={ applicant.location }
                            chatStatus={ applicant.person["chat-status"] ? applicant.person["chat-status"].sym.name : 'no chat' }
                            status={ applicant.status }
                            isDisqualified={applicant["disqualified?"]} />
                    )
                })}
            </ul>
        </Loading>
      </div>
    )
  }
}

const Applicant = ({ id, name, title, location, status, roleId, chatStatus, dateChatted, dateApplied, dateInvited, atsId, isDisqualified }) => {
  const btn = statusCodes.get(status);
  const formatAts = id => id.split('::')[2];
  const prog = progress({dateApplied, dateChatted, dateInvited, chatStatus});
  const parseDate = dateTime => dateTime.split(" ").slice(0, 3).join(" ");
  return (
    <li className={ style.applicant }>
      <div className={ style.name }>
        <Link to={`/role/${roleId}/${id}`}> <span>{ name || '' }</span> </Link>
      </div>
      <div className={ style.title }>{isDisqualified ? "Yes" : "-"}</div>
      <div className={ style.title }>{parseDate(dateApplied)}</div>
      <div className={ style.title }>{dateChatted ? parseDate(dateChatted) : "-"}</div>
      <div className={ style.title }>
          <ContactButton {...prog}/>
      </div>
    </li>
  )
}

export default CSSModules(Applicants, style);
