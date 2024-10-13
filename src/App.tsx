import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RequestPage from "./pages/RequestPage";
import StatusPage from "./pages/StatusPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StatusPage />} />
        <Route path="/details/:id" element={<RequestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
