import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppLayout from "layouts/AppLayout";
import DashBoardPage from "pages/DashBoardPage";
import PageNotFound from "pages/PageNotFound";
import TransactionPage from "pages/TransactionPage";
import MerchantPage from "pages/MerchantPage";
import CompanyPage from "pages/CompanyPage";
import UserPage from "pages/UserPage";
import pathTo from "utils/pathTo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={pathTo.dashboard} element={<AppLayout />}>
          <Route index element={<DashBoardPage />} />
          <Route path={pathTo.companies} element={<CompanyPage />} />
          <Route path={pathTo.merchants} element={<MerchantPage />} />
          <Route path={pathTo.transactions} element={<TransactionPage />} />
          <Route path={pathTo.users} element={<UserPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
