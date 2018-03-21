import React, { Component } from 'react';
import CSSModules from 'react-css-modules';

import styles from './styles.scss';
import spinner from './janky-spinner.gif';
import betterSpinner from './ajax-loader.gif';

class Spinner extends Component {

    render() {
       const {text} = this.props;
        return (
            <div styleName="spinner">
                <div><img src={betterSpinner}/></div>
                <div>{text}</div>
            </div>
        )
    }
}

export default CSSModules(Spinner, styles);
