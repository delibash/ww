import React from 'react';
import CSSModules from 'react-css-modules';
import ProgressBar from './../ProgressBar';
import style from './button.scss';

const Button = ({ children }) => (
  <button>
    { children }
  </button>
);

const ContactButton = ({ children, statusType, progress }) => (
  <div styleName='contact-button'>
    <div>
      <ProgressBar value={ progress } />
      { statusType }
    </div>
    {children ? <Button
      styleName="engaged"
      children={ children } />: ''}
  </div>
);

ContactButton.propTypes = {
  // statusType: React.PropTypes.string.isRequired,
  // onClick: React.PropTypes.func,
};

export default CSSModules(ContactButton, style);
