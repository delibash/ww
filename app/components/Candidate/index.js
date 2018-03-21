import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import style from './styles.scss';
import Select from '../Select/index';
import { Loading } from '../../utils/higher-order-components.js';
import Spinner from '../Spinner/index.js';


const renderTranscript = (transcript, options, handleChange, name = '') => {
    const script = transcript.map((sentence, i) => {
        const response = sentence.content;
        const parsedName = sentence.role.ident.sym.name === "bot" ? "Wendy" : name;
        return (
            <div key={i} styleName="sentence">
                <span>{parsedName}:</span>
                <span>{response}</span>
            </div>
        );
    })

    return (
        <div>
            <div styleName="date">
                { options.length > 1 ? <Select
                    propType={"test"}
                    handleChange={handleChange}
                    options={options}
                /> : options[0] ? options[0].label : ''}
            </div>
            {script}
        </div>
    )
}

const parseHighlights = (text = 'no text available') => {
  return text.split("<BR>")
    .map((sentence, i) => <span key={i} styleName="new-line">{sentence}</span>);
}

const renderHighlights = (answers) => {
  const ans = answers || [];

  const multipleChoice = answerObj => {
    const unParsedText = answerObj.question.summaryText || answerObj.question.text;
    const questionText = parseHighlights(unParsedText); const answerText = answerObj.choice.text;
    const title = answerObj.question
      ? answerObj.question["summary-header"] : "";
    return (
      <div styleName="multipleChoice">
        <h3>{title}</h3>
        <div>{questionText}</div>
        <div>
          {answerObj.question.choice.map((option, i) => {
            const checked = answerText === option.text;
            return (
              <div key={i}>
                {checked
                  ? <span style={{'font-size': '20px'}}>☑</span>
                 : <span style={{'font-size': '20px'}}>☐</span>}
                <label>{option.text}</label>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const textAnswer = answerObj => {
    const unParsedText = answerObj.question ? answerObj.question.summaryText || answerObj.question.text : '';
    const question = parseHighlights(unParsedText);
    const title = answerObj.question
      ? answerObj.question["summary-header"] : "";
    return (
      <div styleName="highlight">
        <h3>{title}</h3>
        <div>{question}</div>
        <p>{answerObj.text}</p>
      </div>
    )
  }

  return ans.map((answer, i) => {
    return answer.choice
      ? <div key={i}>{multipleChoice(answer)}</div>
      : <div key={i}>{textAnswer(answer)}</div>;
  });
}

const LoadingCandidate = () => (
  <div>
    ... loading candidate info
  </div>
)

class Candidate extends Component {
  constructor(){
    super();
    this.state = {
      highlights: true,
      transcript: false,
      activeIndex: 0
    }
  }

  toggleTab(prop) {
    return () => {
      if (!this.state[prop]) {
        this.setState({
          highlights: !this.state.highlights,
          transcript: !this.state.transcript
        });
      }
    }
  }

  isActive(prop) {
    return this.state[prop]
      ? 'active'
      : '';
  }

  render() {
    const { candidateName, loaded} = this.props;
    const { activeIndex } = this.state;
    const transcript = this.props.transcript  === 'loading' || !this.props.transcript ? [] : this.props.transcript[activeIndex];
    const answer = this.props.answers  === 'loading' || !this.props.answers ? [] : this.props.answers[activeIndex];

    const buildOptions = () => {
        const scripts = this.props.transcript === 'loading' || !this.props.transcript ? [] : this.props.transcript;
        return scripts.map((tran, i) => {
            return {
                value: i,
                label: tran[0].timestamp
            }
        });
    }

      return (
        <Loading
            loading={!loaded}
            loadingComponent={<Spinner text="Loading Wendy Chat..."/>}
        >
            <div styleName='applicants'>
            {/* <div styleName='applicants-filter'>
                <div styleName='download'>Download</div>
                </div> */}

                <div styleName="content">
                    <div styleName="tabs">
                    <span
                        onClick={this.toggleTab('highlights')}
                        styleName={this.isActive('highlights')}
                    >Highlights</span>
                    <span
                        onClick={this.toggleTab('transcript')}
                        styleName={this.isActive('transcript')}
                    >Transcripts</span>
                    </div>

                    {!this.props.transcript
                        ? "No Chats Yet!"
                        : <div>
                            {this.state.transcript
                            ? renderTranscript(transcript, buildOptions(), (_, value) => this.setState({activeIndex: value}), candidateName)
                            : renderHighlights(answer)}
                        </div>}
                </div>
            </div>
      </Loading>
      )
    
  }

}



export default CSSModules(Candidate, style);
