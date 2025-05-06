import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Logout from './components/Logout';
import AddEditMember from './components/AddEditMember';
import Cards from './components/Cards';
import AddEditCard from './components/AddEditCard';
import Nav from './components/Nav';
import { useEffect } from 'react';
import AddPayment from './components/AddPayment';
import Payments from './components/Payments';

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  const hideNav = location.pathname === "/login";
  
  useEffect(() => {
    const menu = document.getElementById("menu-mobile");
    if (menu) {
      menu.classList.add("hidden")
      menu.classList.remove("flex")
    }
  }, [location.pathname]);

  return (
    <div>
      {!hideNav && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/add-member" element={<AddEditMember />} />
        <Route path="/edit-member/:id" element={<AddEditMember />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/cards/add-card" element={<AddEditCard />} />
        <Route path="/cards/edit-card/:id" element={<AddEditCard />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/payments/:id" element={<Payments />} />
        <Route path="/payments/add-payment" element={<AddPayment />} />
      </Routes>
    </div>
  );
};

export default App;

