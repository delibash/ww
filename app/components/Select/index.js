import React from 'react';
import CSSModules from 'react-css-modules';
import style from './select.scss';

const Select = ({ propType, handleChange, options }) => {
  const onChange = (e) => handleChange(propType, e.target.value);
  return (
    <div styleName='select'>
      <select onChange={ onChange }>
      { options.map((opt, i) => ( <option key={ i } value={ opt.value }>{ opt.label }</option> ))}
      </select>
      <i className="fa fa-caret-down" styleName="caret"></i>
    </div>
  )
};

export default CSSModules(Select, style);
