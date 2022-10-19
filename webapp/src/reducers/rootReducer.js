import companiesReducer from "./companiesReducer";
import merchantsReducer from "./merchantsReducer";
import snackbarReducer from "./snackbarReducer";
import transactionsReducer from "./transactionsReducer";
import usersReducer from "./usersReducer";

export default function rootReducer(state, action) {
  return {
    companies: companiesReducer(state.companies, action),
    merchants: merchantsReducer(state.merchants, action),
    snackbar: snackbarReducer(state.snackbar, action),
    transactions: transactionsReducer(state.transactions, action),
    users: usersReducer(state.users, action),
  };
}
