import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import style from './search.scss';
import api from '../../utils/api.js';

const { search } = api;


const Input = CSSModules(({ id, value, handleChange, onKeyDown, loading }) => (
  <div className='form-element'>
    <label className={ style.label } htmlFor={ id }>
    <span>W</span>
    </label>
    <input
      value={value}
      className={ style.input }
      placeholder="Search for roles or applicants..."
      id={ id }
      onChange={ handleChange }
      onKeyDown={ onKeyDown }
      styleName={loading ? "loader" : ""}
      type='text' />
  </div>
), style);

const card = ({ searchType, searchArr, numItems, searchKey, highlightMatchesInString, itemKey, history, reset }) => {
  const createMarkup = (str) => {
    if (highlightMatchesInString) {
      return { __html: highlightMatchesInString(str, searchKey) };
    }
  }
  const onClick = (item) => {
    return (e) => {
      if(item.roleId && item.candidateId) {
        //candidate case
        reset();
        const url = `/role/${item.roleId}/${item.candidateId}`;
        history.push(url);
      } else {
        //role case
        reset();
        history.push(`/${item.id}`);
      }
    }
  }
  return (
    <div className={ style.card }>
      <span className={ style.type }>
        <span>{ searchType }</span>
        <span><strong>{ numItems }</strong> Total</span>
      </span>
      <ul className={ style.scroll }>
      {searchArr.map((item, i) => {
        const str = Array.isArray(itemKey) 
                  ? itemKey.reduce((memo, val) =>{
                    return memo ? `${memo} - ${item[val]}` : item[val];
                  } , "")
          : item[itemKey];

        if (highlightMatchesInString) {
          return (
            <li
              dangerouslySetInnerHTML={ createMarkup(str) }
              className={ style.item }
              tabIndex={ i }
              onClick={ onClick(item) }
              key={ i } />
          )
        } else {
          // Return ID search
          return (<li
            className={ style.item }
            onClick={ onClick(item) }
            tabIndex={ i }
            key={i}>{ str }</li>)
        }
      })}
      </ul>
    </div>
  )
};

const Card = withRouter(card);

class Search extends Component {
  constructor(props) {
    super(props);
    this._handleChange = this._handleChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this.filterByType = this.filterByType.bind(this);
    this.highlightMatchesInString = this.highlightMatchesInString.bind(this);
    this.state = {
      searchKey: '',
      timer: null,
      loading: false,
      interval: 500,
      roles: [],
      applicants: []
    };
  }

    /* inputClick(e){
     *   if(e.target.value === this.state.default)
     * }*/

  highlightMatchesInString (str, query) {
    // TODO: highlight matched string in results
    let fullString = fullString || str;
    for (var i = 0; i < query.length; i++) {
      let reg = '(' + query[i] + ')(?![^<]*>|[^<>]*</)';
      let regex = new RegExp(reg, 'i');
      if (!str.match(regex)) {
        return;
      }
      let matchStartPosition = str.match(regex).index;
      let matchEndPosition = matchStartPosition + str.match(regex)[0].toString().length;
      let originalTextFoundByRegex = str.substring(matchStartPosition, matchEndPosition);
      fullString = fullString.replace(regex, `<mark>${originalTextFoundByRegex}</mark>`);
    }
    return fullString;
  }

  filterByType (arr, query) {
    return function(type) {
      return arr.filter(item => {
        const val = Array.isArray(type) 
          ? type.reduce((memo, val) => memo[val], item)
          : item[type];

        if(val) {
          if (isNaN(val)) {
            return val.toLowerCase().includes(query.toLowerCase());
          } else {
            return val.toString().includes(query);
          }
        }
      });
    }
  }

    search(searchTerm) {
        return () => {
            if(searchTerm.trim().length > 0){
                this.setState({loading: true});
                search(searchTerm)
                    .then(res => {
                        const roles = res.roles;
                        const applicants = res.applicants;

                        this.setState({
                            loading: false,
                            roles,
                            applicants
                        });
                    });
            }
        }
    }

  _handleChange (e) {
      const searchTerm = e.target.value;
      const lastAction = this.state.searchTime;
      clearTimeout(this.state.timer);
      this.setState({searchKey: searchTerm,
                     roles: [],
                     applicants: [],
                     timer: setTimeout(this.search(searchTerm), this.state.interval)
      });
  }

  _onKeyDown (e) {
    if (e.keyCode === 40) {
      e.preventDefault();
    }
  }
  render() {
    let roles, applicants;
    if (this.state.searchKey) {
      if (this.state.roles.length > 0) {
        roles = <Card
          reset={() => this.setState({searchKey: ''})}
          searchKey={ this.state.searchKey }
          searchArr={ this.state.roles }
          searchType={ 'Roles' }
          numItems={ this.state.roles.length }
          itemKey='jobTitle'
          highlightMatchesInString={ this.highlightMatchesInString } />
      }
      if (this.state.applicants.length > 0) {
        applicants = <Card
        reset={() => this.setState({searchKey: ''})}
        searchKey={ this.state.searchKey }
        searchArr={ this.state.applicants }
        searchType={ 'Applicants' }
        numItems={ this.state.applicants.length }
        highlightMatchesInString={ this.highlightMatchesInString }
        itemKey={['candidateName', 'roleName']} />
      }
    }
    return (
      <div styleName='search-container'>
          <Input
            id='search'
            loading={this.state.loading}
            value={this.state.searchKey}
            handleChange={ this._handleChange }
            onKeyDown={ this._onKeyDown } />
          <div
            className={ this.state.searchKey ? style.results : style.off }
            ref='searchList'>
            { roles }
            { applicants }
          </div>
      </div>
    )
  }
}

Search.propTypes = {};

export default CSSModules(Search, style);
