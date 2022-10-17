import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import HomePage from "pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<HomePage />} exact path="/" />
      </Routes>
    </Router>
  );
}

export default App;
