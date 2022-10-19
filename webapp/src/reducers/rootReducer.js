import companiesReducer from "./companiesReducer";
import merchantsReducer from "./merchantsReducer";
import transactionsReducer from "./transactionsReducer";
import usersReducer from "./usersReducer";

export default function rootReducer(state, action) {
  return {
    companies: companiesReducer(state.companies, action),
    merchants: merchantsReducer(state.merchants, action),
    transactions: transactionsReducer(state.transactions, action),
    users: usersReducer(state.users, action),
  };
}
