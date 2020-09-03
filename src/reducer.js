import { act } from "react-dom/test-utils";

export const ACTIONS = {
    SUBMIT_ANSWER: 'submit_answer',
    RESET_ANSWER: 'reset_answer',
    UPDATE_AUTH: 'update_auth',
    UPDATE_QUESTION: 'update_question',
    RESET_TIMER: 'reset_timer',
    UNSET_TIMER: 'unset_timer'
};

const Reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SUBMIT_ANSWER:
            console.log("In the Submit Answer state", action.payload);
            return {
                ...state,
                ...action.payload
            };
        case ACTIONS.UPDATE_QUESTION:
            console.log("Updating the question", action.payload);
            return {
                ...state,
                ...action.payload
            }
        case ACTIONS.RESET_ANSWER:
            return {
                ...state,
                posts: state.posts.concat(action.payload)
            };
        case ACTIONS.UPDATE_AUTH:
            return {
                ...state,
                user: action.payload.user
            };
        case ACTIONS.RESET_TIMER:
            return {
                ...state,
                resetTimer: true
            }
        case ACTIONS.UNSET_TIMER:
            return {
                ...state, 
                resetTimer: false
            }
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export default Reducer;