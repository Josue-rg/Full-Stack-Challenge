import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WordleGame from '../components/WordleGame';
import GlobalTops from '../components/GlobalTops';
import UserStats from '../components/UserStats';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-purple-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-white drop-shadow-sm">WORDLE</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-white mr-4">
                Hola, {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-purple-700 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-400 transition"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
  
      <div className="py-10">
        <main>
          <div className="mx-auto">
            <div className="px-4 sm:px-0">
              <div className="flex flex-col md:flex-row gap-4 items-start justify-center w-full">
                <div className="flex-1 flex justify-center"><GlobalTops /></div>
                <div className="flex-1 flex justify-center"><div className="bg-purple-900 rounded-3xl p-4 border w-full max-w-lg"><WordleGame /></div></div>
                <div className="flex-1 flex justify-center"><UserStats /></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
  
};

export default HomePage;
