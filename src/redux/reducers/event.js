import { UPDATE_EVENT } from "../actionType";

const initialState = {
    id: null
}

const event = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_EVENT: {
    //   const { qid, isAnswerSubmitted, optionSubmitted  } = action.payload;
      return {
          id: action.payload
        }
    }
    default: {
      return state;
    }
  }
};

export default event;