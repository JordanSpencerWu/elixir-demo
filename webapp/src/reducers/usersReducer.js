const initialState = {
  selected: {},
};

export function actions(dispatch) {
  return {
    setSelected: (merchant) => {
      dispatch({ type: "users/setSelected", payload: merchant });
    },
  };
}

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case "users/setSelected": {
      return {
        ...state,
        selected: action.payload,
      };
    }
    default:
      return state;
  }
}
