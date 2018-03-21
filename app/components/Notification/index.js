import React from 'react';
import CSSModules from 'react-css-modules';
import style from './notification.scss'

const Notification = ({ ...props }) => (
  <div
    className={ `center-between ${ style.container }`}
    style={ props.position || {top: window.scrollY + 20}}>
    <span>{ props.noticeText }</span>
    <span className={ `close-x` } onClick={ props.onClose || console.log}></span>
  </div>
);


export default CSSModules(Notification, style);
