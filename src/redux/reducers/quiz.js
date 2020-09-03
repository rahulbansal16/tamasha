import { SUBMIT_ANSWER, UPDATE_QUESTION, FLASH_ANSWER} from "../actionType";

// const initialState = VISIBILITY_FILTERS.ALL;
const initialState = {
  timerDisabled: false,
  isAnswerSubmitted: false,
  optionSubmitted: null,
  qid: "test",
  qText: "Hi How are you ?",
  options: ['first','second', 'third', 'fourth'],
  resetTimer: true,
  isTimeout: false,
  answer: null
}

const resetQuestionState = () => ({
  timerDisabled: false,
  isAnswerSubmitted: false,
  optionSubmitted: null,
  qid: "test",
  qText: "Hi How are you ?",
  options: ['first','second', 'third', 'fourth'],
  resetTimer: true,
  isTimeout: false,
  answer: null
})

const quiz = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_ANSWER: {
      const { qid, isAnswerSubmitted, optionSubmitted  } = action.payload;
      return {
        ...state,
        timerDisabled: true,
        isAnswerSubmitted: isAnswerSubmitted,
        optionSubmitted: optionSubmitted,
        qid: qid,
        resetTimer: false
      }
    }
    case UPDATE_QUESTION: {
      const { qid, options, qText } = action.payload;      
      return {
        ...state,
        ...resetQuestionState(),
        qid: qid,
        qText: qText,
        options: options,
      }
    }
    case FLASH_ANSWER: {
      const {qid, option} = action.payload;
      return {
        ...state,
        qid: qid,
        answer: option,
      }
    }
    // case TIM
    default: {
      return state;
    }
  }
};

export default quiz;