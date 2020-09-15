import { UPDATE_AUTH } from "../actionType";

// const initialState = VISIBILITY_FILTERS.ALL;
const initialState = {
    email:'',
    uid:''
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_AUTH: {
    //   const { qid, isAnswerSubmitted, optionSubmitted  } = action.payload;
      return action.payload
    }
    default: {
      return state;
    }
  }
};

export default user;