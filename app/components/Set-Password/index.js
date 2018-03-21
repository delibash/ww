import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import img from './logo-black.png';
import style from './styles.scss';
import { connect } from 'react-redux';
import api from '../../utils/api.js';

const { loginDigest, updateCurrentUser, getUser, logout } = api;

class PassWord extends Component {
    constructor(){
        super();
        this.state = {
            first: '',
            second: '',
            text: ''
        }
    }

    componentWillMount(){
        const { match, loadUser, login, } = this.props;
        loginDigest(this.props.match.params.digest)
            .then(user => {
                loadUser(user);
                login(user);
            });
    }

    validate() {
        const { first, second } = this.state;
        const bool = !!(!!first && !!second && (first === second) && (first === this.props.password));
        return bool;
    }

    submit(){
        if(this.validate.bind(this)()) {
            const newPass = {id: this.props.user.id.toString(), password: this.props.user.password}
            updateCurrentUser(newPass)
                .then(user => {
                    console.log('success updating user!!!')
                    this.props.history.push('/');
            getUser().then(v => console.log('session: ', v));
                })
                .catch(e => console.log('error updaing user!!'));
        } else {
            this.setState({text: "Passwords Don't Match"});
        }
    }

    onChangeFirst(e) {
        const text = e.target.value;
        this.setState({first: text});
        this.props.setPassword(text);
    }

    onChangeSecond(e) {
        const text = e.target.value;
        this.setState({second: text});
    }

    render(){
        const { firstName, lastName, userName } = this.props;
        const { first, second } = this.state;
        const name = firstName && lastName ? firstName + " " + lastName : userName;
        return(
              <div styleName='screen'>
                <div styleName='box'>
                    <div styleName='form'>
                        <img styleName="logo" src={img}/>
                        <h1>Welcome {name}</h1>
                        <h1>Set Your Password</h1>
                        <label>
                            <span> New Password </span>
                            <input type="password" value={first} onChange={this.onChangeFirst.bind(this)}/>
                        </label>

                        <label>
                            <span> Again </span>
                            <input type="password" value={second} onChange={this.onChangeSecond.bind(this)}/>
                        </label>
                        {this.state.text ? <div styleName="wrong-pass"> Passwords Don't Match </div> : '' }
                        <button  styleName="btn" onClick={this.submit.bind(this)}>Save Password</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({...state.userReducer, user: state.userReducer});
const mapDispatchToProps = dispatch => ({
    loadUser: user => dispatch({type: 'LOAD_USER', payload: user}),
    setPassword: pass => dispatch({type: 'SET_PASSWORD', payload: pass}),
    login: user => dispatch({type: 'LOGIN', payload: user})
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CSSModules(PassWord, style)));
