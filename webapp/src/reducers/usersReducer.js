const initialState = {
  selected: {},
  page: 0,
  rowsPerPage: 10,
  searchByFirstName: "",
  searchByLastName: "",
  filterByCompanyId: null,
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
    setSearchByFirstName: (searchByFirstName) => {
      dispatch({
        type: "users/setSearchByFirstName",
        payload: searchByFirstName,
      });
    },
    setSearchByLastName: (searchByLastName) => {
      dispatch({
        type: "users/setSearchByLastName",
        payload: searchByLastName,
      });
    },
    setFilterByCompanyId: (id) => {
      dispatch({
        type: "users/setFilterByCompanyId",
        payload: id,
      });
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
    case "users/setSearchByFirstName": {
      return {
        ...state,
        searchByFirstName: action.payload,
      };
    }
    case "users/setSearchByLastName": {
      return {
        ...state,
        searchByLastName: action.payload,
      };
    }
    case "users/setFilterByCompanyId": {
      return {
        ...state,
        filterByCompanyId: action.payload,
      };
    }
    default:
      return state;
  }
}
