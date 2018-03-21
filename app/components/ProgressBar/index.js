import React from 'react';
import CSSModules from 'react-css-modules';
import style from './progress-bar.scss';

//TODO refactor to take a numberOfSteps param
const ProgressBar = ({ value }) => (
    <div styleName='progress-container'>
        <progress
            styleName='progress-bar'
            min='1'
            max='100'
            value={ value }>
        </progress>
        <i styleName='first' />
        <i styleName='second' />
        <i styleName='third' />
    </div>
);

/* const renderSteps = num => {
 *     return Array.apply(null, {length: num}).map((v, i) => {
 *       return <i styleName={i.toString()}/>;
 *     });
 * }
 * 
 * const ProgressBar = ({ step, numberOfSteps }) => (
 *   <div styleName='progress-container'>
 *     <progress
 *       styleName='progress-bar'
 *       min='1'
 *       max='100'
 *       value={step * (100 / value) }>
 *     </progress>
 *    {renderSteps(numberOfSteps)}
 *   </div>
 * );*/

ProgressBar.propTypes = {};

export default CSSModules(ProgressBar, style);
