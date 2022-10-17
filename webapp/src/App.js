import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Global, css } from "@emotion/react";

import AppLayout from "layouts/AppLayout";

import DashBoardPage from "pages/DashBoardPage";
import PageNotFound from "pages/PageNotFound";
import TransactionsPage, {
  Transactions,
  Transaction,
} from "pages/TransactionsPage";
import MerchantsPage, { Merchants, Merchant } from "pages/MerchantsPage";
import CompaniesPage, { Companies, Company } from "pages/CompaniesPage";
import UsersPage, { Users, User } from "pages/UsersPage";
import pathTo from "utils/pathTo";

function App() {
  return (
    <>
      <Global
        styles={css`
          a:link,
          a:visited {
            color: blue;
          }
        `}
      />
      <Router>
        <Routes>
          <Route path={pathTo.dashboard} element={<AppLayout />}>
            <Route index element={<DashBoardPage />} />
            <Route path={pathTo.companies} element={<CompaniesPage />}>
              <Route index element={<Companies />} />
              <Route path=":id" element={<Company />} />
            </Route>
            <Route path={pathTo.merchants} element={<MerchantsPage />}>
              <Route index element={<Merchants />} />
              <Route path=":id" element={<Merchant />} />
            </Route>
            <Route path={pathTo.transactions} element={<TransactionsPage />}>
              <Route index element={<Transactions />} />
              <Route path=":id" element={<Transaction />} />
            </Route>
            <Route path={pathTo.users} element={<UsersPage />}>
              <Route index element={<Users />} />
              <Route path=":id" element={<User />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
