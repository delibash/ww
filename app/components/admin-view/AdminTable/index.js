import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import api from '../../../utils/api.js';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import style from './admin-table.scss'

const { getAdminData } = api;

const AdminButton = ({ action, handleAdminAction }) => (
  <span onClick={ handleAdminAction }>{ action }</span>
)

const RowCount = ({ count }) => (
  <div className={ style.rowCount }>
  { count > 0 ? `1-${count} of ${count}` : '0 of 0' }
  </div>
)

const UsersSearch = ({onChange, placeholder, value}) => (
  <div className={ style.search }>
    <input type='search' placeholder={placeholder || 'Search'} value={value} onChange={onChange? e => onChange(e.target.value) : ''}/>
  </div>
)

class row extends Component {
  constructor () {
    super();
    this.checkBox = this.checkBox.bind(this);
    this.state = {
      checked: false
    };
  }

  route(url) {
    return url ? this.props.history.push(url) : '';
  }

  checkBox () {
    this.props.callback(this.props.id, !this.props.checked)
  }

  renderColumns(rowObj, urlBuilder, activeKeys) {
      const keys = activeKeys && activeKeys.length ? activeKeys : rowObj ? Object.keys(rowObj) : [];
      const firstText = rowObj[keys[0]];
      const firstColumn = <td key="first" ><Link to={ urlBuilder(rowObj.id) }>{firstText}</Link></td>;

      return [firstColumn].concat(keys
          .slice(1)
          .map((c, i) => {
            if(c === 'digest') {
                return <td key={i}><Link to={`/first-time/${encodeURIComponent(rowObj[c])}`}>Set Password</Link></td>
            }
            return <td key={i}>{ rowObj[c] }</td>;
          }));
  }

  render () {
    return (
      <tr>
          {/* <td><input
              type="checkbox"
              checked={ this.props.checked }
              onChange={ this.checkBox } /></td> */}

        {this.renderColumns(this.props.data, this.props.urlBuilder, this.props.activeKeys)}
      </tr>
    )
  }
}

const Row = withRouter(row);

class Table extends Component {
  constructor () {
    super();
    this.checkRowState = this.checkRowState.bind(this);
    this.checkAllRows = this.checkAllRows.bind(this);
    this.state = {
      checkAll: false,
      filter: '',
      rowState: []
    };
  }

  componentWillReceiveProps () {
    this.setState({
      checkAll: false,
      rowState: this.props.rows.map((row, i) => row = false)
    })
  }

  checkAllRows () {
    let checkState = !this.state.checkAll;
    this.state.checkAll = checkState;

    this.setState({
      checkAll: this.state.checkAll,
      rowState: this.props.rows.map((row, i) => row = checkState)
    });
  }

  checkRowState (id, val) {
    this.state.rowState[id] = val;
    this.state.checkAll ? this.state.checkAll = !this.state.checkAll : this.state.checkAll;
    this.setState({
      checkAll: this.state.checkAll,
      rowState: this.state.rowState
    });
  }

  createHeader (rowObj, activeKeys) {
      const keys = activeKeys && activeKeys.length ? activeKeys : rowObj ? Object.keys(rowObj) : [];
      return keys.map((key, i) => <th key={i} >{ key === "digest" ? 'Sign In' : key }</th>)
  }

    urlFactory(type) {
      if(type === 'users') return id => `/admin/edit/user/${id}`;
      if(type === 'roles') return id => `/admin/edit/role/${id}`;
      if(type === 'companies') return id => `/admin/edit/company/${id}`;

        return () => '';
    }

  filterRows(rows, filter) {
      return rows
          .filter(r => Object.keys(r).map(k => r[k]).join(' ').match(new RegExp(filter)))
          .sort((a, b) => {
              const aVal = Object.keys(a).map(k => a[k]).join(' ').match(new RegExp(filter)).length;
              const bVal = Object.keys(b).map(k => b[k]).join(' ').match(new RegExp(filter)).length;
              return aVal > bVal ? 1 : -1;
          });
  }

  render () {
    const self = this;
    const singular = str => {
        if( str === 'users') return 'user';
        if( str === 'companies') return 'company';
        if( str === 'roles') return 'role';
    };
    const filteredRows = this.props.filter ? this.filterRows(this.props.rows, this.state.filter) : this.props.rows;
    return (
      <div>
        <div className={`${ style.panel } center-between`}>
          <RowCount count={ this.props.rows.length } />
          { this.props.type === 'search' ?
            <UsersSearch onChange={v => this.setState({filter: v})} value={this.state.filter} placeholder="Search..."/> :
            <div>
            <ul className={ style.panelActions}>
                <li>
                  <Link to={`/admin/create/${singular(this.props.type)}`} className={ `btn ${style.button}` }>
                    <AdminButton
                      action={ `Create ${singular(this.props.type)}` }
                      handleAdminAction={ this.handleAdminAction } />
                  </Link>
                </li>
            </ul>
            </div>
          }
        </div>
        <div className={ style.dataContainer }>
          <table>
            <thead>
              <tr>
                  {/* <th><input
                      type="checkbox"
                      checked={ this.state.checkAll }
                      onChange={ this.checkAllRows } /></th> */}
                {this.createHeader(this.props.rows[0], this.props.activeKeys)}
              </tr>
            </thead>
            <tbody>
              { filteredRows.map((row, i) => {
                return (
                  <Row
                    key={ i }
                    id={ i }
                    urlBuilder={this.urlFactory(this.props.type)}
                    data={ row }
                    activeKeys={this.props.activeKeys}
                    checked={this.state.rowState[i]}
                    callback={ this.checkRowState } />
                )
              }) }
            </tbody>
          </table>
        </div>
      </div>

    )
  }
}

class AdminTable extends Component {
  constructor () {
    super();
    this.handleAdminAction = this.handleAdminAction.bind(this);
    this.state = {};
  }

  handleAdminAction (e) {
    console.log(e)
  }

  render () {
    const { users, roles, companies, type } = this.props;
    const rows = type === 'users' ? users : type === 'companies' ? companies : roles;
    const activeKeys = type === 'users' || type === 'user'
                    ? ['name', 'email', 'roles', 'company', 'status', 'digest']
                    : type === 'companies' || type === 'company'
                    ? []
                    : type === 'roles' || type === 'search' || type === 'role'
                    ? ['jobTitle', 'location', 'status', 'company', 'externalId']
                    : []


    return (
      <div styleName='container'>
        <Table type={ type } rows={ rows } activeKeys={activeKeys}/>
      </div>
    )
  }
}

const mapStateToProps = state => state.adminReducer;
const mapDispatchToProps = dispatch => {
    return {
        setRoles: roles => dispatch({type: 'LOAD_ROLES_SUCCESS', payload: roles}),
        setUsers: users => dispatch({type: 'LOAD_USERS_SUCCESS', payload: users}),
        setCompanies: companies => dispatch({type: 'LOAD_COMPANIES_SUCCESS', payload: companies}),
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(CSSModules(AdminTable, style));
