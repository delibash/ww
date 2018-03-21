import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoginScreen from '../components/LoginScreen/index';
import ErrorComp from '../components/error/index';

const auth = ({loggedIn, authComponent, children, state}) => {
  return loggedIn
    ? children
    : authComponent
      ? <authComponent id='login-form'/>
      : <LoginScreen />;
}

const mapStateToProps = state => {
  const loggedIn = Boolean(state.reducer.isLoggedIn.id);
  return {loggedIn, state: state.reducer, loading: state.reducer.isLoggedIn.loading};
}

const Auth = connect(mapStateToProps)(auth);

const authzConnector = connect(state => ({user: state.reducer.isLoggedIn}));

const Authz = authzConnector(({user, alternative , roles, children, override}) => {
    const userRoles = user.roles || [];
    const hasRole = roles.reduce((memo, val) => memo || userRoles.includes(val), false);
    const bool = override ? true : hasRole;

    return !bool ? Boolean(alternative) ? <alternative/> : <div/> : children;
})

class Loading extends Component {
    constructor(){
        super();
        this.state = {
            delayFinished: false //boolean to represent if the delay before the loading component should be shown has elapsed
        }
    }

    componentWillMount() {
        const delay = this.props.delay || 1000;
        const stopDelay = () => {
            this.setState({delayFinished: true});
        }

        setTimeout(stopDelay, delay);
    }

    render(){
        const { loading, loadingComponent, children } = this.props;
        const { delayFinished } = this.state;

        if(delayFinished) {
            return !loading
                ? children
                : loadingComponent
                ? loadingComponent
                : ( <main id='main' role='main'>
                        <span className='init-loader'>Loading...</span>
                    </main> );
        } else {
            return children;
        }
    }
}

const Error = ({error, errorComponent, children}) => {
  return !error
    ? children
    : errorComponent
      ? <errorComponent/>
      : <ErrorComp/>;
}

export {
  Auth,
  Authz,
  Loading,
  Error
}
