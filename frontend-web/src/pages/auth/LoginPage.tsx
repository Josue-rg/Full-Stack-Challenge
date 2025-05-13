import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { authService } from '../../services/api';

interface User {
  id: string;
  username: string;
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const usersData = await authService.getAllUsers();
        setUsers(usersData);
      } catch {
        setUsers([]);
      }
    };
    getAllUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Por favor, completa todos los campos');
      return;
    }

    const userExists = users.find(user => 
      user.username.toLowerCase() === username.toLowerCase()
    );
    
    if (!userExists) {
      toast.error('El usuario no existe');
      return;
    }
    
    try {
      await login(username, password);
      navigate('/');
    } catch {
      toast.error('Contraseña incorrecta');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-900 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8 bg-white/10 p-8 rounded-xl shadow-lg backdrop-blur-sm border border-purple-400">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-black-800 drop-shadow-md animate-pulse">
            Iniciar sesión
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Nombre de usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="bg-white/20 backdrop-blur-sm border  text-black rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="bg-white/20 backdrop-blur-sm border  text-black rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
  
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 text-sm font-bold rounded-md text-white bg-purple-900 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 transition duration-300 shadow-lg shadow-pink-500/50"
            >
             Iniciar sesión
            </button>
          </div>
          
          <div className="text-sm text-center text-pink-200">
            <Link to="/register" className="hover:text-white transition duration-300">
              ¿No tienes una cuenta? <span className="underline">Regístrate</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default LoginPage;
