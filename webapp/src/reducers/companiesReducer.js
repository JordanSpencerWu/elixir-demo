const initialState = {
  selected: {},
};

export function actions(dispatch) {
  return {
    setSelected: (company) => {
      dispatch({ type: "companies/setSelected", payload: company });
    },
  };
}

export default function companiesReducer(state = initialState, action) {
  switch (action.type) {
    case "companies/setSelected": {
      return {
        ...state,
        selected: action.payload,
      };
    }
    default:
      return state;
  }
}
