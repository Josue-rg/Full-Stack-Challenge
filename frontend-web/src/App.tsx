import { useState } from 'react';
import { authService } from './services/api';
import { motion } from 'framer-motion';
import { FaSignOutAlt } from 'react-icons/fa';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.access_token);
      setIsLoggedIn(true);
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center p-4 font-sans">
      <motion.div
        className="bg-purple-800 p-8 rounded-2xl shadow-[0_0_25px_#a855f7] w-full max-w-md border border-purple-400"
      >
        {isLoggedIn ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-6 text-pink-300">
              ¡Bienvenido!
            </h1>
            <p className="text-center mb-6 text-purple-200">
              Has ingresado
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-pink-500 to-red-600 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-125 transition shadow-lg shadow-pink-500"
            >
              <FaSignOutAlt />
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-6 text-purple-300 drop-shadow-md">
              Iniciar sesión
            </h1>

            {error && (
              <div className="bg-red-200 text-red-700 border border-red-500 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-purple-200 mb-2">
                  Correo
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-400 rounded bg-purple-700 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-purple-200 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-400 rounded bg-purple-700 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white py-2 px-4 rounded-xl hover:scale-105 transition shadow-md shadow-fuchsia-500"
              >
                Entrar
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default App;
