import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppLayout from "layouts/AppLayout";
import DashBoardPage from "pages/DashBoardPage";
import PageNotFound from "pages/PageNotFound";
import TransactionsPage from "pages/TransactionsPage";
import MerchantsPage from "pages/MerchantsPage";
import CompaniesPage from "pages/CompaniesPage";
import UsersPage from "pages/UsersPage";
import pathTo from "utils/pathTo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={pathTo.dashboard} element={<AppLayout />}>
          <Route index element={<DashBoardPage />} />
          <Route path={pathTo.companies} element={<CompaniesPage />} />
          <Route path={pathTo.merchants} element={<MerchantsPage />} />
          <Route path={pathTo.transactions} element={<TransactionsPage />} />
          <Route path={pathTo.users} element={<UsersPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
