const initialState = {
  selected: {},
  page: 0,
  rowsPerPage: 10,
  searchByName: "",
};

export function actions(dispatch) {
  return {
    setSelected: (company) => {
      dispatch({ type: "companies/setSelected", payload: company });
    },
    setPage: (page) => {
      dispatch({ type: "companies/setPage", payload: page });
    },
    setRowsPerPage: (rowsPerPage) => {
      dispatch({ type: "companies/setRowsPerPage", payload: rowsPerPage });
    },
    setSearchByName: (searchByName) => {
      dispatch({ type: "companies/setSearchByName", payload: searchByName });
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
    case "companies/setPage": {
      return {
        ...state,
        page: action.payload,
      };
    }
    case "companies/setRowsPerPage": {
      return {
        ...state,
        rowsPerPage: action.payload,
      };
    }
    case "companies/setSearchByName": {
      return {
        ...state,
        searchByName: action.payload,
      };
    }
    default:
      return state;
  }
}
