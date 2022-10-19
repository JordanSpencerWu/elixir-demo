const initialState = {
  selected: {},
  page: 0,
  rowsPerPage: 10,
};

export function actions(dispatch) {
  return {
    setSelected: (merchant) => {
      dispatch({ type: "merchants/setSelected", payload: merchant });
    },
    setPage: (page) => {
      dispatch({ type: "merchants/setPage", payload: page });
    },
    setRowsPerPage: (rowsPerPage) => {
      dispatch({ type: "merchants/setRowsPerPage", payload: rowsPerPage });
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
    case "merchants/setPage": {
      return {
        ...state,
        page: action.payload,
      };
    }
    case "merchants/setRowsPerPage": {
      return {
        ...state,
        rowsPerPage: action.payload,
      };
    }
    default:
      return state;
  }
}
