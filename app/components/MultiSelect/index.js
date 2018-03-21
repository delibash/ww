import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import style from './multiSelect.scss';

class MultiSelect extends Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
        expanded: false,
        appliedFilter: {
            active: false,
            predicate: this.appliedFilter
        },
        invitedFilter: {
            active: false,
            predicate: this.invitedFilter
        },
        completedFilter: {
            active: true,
            predicate: this.chattedFilter
        },
        qualifiedFilter: {
            active: false,
            predicate: this.qualifiedFilter
        },
        disqualifiedFilter: {
            active: false,
            predicate: c => !this.qualifiedFilter(c)
        }
    };
  }

    appliedFilter = (candidate) => {
        const applied = candidate.time;
        const invited = candidate.person['date-invited'];
        const chatted = candidate.person['date-chatted'];

        return applied && !invited && !chatted;
    }

    invitedFilter = (candidate) => {
        const invited = candidate.person['date-invited'];
        const chatted = candidate.person['date-chatted'];

        return invited && !chatted;
    }

    chattedFilter = (candidate) => {
        const chatted = candidate.person['date-chatted'];

        return !!chatted;
    }

    qualifiedFilter = (candidate) => {
        return !candidate["disqualified?"];
    }

  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef (node) { this.wrapperRef = node; }

  handleClickOutside (e) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        expanded: false
      });
    }
  }

  handleToggle () {
    this.setState({
      expanded: !this.state.expanded
    });
  }

    toggleFilter = (e) => {
        const name = e.target.id;
        const checkedBool = e.target.checked;
        const filter = this.state[name];
        let newState = {};
        newState[name] = {...filter, active: !filter.active};

        return new Promise((resolve, reject) => {
            this.setState(newState, () => {
                resolve();
            })
        })
    }

    applyFilters = (candidates) => {
        const stateCopy = {...this.state};
        delete stateCopy.expanded;

        const predicates = Object.keys(stateCopy)
                                 .map(key => stateCopy[key])
                                 .filter(filter => filter.active)
                                 .map(filter => filter.predicate);

        //applies predicates to a candidate
        const applyPredicates = (predicates, candidate) => {
            if(predicates.length === 0) {
                return true;
            }
            return predicates.reduce((bool, pred) => {
                const predBool = pred(candidate);
                return predBool || bool
            }, false);
        }

        return candidates.filter(applyPredicates.bind(this, predicates));
    }

    onCheck = (e) => {
        this.toggleFilter(e)
            .then(() => {
                const { candidates, subscription } = this.props
                const filtered = this.applyFilters(candidates);
                subscription(filtered);
            });
    }


    candidatesCompare = (listA, listB) => {
        if(listA.length !== listB.length) {
            return false;
        }

        let bool = true;
        for(let i = 0; i <= listA.length; i++) {
            const idA = listA[i] ? listA[i].id : null;
            const idB = listB[i] ? listB[i].id : null;

            if(idA !== idB) bool = false;
        }

        return bool;
    }

    componentWillReceiveProps({candidates, subscription}) {
        const oldCands = this.props.candidates;
        const areEqual = this.candidatesCompare(oldCands, candidates);

        if(!areEqual) {
            const filtered = this.applyFilters(candidates);
            subscription(filtered);
        }
    }


  render () {
    const { candidates } = this.props;

    const filterOptions = [
      { label: 'Applied', key: 'appliedFilter' },
      { label: 'Invited', key: 'invitedFilter' },
      { label: 'Completed', key: 'completedFilter' },
    ];

      const filterString = filterOptions.reduce((memo, val, i) => {
          if(this.state[val.key].active) {
              memo += `${val.label},`;
          }

          if(i === filterOptions.length - 1) {
              memo = memo.replace(/.$/,")");
          }
          return memo;
      }, '(');

     const labelString = filterString.length <= 2 ? ' Filters ' : ` Filters ${filterString} `;

    return (
      <div styleName='container' ref={ this.setWrapperRef }>
        <div
          onClick={ this.handleToggle }
          styleName='label'
        >
           <i className="fa fa-filter"></i>
          {labelString}
           <i className="fa fa-caret-down"></i>
        </div>
        <div styleName='list' className={ this.state.expanded ? 'active-block' : '' }>
          <span>Wendy Status</span>
          <ul styleName='filters'>
            { filterOptions.map((opt, i) => (
              <li key={i}>
                <label htmlFor={ opt.key }>
                  <input
                    onChange={ this.onCheck }
                    id={ opt.key }
                    checked={ this.state[opt.key].active }
                    type='checkbox' />
                  { opt.label }
                </label>
              </li>
            )) }
          </ul>
        </div>
      </div>
    )
  }
};

export default CSSModules(MultiSelect, style);
