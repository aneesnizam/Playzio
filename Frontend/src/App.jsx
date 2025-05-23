import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./Components/Login";
import Loading from "./Components/Loading";
import Home from "./Components/Home";
export default function App() {
    const [loading, setLoading] = useState(true);

  return (
  <>
      {loading ? (
        <Loading onFinish={() => setLoading(false)} />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      )}
    </>
  );
}
    