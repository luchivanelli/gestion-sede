import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { consults } from '../helpers/consults';
import logo from "../assets/favicon-peña.png"

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logged, setLogged] = useState(false);
  const [messageLogin, setMessageLogin] = useState("")

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { username, password };

    let result = await consults("/login", "POST", data) //consulta para login
    console.log("resultado de la consulta post de login:", result)
    
    if (result.token) {
      localStorage.setItem("token", result.token);
      setLogged(true);
    }

    if (result.message) {
      setMessageLogin(result.message)
    }
  };

  //Redirigir después de iniciar sesión exitosamente
  useEffect(() => {
    if (logged) {
      navigate('/');
    }
  }, [logged, navigate]);

  return (
    <div className='bg-dark h-screen'>
      <div className='h-1/3 w-full bg-white flex justify-center items-center gap-10 p-5'>
        <h1 className='title font-bold text-dark'>Gestión de socios</h1>
        <div className='flex justify-end'>
          <img src={logo} className='max-w-[120px]'/>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center text-dark h-2/3 p-5'>
        <form onSubmit={handleSubmit} className="p-5 w-full max-w-[400px] border rounded bg-white">
          <h2 className="text-xl text-center font-bold mb-4">Inicio de sesión</h2>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-1 font-medium">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 font-medium">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          {messageLogin != "" ? <p className='font-bold pb-4'>{messageLogin}</p> : null}
          <button type="submit" className="w-full bg-[#0B0F3C] text-white py-2 border-1 rounded cursor-pointer">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

