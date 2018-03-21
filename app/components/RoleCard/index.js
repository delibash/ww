import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import ATS from './../ATS';
import style from './role-card.scss';
import { fieldTypes } from './../../mockData';
import { Loading } from '../../utils/higher-order-components.js';
import Spinner from '../Spinner/index.js';

const RoleCard = ({ props, handleToggle }) => {
    const { role } = props;
    const loading = !role.title;

    return (
        <div styleName='role-card'>
            <Loading
                loading={loading}
                loadingComponent={<div styleName="spinner"><Spinner text="Loading Role Info..."/></div>}
            >
                <div styleName='non-ats'>
                    <div styleName='role-card__role'>
                    <span styleName='small-label'>{ props.role.id }</span>
                    <h2>{ props.role.title }</h2>
                    </div>
                    <div styleName='role-card__info'>
                    <p>
                        <span styleName='small-label'>Location</span>
                        <span>{ props.role.location }</span>
                    </p>

                    </div>
                </div>
            </Loading>
        </div>
    )
};

RoleCard.propTypes = {};

export default CSSModules(RoleCard, style);
