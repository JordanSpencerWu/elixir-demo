const initialState = {
  selected: {},
  page: 0,
  rowsPerPage: 10,
};

export function actions(dispatch) {
  return {
    setSelected: (merchant) => {
      dispatch({ type: "users/setSelected", payload: merchant });
    },
    setPage: (page) => {
      dispatch({ type: "users/setPage", payload: page });
    },
    setRowsPerPage: (rowsPerPage) => {
      dispatch({ type: "users/setRowsPerPage", payload: rowsPerPage });
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
    case "users/setPage": {
      return {
        ...state,
        page: action.payload,
      };
    }
    case "users/setRowsPerPage": {
      return {
        ...state,
        rowsPerPage: action.payload,
      };
    }
    default:
      return state;
  }
}
