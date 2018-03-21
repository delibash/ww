import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { fieldTypes } from './../../mockData';
import Select from './../Select';
import { rolesOptions } from './../Select/options';
import { withRouter } from 'react-router-dom';
import style from './roles.scss';
import { Loading } from '../../utils/higher-order-components.js';
import Spinner from '../Spinner/index.js';

class role extends Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
  }
  _handleClick () {
    this.props.onClick(this.props.index, this.props.role);
  }

  render () {
    const { history, activeId, role } = this.props;
    const route = () => history.push(`/${role.id}`);
    const isActive = +activeId === role.id;
    return (
      <li
        onClick={ route }
        className={ isActive ? style.active : '' }>
        <div>
          <div className={ style.jobId }>
            <span>{ this.props.role.id }</span>
          </div>
          <span className={ style.jobTitle }>{ this.props.role.title }</span>
        </div>
        <sup className={ style.num }>{ this.props.role.numCandidates }</sup>
      </li>
    )
  }
}

const Role = withRouter(role);

class Roles extends Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
  }
  _handleClick (index, role) {
    this.props.handleClick({ index, ...role });
  }
  render () {
    const { roles } = this.props;
    return (
      <div styleName='roles'>
        <div styleName='roles-sort'>
          <span>{ roles.length } Roles</span>
          <Select
            propType={ roles }
            handleChange={ this.props.handleChange }
            options={ rolesOptions } />
        </div>
        <Loading
            loading={this.props.loading}
            loadingComponent={<Spinner text="Loading Roles..."/>}
        >
            <ol styleName='roles-list'>
                { roles.map((role, i) => {
                    return( <Role
                        role={ role }
                        key={ i }
                        index={ i }
                        activeId={ this.props.activeRoleId }
                        isActive={ this.props.isActive }
                        onClick={ this._handleClick } /> )
                    })}
            </ol>
        </Loading>
      </div>
    )
  }
}

export default CSSModules(Roles, style);
