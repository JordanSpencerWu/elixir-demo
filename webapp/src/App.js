import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "pages/HomePage";
import AppLayout from "layouts/AppLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
