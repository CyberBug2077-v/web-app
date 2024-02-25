import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage'; 
import Login from './modals/Login';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token is in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace={true} /> : <Login />} />
          <Route path="/" element={isAuthenticated ? <MainPage /> : <Navigate to="/login" replace={true} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
