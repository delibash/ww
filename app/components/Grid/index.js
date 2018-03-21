import React from 'react';
import CSSModules from 'react-css-modules';
import style from './grid.scss';

const Grid = ({ children }) => (
  <section className="grid">
    <div className="grid__item">1</div>
    <div className="grid__item">2</div>
    <div className="grid__item">3</div>
    <div className="grid__item">4</div>
    <div className="grid__item">5</div>
    <div className="grid__item">6</div>
  </section>
)

export default CSSModules(Grid, style);
