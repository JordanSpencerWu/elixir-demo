const initialState = {
  selected: {},
};

export function actions(dispatch) {
  return {
    setSelected: (transaction) => {
      dispatch({ type: "transactions/setSelected", payload: transaction });
    },
  };
}

export default function transactionsReducer(state = initialState, action) {
  switch (action.type) {
    case "transactions/setSelected": {
      return {
        ...state,
        selected: action.payload,
      };
    }
    default:
      return state;
  }
}
