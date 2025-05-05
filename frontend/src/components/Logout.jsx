import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token'); // 🔑 Elimina el token
    navigate('/login'); // 🔁 Redirige al login
  }, [navigate]);

  return null;
};

export default Logout;