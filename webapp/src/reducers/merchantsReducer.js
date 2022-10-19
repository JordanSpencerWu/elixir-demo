const initialState = {
  selected: {},
};

export function actions(dispatch) {
  return {
    setSelected: (merchant) => {
      dispatch({ type: "merchants/setSelected", payload: merchant });
    },
  };
}

export default function merchantsReducer(state = initialState, action) {
  switch (action.type) {
    case "merchants/setSelected": {
      return {
        ...state,
        selected: action.payload,
      };
    }
    default:
      return state;
  }
}
