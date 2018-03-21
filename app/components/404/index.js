import React from 'react';
import CSSModules from 'react-css-modules';
import style from './styles.scss'

const pageNotFound = () => (
  <div styleName='screen'>
      {console.log('404 called!')}
    <div styleName='box'>
      <div styleName='form'>
        {"Sorry it appears this page doesn't exist!"}
      </div>
    </div>
  </div>
);


export default CSSModules(pageNotFound, style);
