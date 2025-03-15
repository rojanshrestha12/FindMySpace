import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login"; // Assuming Login is in the pages folder
import Register from "./pages/register"; // Assuming Register is in the pages folder
import Something from "./pages/A";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Something />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </Router>
    </>
  );
}

export default App;