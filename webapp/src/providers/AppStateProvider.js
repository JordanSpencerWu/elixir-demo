import { createContext, useReducer } from "react";
import rootReducer from "reducers/rootReducer";

import { actions as companiesActions } from "reducers/companiesReducer";
import { actions as merchantsActions } from "reducers/merchantsReducer";
import { actions as snackbarActions } from "reducers/snackbarReducer";
import { actions as transactionsActions } from "reducers/transactionsReducer";
import { actions as usersActions } from "reducers/usersReducer";

const appState = {
  companies: {
    selected: {},
    page: 0,
    rowsPerPage: 10,
    searchByName: "",
  },
  merchants: {
    selected: {},
    page: 0,
    rowsPerPage: 10,
    searchByName: "",
  },
  transactions: {
    selected: {},
    page: 0,
    rowsPerPage: 10,
    filterByCompanyId: null,
    filterByMerchantId: null,
    filterByUserId: null,
  },
  users: {
    selected: {},
    page: 0,
    rowsPerPage: 10,
    searchByFirstName: "",
    searchByLastName: "",
    filterByCompanyId: null,
  },
  snackbar: {
    open: false,
    message: "",
  },
};

export const AppStateContext = createContext();

export default function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(rootReducer, appState);

  const value = {
    state,
    companiesActions: {
      ...companiesActions(dispatch),
    },
    merchantsActions: {
      ...merchantsActions(dispatch),
    },
    snackbarActions: {
      ...snackbarActions(dispatch),
    },
    transactionsActions: {
      ...transactionsActions(dispatch),
    },
    usersActions: {
      ...usersActions(dispatch),
    },
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
