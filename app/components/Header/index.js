import React from 'react';
import UserToggle from './../UserToggle';
import CSSModules from 'react-css-modules';
import { withRouter } from 'react-router-dom';
import style from './header.scss';

const Header = ({ children, isLoggedIn, handleLogin, handleLogout, history, uri, navPath, navLabel }) => (
    <header styleName='header'>
      <h1 
        styleName='logo'
        onClick={() => history.push('/')}
      >{ children }</h1>
      <UserToggle
        isActive={ false }
        isLoggedIn={ isLoggedIn }
        navPath={navPath}
        navLabel={navLabel}
        handleLogin={ handleLogin }
        handleLogout={ handleLogout } />
    </header>
);

Header.propTypes = {
  children: React.PropTypes.string.isRequired
};

export default withRouter(CSSModules(Header, style));
