const initialState = {
  selected: {},
  page: 0,
  rowsPerPage: 10,
  filterByCompanyId: null,
  filterByMerchantId: null,
  filterByUserId: null,
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
    setFilterByCompanyId: (id) => {
      dispatch({
        type: "users/setFilterByCompanyId",
        payload: id,
      });
    },
    setFilterByMerchantId: (id) => {
      dispatch({
        type: "users/setFilterByMerchantId",
        payload: id,
      });
    },
    setFilterByUserId: (id) => {
      dispatch({
        type: "users/setFilterByUserId",
        payload: id,
      });
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
    case "users/setFilterByCompanyId": {
      return {
        ...state,
        filterByCompanyId: action.payload,
      };
    }
    case "users/setFilterByMerchantId": {
      return {
        ...state,
        filterByMerchantId: action.payload,
      };
    }
    case "users/setFilterByUserId": {
      return {
        ...state,
        filterByUserId: action.payload,
      };
    }
    default:
      return state;
  }
}
