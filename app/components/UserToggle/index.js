import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import style from './user-toggle.scss';

import { Authz } from '../../utils/higher-order-components.js';

const UserInfo = ({ message, email, isActive, isLoggedIn, handleLogin, handleLogout, navLabel, navPath }) => {
  const onLogOut = handleLogout
    ? handleLogout
    : (e) => handleLogin({isLoggedIn});

  return (
    <div className={ isActive ? style.info : style.off  }>
      <div className={style.logout} onClick={ onLogOut }>Sign Out</div>
      <Authz roles={['CLIENT_ADMIN', 'WW_SUPPORT', 'UBER_ADMIN']}>
        <Link className={style.logout} to={ navPath || '/admin/users' }>{ navLabel || "Admin" }</Link>
      </Authz>
      <p>{ message } <a target="_blank" href={'mailto:'+email }>{ email }</a></p>
    </div>
  )
}

class UserToggle extends Component {
  constructor (props) {
    super(props)
    this._onToggle = this._onToggle.bind(this);
    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._setWrapperRef = this._setWrapperRef.bind(this);
    this.state = { isActive: false };
  }
  componentDidMount () {
    document.addEventListener('mousedown', this._handleClickOutside);
  }
  componentWillUnmount () {
    document.removeEventListener('mousedown', this._handleClickOutside);
  }
  _onToggle () {
    this.setState({
      isActive: !this.state.isActive
    });
  }
  _setWrapperRef (node) {
    this.wrapperRef = node;
  }
  _handleClickOutside (e) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        isActive: false
      });
    }
  }
  render () {
    let isUserLoggedIn;
    if (!this.props.isLoggedIn) {
      isUserLoggedIn = <span styleName='login'>Log In</span>;
    } else {
      const { userName, firstName, lastName } = this.props.isLoggedIn;
      isUserLoggedIn =
    <div>
      <i className="fa fa-user-circle-o" styleName="user-circle"></i>
      <span
        styleName='name'
        onClick={ this._onToggle }>{ firstName || userName }</span>
      <i className="fa fa-caret-down" styleName="caret"></i>
      <UserInfo
        message='Please reach out to us with any questions or concerns at'
        email='support@wadeandwendy.ai'
        isActive={ this.state.isActive }
        isLoggedIn={ this.props.isLoggedIn }
        handleLogin={ this.props.handleLogin }
        navLabel={this.props.navLabel}
        navPath={this.props.navPath}
        handleLogout={ this.props.handleLogout } />
      </div>;
    }
    return (
      <div styleName='toggle' ref={ this._setWrapperRef }>{ isUserLoggedIn }  </div>
    )
  }
}

export default CSSModules(UserToggle, style);
