import {SUBMIT_ANSWER, UPDATE_QUESTION, RESET_TIMER, FLASH_ANSWER, UPDATE_AUTH, UPDATE_EVENT} from './actionType';

export const submitAnswer = ({qid, optionSubmitted}) => ({
    type: SUBMIT_ANSWER,
    payload: { 
        qid: qid,
        optionSubmitted: optionSubmitted,
        isSubmitted: true
     }
});

export const resetTimer = () => {
    console.log("Resetting timer");
    return {
        type: RESET_TIMER
    }
};


export const flashAnswer = ({questionId, option}) => ({
    type: FLASH_ANSWER,
    payload: {
        qid: questionId,
        answer: option
    }
})

export const updateQuestion = ( {questionId, options, question}) => ({
    type: UPDATE_QUESTION,
    payload: { 
        qid: questionId,
        options: options,
        qText: question
     }
});

export const updateUserState = (user) => ({
    type: UPDATE_AUTH,
    payload: user
})

export const updateEvent = (eventId) => ({
    type: UPDATE_EVENT,
    payload: eventId
})