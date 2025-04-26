import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import Dashboard from "./components/Dashboard/Dashboard";
import { Toaster } from "sonner";

function App() {
  const { user } = useContext(UserContext);

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
