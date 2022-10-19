const initialState = {
  selected: {},
  page: 0,
  rowsPerPage: 10,
};

export function actions(dispatch) {
  return {
    setSelected: (transaction) => {
      dispatch({ type: "transactions/setSelected", payload: transaction });
    },
    setPage: (page) => {
      dispatch({ type: "transactions/setPage", payload: page });
    },
    setRowsPerPage: (rowsPerPage) => {
      dispatch({ type: "transactions/setRowsPerPage", payload: rowsPerPage });
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
    case "transactions/setPage": {
      return {
        ...state,
        page: action.payload,
      };
    }
    case "transactions/setRowsPerPage": {
      return {
        ...state,
        rowsPerPage: action.payload,
      };
    }
    default:
      return state;
  }
}
