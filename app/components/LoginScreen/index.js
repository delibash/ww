import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import img from './logo-black.png';
import style from './login.scss';
import api from '../../utils/api';
import { connect } from 'react-redux';
import { login as loginAction } from '../../actions/index';
const { login }  = api;


const LoginInput = ({
  label,
  htmlFor,
  type,
  name,
  handleChange,
  handleKeyDown,
  onClick
  }) => {
  if (type === 'submit') {
    return (
      <button type={ type } onClick={(e) => onClick(e)} className={ style.btn }>{ label }</button>
    )
  } else {
    return (
      <label htmlFor={ htmlFor }>
        <span>{ label }</span>
        <input id={ htmlFor } onChange={ handleChange } onKeyDown={ handleKeyDown } name={ name } type={ type } required />
      </label>
    )
  }
}

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this._handleLogin = this._handleLogin.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this.state = {
      userName: "",
      password: "",
      isLoggedIn: this.props.isLoggedIn,
      wrongPassword: false
    }
  }

  _handleLogin (e) {
    e ? e.preventDefault() : '';

    const formData = {
      "userName": this.state.email,
      "password": this.state.password
    }

    login(formData)
      .then(data => this.props.dispatch(loginAction(data)))
      .catch(() => {
        this.setState({wrongPassword: true})
      });

  }

  _handleChange (e) {
    this.setState(Object.assign({}, this.state, {[e.target.name]: e.target.value }));
  }

  onKeyDown(e) {
   if(e.key === 'Enter') this._handleLogin();
  }

  render() {
    return(
      <div styleName='screen'>
        <div styleName='box'>
          <div styleName='form'>
          <div onSubmit={ this._handleLogin }>
            <fieldset className='form-group'>
                <img styleName="logo" src={img}/>
              <div className='form-element' styleName='bottom-spacing'>
                <LoginInput handleChange={ this._handleChange } handleKeyDown={this.onKeyDown.bind(this)} htmlFor='email' name='email' type='email' label='Email Address' />
              </div>
            </fieldset>
            <fieldset className='form-group'>
              <div className='form-element' styleName='bottom-spacing'>
                <LoginInput handleChange={ this._handleChange } handleKeyDown={this.onKeyDown.bind(this)} htmlFor='password' name='password' type='password' label='Password' />
              </div>
            </fieldset>
            <fieldset className='form-group'>
              <div className='form-element' styleName='center'>
                {this.state.wrongPassword
                  ? <div styleName="wrong-pass">Oops Wrong Password!</div>
                  : ''}
                <LoginInput type='submit' onClick={this._handleLogin.bind(this)} label='Sign In' />
              </div>
              <div styleName='right-link'>
                <a target="_blank" href="/#/terms-of-use">Terms of Use</a>
              </div>
            </fieldset>
          </div>
          </div>
        </div>
      </div>
    )
  }
}

LoginScreen.propTypes = {};
const connector = connect(state => {
  return {};
});

const LoginTest = CSSModules(LoginScreen, style);
export { LoginTest };

export default connector(CSSModules(LoginScreen, style));
