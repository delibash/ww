import React from 'react';
import CSSModules from 'react-css-modules';
import Toggle from 'react-toggle';
import style from './ats.scss';

const ATS = ({ props, handleToggle }) => (
  <div styleName='ats'>
    <div styleName='controls'>
      <a href='#'>View in ATS</a>
      <label styleName='toggle'>
        <Toggle
          defaultChecked={ props.userToggle }
          icons={ false }
          onClick={ handleToggle }
          id='user-toggle' />
        <span styleName='user-name'>Wendy</span>
      </label>
    </div>
    <div styleName='block-board'>
      <div styleName='item'>
        <span styleName='large-label'>100</span>
        <span styleName='small-label'>Label</span>
      </div>
      <div styleName='item'>
        <span styleName='large-label'>100</span>
        <span styleName='small-label'>Label</span>
      </div>
      <div styleName='item'>
        <span styleName='large-label'>100</span>
        <span styleName='small-label'>Label</span>
      </div>
    </div>
  </div>
);

ATS.propTypes = {};

export default CSSModules(ATS, style);
