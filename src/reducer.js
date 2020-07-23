import { act } from "react-dom/test-utils";

export const ACTIONS = {
    SUBMIT_ANSWER: 'submit_answer',
    RESET_ANSWER: 'reset_answer',
    UPDATE_AUTH: 'update_auth',
};

const Reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SUBMIT_ANSWER:
            console.log("In the Submit Answer state", action.payload);
            return {
                ...state,
                ...action.payload
            };
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