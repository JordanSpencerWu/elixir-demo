import { createContext, useReducer } from "react";
import rootReducer from "reducers/rootReducer";

import { actions as companiesActions } from "reducers/companiesReducer";
import { actions as merchantsActions } from "reducers/merchantsReducer";
import { actions as transactionsActions } from "reducers/transactionsReducer";
import { actions as usersActions } from "reducers/usersReducer";

const appState = {
  companies: {
    selected: {},
  },
  merchants: {
    selected: {},
  },
  transactions: {
    selected: {},
  },
  users: {
    selected: {},
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
