import React, { Component } from 'react';
import { Route, withRouter, Link } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import style from './admin-nav.scss'

class AdminNav extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render () {
    return (
      <ul styleName='container'>
        { this.props.navItems.map((item, i) => {
          const validPaths = [`/admin/${item.id}`, `/admin/create/${item.id}`];
          const isActive = path => path.split("/").includes(item.id);
          const styles = isActive(this.props.location.pathname) ? "activeItem" : "item";
          const to = item.id === 'user' || item.id === 'users' ? 'users'
              : item.id === 'company' || item.id == 'companies' ? 'companies' : 'roles'
          return (
              <li
                key={ i } >
                <Link to={`/admin/${to}`} styleName={ styles }>
                  <span className={ style.handle }>{ item.handle }</span>
                  <span className={ style.count }><sup>{ item.count }</sup></span>
                </Link>
              </li>
          )
        })}
      </ul>
    )
  }
}


export default withRouter(CSSModules(AdminNav, style));
