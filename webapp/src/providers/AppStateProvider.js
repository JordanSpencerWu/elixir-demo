import { createContext, useReducer } from "react";
import rootReducer from "reducers/rootReducer";

import { actions as companiesActions } from "reducers/companiesReducer";
import { actions as merchantsActions } from "reducers/merchantsReducer";
import { actions as transactionsActions } from "reducers/transactionsReducer";
import { actions as usersActions } from "reducers/usersReducer";

const appState = {
  companies: {
    selected: {},
    page: 0,
    rowsPerPage: 10,
  },
  merchants: {
    selected: {},
    page: 0,
    rowsPerPage: 10,
  },
  transactions: {
    selected: {},
    page: 0,
    rowsPerPage: 10,
  },
  users: {
    selected: {},
    page: 0,
    rowsPerPage: 10,
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
