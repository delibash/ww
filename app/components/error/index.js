import React from 'react';
import CSSModules from 'react-css-modules';
import style from './styles.scss'

const Error = () => (
  <div styleName='screen'>
    <div styleName='box'>
      <div styleName='form'>
          <span>Whoops, it appears that we've encountered a server error. Please try again.</span>
          <span>If the issue persists, please email us:
              <a target="_blank" href={'mailto:support@wadeandwendy.ai'}>support@wadeandwendy.ai</a></span>
      </div>
    </div>
  </div>
);


export default CSSModules(Error, style);
