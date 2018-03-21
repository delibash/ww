import React from 'react';
import CSSModules from 'react-css-modules';
import style from './styles.scss';
import ContactButton from '../Button/index';
import { progress } from '../../utils/helpers';
import { Loading } from '../../utils/higher-order-components.js';
import Spinner from '../Spinner/index.js';



const CandidateCard = ({name, email, atsId, chatStatus, dateInvited, dateApplied}) => {
  const loading = !name || !email;
  return (
    <div >
        <Loading
            loading={loading}
            loadingComponent={<Spinner text="Loading Applicant Info..."/>}
        >
            <div styleName='role-card'>
                <div>
                    {atsId ? <div styleName="small-label">ATS Id: {atsId}</div> : ""}
                    <div styleName="large-label">{name}</div>
                </div>
                <ContactButton {...progress({dateInvited, chatStatus, dateApplied})}/>
            </div>
        </Loading>
    </div>
  )
}

export default CSSModules(CandidateCard, style);
