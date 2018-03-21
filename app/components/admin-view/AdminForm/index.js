import React, { Component } from 'react';
import AdminTable from './../AdminTable';
import { connect } from 'react-redux';
import api from '../../../utils/api.js';
import { Authz } from '../../../utils/higher-order-components.js';
import CSSModules from 'react-css-modules';
import { withRouter } from 'react-router-dom';
import style from './admin-form.scss';

const { createUser, getUser, updateUser, getAdminData, getRole, createRole, updateRole, getCompany, updateCompany, createCompany } = api;

import {
  Notification
} from './../../index';

const extractValue = func => e => func(e.target.value);

const AdminButton = ({ action }) => (
  <button
    type='submit'
    className={ style.btn }>{ action }</button>
);

const Input = ({ label, value, labelId, onChange, placeholder }) => (
  <div>
    <label htmlFor={ labelId }>{ label }</label>
    <input value={value} placeholder={ placeholder || value } id={ labelId } name={ labelId } type='text' onChange={onChange}/>
  </div>
)

class CheckBox extends Component {
    constructor(props){
        super(props);
        this.state = { checked: props.checked || false};
    }

    componentWillReceiveProps(newProps) {
        this.setState({checked: newProps.checked});
    }

    toggle(onToggle) {
        return () => {
            const newState = !this.state.checked;
            onToggle(newState);
            this.setState({checked: newState});
        }
    }

    render(){
        const { label, labelId, onToggle = console.log } = this.props;
        return(
            <div className={ style.checkbox }>
                <label htmlFor={ labelId }>{ label }</label>
                <input id={ labelId } name={ labelId } type='checkbox' checked={this.state.checked} onChange={this.toggle(onToggle)}/>
            </div>
        )
    }
}

const TextArea = ({ label, labelId, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={ labelId }>{ label }</label>
    <textarea id={ labelId } rows='5' name='textarea' placeholder={placeholder} value={value} onChange={onChange}></textarea>
  </div>
)

const Select = ({ label, options, labelId, onChange, value }) => (
  <div className={ style.select }>
    <label htmlFor={ labelId }>{ label }</label>
    <select id={ labelId } onChange={onChange} value={value}>
      <option value={null}>None Selected</option>
      {options.map((option, i) => {
        const value = typeof option === 'object' ? option.value : option;
        const label = typeof option === 'object' ? option.label : option;
        return(
          <option key={i} value={ value }>{ label }</option>
        )
      })}
    </select>
  </div>
)

const Fieldset = ({ type }) => (
  <div className={ style.divider }> { type } </div>
)

const roleMapStateToProps = state => ({...state.adminRoleReducer, users: state.adminReducer.users, companies: state.adminReducer.companies});
const roleMapDispatchToProps = dispatch => {
    return {
        setRoleTitle: title => dispatch({type: 'SET_ROLE_TITLE', payload: title}),
        setLocation: location => dispatch({type: 'SET_LOCATION', payload: location}),
        setDepartment: department => dispatch({type: 'SET_DEPARTMENT', payload: department}),
        setDescription: description => dispatch({type: 'SET_ROLE_DESCRIPTION', payload: description}),
        setCompany: id => dispatch({type: 'SET_ROLE_COMPANY', payload: id}),
        addAssignee: id => dispatch({type: 'ADD_ROLE_ASSIGNEE', payload: id}), //adds a recruiter to the list of assignees
        setAssignee: id => {
            const payload = id === 'None Selected' ? [] : [id];
            const action = {type: 'SET_ROLE_ASSIGNEES', payload};
            dispatch(action) //sets a recruiter as the only assignee
        }
    }
}
const roleConnector = connect(roleMapStateToProps, roleMapDispatchToProps);

const RolesForm = roleConnector((props) => {
    const { actions, jobTitle, unparsedLocation, department, description, orgId, assignees, type, companies, users } = props;
    const { setRoleTitle, setLocation, setDepartment, setCompany, addAssignee, setDescription, cancel, setAssignee } = props;
    const filterUsersPredicate = orgId => user => orgId ? +user.organizationID === +orgId : true;
    const filteredUsers = users.filter(filterUsersPredicate(orgId));
    const filteredOrgs = companies.filter(c => c.id === orgId);
    const company = filteredOrgs[0] ? filteredOrgs[0].name : '';
    return (
      <fieldset>
        <section>
        <div>
            <Fieldset type={ <Input label='Role Title' value={jobTitle} placeholder='Role Title' onChange={extractValue(setRoleTitle)} /> } />
        </div>
        </section>
        <section className={ style.grid }>
            <div className={ style.gridItem }>
                <Fieldset type={ <Select label='Company' value={+orgId} onChange={extractValue(setCompany)} options={companies.map(c => ({label: c.name, value: +c.id}))} /> } />
            </div>
            <div className={ style.gridItem }>
                <Fieldset type={ <Input label='Location' value={unparsedLocation} placeholder='Role Location' onChange={extractValue(setLocation)} /> } />
            </div>
        </section>
        <section>
        <div>
            <Fieldset type={ <TextArea label='Description' value={description} placeholder='Role Description' onChange={extractValue(setDescription)}/> } />
        </div>
        </section>
        <section className={ style.grid }>
        <div className={ style.gridItem }>
            <Fieldset type={ <Select label='Assigned User' value={assignees[0]} options={filteredUsers.map(u => ({label: u.userName, value: u.id}))} onChange={extractValue(setAssignee)}/> } />
        </div>
        <div className={ style.gridItem }>
            <p>{`If None is selected, role will appear for all users of ${company || 'the company you select'}.`}</p>
        </div>
        </section>
        <section className={ style.controls }>
          <button className={style.btn} onClick={cancel}>Cancel</button>   
        { actions.map((action, i) => {
            return (
            <AdminButton
                key={ i }
                action={ action } />
            )
        })}
        </section>
    </fieldset>
  )
})


const orgMapStateToProps = state => ({...state.companyReducer, users: state.adminReducer.users});
const orgMapDispatchToProps = dispatch => {
    return {
        setName: name => dispatch({type: 'SET_COMPANY_NAME', payload: name}),
        setDescription: description => dispatch({type: 'SET_COMPANY_DESCRIPTION', payload: description}),
        setDomain: domain => dispatch({type: 'SET_COMPANY_DOMAIN', payload: domain}),
        setAccountManager: id => dispatch({type: 'SET_ACCOUNT_MANAGER', payload: id})
    }
}
const orgConnector = connect(orgMapStateToProps, orgMapDispatchToProps);


const CompaniesForm = orgConnector((props) => {
  const { actions, name, description, domain, type, users, cancel, id, accountManagerId } = props;
  const { setName, setDescription, setDomain, setAccountManager } = props;
  const filteredUsers = users.filter(u => Array.isArray(u.roles) ? u.roles.includes("WW_SUPPORT") : false);
  const parsedUsers = filteredUsers.map(u => ({label: u.userName, value: u.id}));
  return (
    <fieldset>
        <section className={ style.grid }>
            <div className={ style.gridItem }>
                <Fieldset type={ <Input labelId='name' label='Company Name' value={name} onChange={extractValue(setName)} placeholder='Company Name' /> } />
            </div>
            <div className={ style.gridItem }>
                <Fieldset type={ <Input labelId='domain' label='Company Domain' placeholder='your website address here...' value={domain} onChange={extractValue(setDomain)} /> } />
            </div>
        </section>
        <section className={ style.grid }>
        <div className={ style.gridItem }>
            <Fieldset type={ <Select labelId='account_manager' label='Account Manager' options={parsedUsers} value={accountManagerId} onChange={extractValue(setAccountManager)} /> } />
        </div>
        </section>
        <section className={ style.controls }>
          <button className={style.btn} onClick={cancel}>Cancel</button>
        { actions.map((action, i) => {
            return (
            <AdminButton
                key={ i }
                action={ action } />
            )
        })}
        </section>
    </fieldset>
  )
})

const userMapStateToProps = state => ({...state.userReducer, companies: state.adminReducer.companies});
const userMapDispatchToProps = dispatch => {
    return {
        setFirstName: name => dispatch({type: 'SET_FIRST_NAME', payload: name}),
        setLastName: name => dispatch({type: 'SET_LAST_NAME', payload: name}),
        setUserName: name => dispatch({type: 'SET_USER_NAME', payload: name}),
        setCompany: orgId => dispatch({type: 'SET_USER_COMPANY', payload: parseInt(orgId)}),
        addRole: role => dispatch({type: 'ADD_USER_ROLE', payload: role}),
        removeRole: role => dispatch({type: 'REMOVE_USER_ROLE', payload: role}),
        setRoles: roleList => dispatch({type: 'SET_USER_ROLES', payload: roleList}),
        setActivity: bool => dispatch({type: 'SET_STATUS', payload: bool})
    }
}
const userConnector = connect(userMapStateToProps, userMapDispatchToProps);



const UsersForm = userConnector((props) => {
    const {actions, companies, roles, firstName, lastName, organizationID, password, userName, cancel, active} = props;
    const {setCompany, setFirstName, setLastName, sePassword, setUserName, addRole, removeRole, setActivity} = props;
    const filteredOrgs = companies.filter(c => c.id === organizationID);
    const org = filteredOrgs[0] ? filteredOrgs[0].name : '';
    const toggleRole = role => bool => bool ? addRole(role) : removeRole(role);
    return (
        <fieldset>
            <section className={ style.grid }>
            <div className={ style.gridItem }>
                <Fieldset type={ <Input
                                    labelId='first_name'
                                    label='First Name'
                                    value={firstName}
                                    placeholder='First Name'
                                    onChange={extractValue(setFirstName)} /> } />
            </div>
            <div className={ style.gridItem }>
                <Fieldset type={ <Input
                                    labelId='last_name'
                                    label='Last Name'
                                    value={lastName}
                                    placeholder='Last Name'
                                    onChange={extractValue(setLastName)} /> } />
            </div>
            </section>
            <section className={ style.grid }>
                <div className={ style.gridItem }>
                    <Fieldset type={ <Select
                                        labelId='company'
                                        label='Company'
                                        onChange={extractValue(setCompany)}
                                        value={organizationID}
                                        options={companies.map(c => ({label: c.name, value: c.id}))} /> } />
                </div>

                <div className={ style.gridItem }>
                    <Fieldset type={ <Input
                                        labelId='email'
                                        label='Email'
                                        placeholder='Email'
                                        onChange={extractValue(setUserName)}
                                        value={userName} /> } />
                </div>
            </section>
            <section className={ style.grid }>
                <div className={ style.gridItem }>
                <Fieldset type={ <Select
                                        labelId='status'
                                        label='Status'
                                        onChange={extractValue(setActivity)}
                                        value={active}
                                        options={[{label: "Inactive", value: false}, {label: "Active", value: true}]} /> } />
                </div>
            </section>
            <section className={ style.grid }>
                <Fieldset type={ <CheckBox label={`User (${org})`} labelId='user' onToggle={toggleRole('RECRUITER')} checked={roles.includes('RECRUITER')} /> } />
                <Authz roles={['WW_SUPPORT', 'UBER_ADMIN']} override={roles.includes('CLIENT_ADMIN')}>
                    <Fieldset type={ <CheckBox label={`Admin (${org})`} labelId='admin' onToggle={toggleRole('CLIENT_ADMIN')} checked={roles.includes('CLIENT_ADMIN')} /> } />
                </Authz>
                <Authz roles={['WW_SUPPORT', 'UBER_ADMIN']}>
                    <Fieldset type={ <CheckBox label='Support' labelId='support' onToggle={toggleRole('WW_SUPPORT')} checked={roles.includes('WW_SUPPORT')} /> } />
                </Authz>
                <Authz roles={['UBER_ADMIN']}>
                    <Fieldset type={ <CheckBox label='Super Admin' labelId='uber_admin' onToggle={toggleRole('WW_SUPPORT')} checked={roles.includes('UBER_ADMIN')} /> } />
                </Authz>
            </section>
            {/* <section>
                <AdminTable type='search' />
                </section> */}
            <section className={ style.controls }>
              <button className={style.btn} onClick={cancel}>Cancel</button>
            { props.actions.map((action, i) => {
                return (
                <AdminButton
                    key={ i }
                    action={ action } />
                )
            })}
            </section>
        </fieldset>
    );
});

class AdminForm extends Component {
  constructor () {
    super();
    this.handleAdminAction = this.handleAdminAction.bind(this);
    this.state = {
      text: '',
      notification: false
    };
  }

    componentWillMount(){
        const { type, id, resetRole, clearUser, resetCompany } = this.props;
        getAdminData()
            .then(res => {
                const { setRoles, setUsers, setCompanies } = this.props;
                const [roles, users, companies] = res;
                setRoles(roles);
                setUsers(users);
                setCompanies(companies);
            })
            .catch(e => console.log('error getting admin data: ', e));

        if(id) {
            if(type === 'user' || type === 'users') {
                return getUser(id)
                        .then(user => this.props.loadUser(user));
            } else if(type === 'role' || type ==='roles') {
                return getRole(id)
                    .then(role => this.props.loadRole(role));
            } else if(type === 'company' || type === 'companies') {
                return getCompany(id)
                    .then(company => this.props.loadCompany(company));
            }
        } else {
            clearUser();
            resetCompany();
            resetRole();
        }
    }

  handleAdminAction (e) {
    e.preventDefault();
      const { id, type } = this.props;
      if(type === 'user' || type === 'users') {
          return this.submitUser(this.props.newUser, id);
      } else if(type === 'roles' || type === 'role') {
          return this.submitRole(this.props.newRole, id);
      } else if(type === 'companies' || type === 'company') {
          return this.submitCompany(this.props.newCompany, id);
      } else {
          return this.setState({ notification: true });
      }
  }

    submitUser(user, id) {
        const isValid = user.userName && user.organizationID;

        if(isValid) {
            if(id) {
                const formatedUser = {...user, organizationID: user.organizationID.toString()};
                return updateUser(id, formatedUser)
                    .then(user => this.props.open('User Updated Successfully'))
                    .then(_ => this.props.clearUser())
                    .then(_ => this.props.history.push("/admin/users"))
                    .catch(e => console.log('error updating user'));
            } else {
                const newUser = {...user, promise: null};
                createUser(newUser)
                    .then(user => {this.props.open("user created successfully!")
                        this.props.clearUser();
                    })
                .then(_ => this.props.clearUser())
                .then(_ => this.props.history.push("/admin/users"))
                .catch(e => console.log('error creating user: ', e));
            }
        } else {
          this.setState({notification: true, text: "Email and Organization are Required!"});
        }
    }

    submitRole(role, id) {
        if(id) {
            return updateRole(id, role)
                .then(role => this.props.open('Role Updated Successfully'))
                .then(_ => this.props.resetRole())
                .then(_ => this.props.history.push("/admin/roles"))
                .catch(e => console.log('eror updating role: ', e));
        } else {
            createRole(role)
                .then( role => {
                   this.props.resetRole(); 
                   this.props.open('Role Created Successfully!');
                })
                .then(_ => this.props.resetRole())
                .then(_ => this.props.history.push("/admin/roles"))
                .catch(e => console.log('error creating role!'));
        }
    }

    submitCompany(company, id) {
        if(id) {
            return updateCompany(id, company)
                .then(company => this.props.open('Company Updated Successfully'))
                .then(_ => this.props.resetCompany())
                .then(_ => this.props.history.push("/admin/companies"))
                .catch(e => console.log('error updating company: ', e));
        } else {
            createCompany(company)
                .then(org => this.props.open('Company Created Successfully'))
                .then(_ => this.props.resetCompany())
                .then(_ => this.props.history.push("/admin/companies"))
                .catch(e => console.log('error creating company'));
        }
    }

    onCancel(e) {
        e.preventDefault();
        const { clearUser, resetCompany, resetRole, history } = this.props;
        switch(this.props.type) {
            case "user" :
                clearUser();
                history.push("/admin/users");
                break;
            case "role" :
                resetRole();
                history.push("/admin/roles");
                break;
            case "company" :
                resetCompany();
                history.push("/admin/companies");
                break;
        }
    }

  render () {
    const { id, name } = this.props;
    const parsedName = id ? "Save Changes" : name;
    return (
      <div>
        <div styleName='container'>
          <h3>{ this.props.name }</h3>
          <form
            name={ this.props.type }
            onSubmit={ this.handleAdminAction }
            method='get'
            className='form-element'>
          { this.props.type === 'users' || this.props.type === 'user'?
            <UsersForm actions={[parsedName]} cancel={this.onCancel.bind(this)}/> :
            this.props.type === 'companies' || this.props.type === 'company' ?
            <CompaniesForm actions={[parsedName]} cancel={this.onCancel.bind(this)}/> :
            <RolesForm actions={[parsedName]} cancel={this.onCancel.bind(this)}/> }
          </form>
        </div>
      </div>
    )
  }
}

const dispatchers = dispatch => ({
    open: text => dispatch({type: 'OPEN', payload: text}),
    resetCompany: () => dispatch({type: 'RESET_COMPANY'}),
    loadCompany: company => dispatch({type: 'LOAD_COMPANY', payload: company}),
    resetRole: () => dispatch({type: 'RESET_ROLE'}),
    loadRole: role => dispatch({type: 'LOAD_ADMIN_ROLE', payload: role}),
    setRoles: roles => dispatch({type: 'LOAD_ROLES_SUCCESS', payload: roles}),
    setUsers: users => dispatch({type: 'LOAD_USERS_SUCCESS', payload: users}),
    setCompanies: companies => dispatch({type: 'LOAD_COMPANIES_SUCCESS', payload: companies}),
    loadUser: user => dispatch({type: 'LOAD_USER', payload: user}),
    clearUser: () => dispatch({type: 'RESET_USER'})
})
const formConnector = connect(state => ({newUser: state.userReducer, newRole: state.adminRoleReducer, newCompany: state.companyReducer}), dispatchers);

export default withRouter(formConnector(CSSModules(AdminForm, style)));
