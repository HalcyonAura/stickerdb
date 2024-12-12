import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    setIsAuthenticated(!!token);
  });

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard isAuth={isAuthenticated} setAuth={setIsAuthenticated} handleLogout={handleLogout}/>} />
      </Routes>
    </Router>
  );
}

export default App