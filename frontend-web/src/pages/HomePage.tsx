import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WordleGame from '../components/WordleGame';
import GlobalTops from '../components/GlobalTops';
import UserStats from '../components/UserStats';
import AddWord from '../components/AddWord';
import { UpdateProvider } from '../context/UpdateContext';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAddWord, setShowAddWord] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] relative overflow-hidden flex flex-col">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid-move"></div>
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 
                ? 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)' 
                : 'radial-gradient(circle, rgba(236,72,153,0.6) 0%, transparent 70%)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.6, 0.2],
              y: [0, -20 - Math.random() * 30],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-20 bg-[#0f0f1a]/80 backdrop-blur-xl border-b border-purple-500/20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              {/* 3D Logo */}
              <div className="flex gap-1">
                {['W', 'O', 'R', 'D', 'L', 'E'].map((letter, index) => (
                  <motion.div
                    key={index}
                    className="relative"
                    whileHover={{ y: -5, rotateZ: (Math.random() - 0.5) * 10 }}
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br rounded-lg blur-sm opacity-60
                        ${index === 0 ? 'from-cyan-400 to-blue-600' : 
                          index === 1 ? 'from-purple-400 to-pink-600' :
                          index === 2 ? 'from-yellow-400 to-orange-600' :
                          index === 3 ? 'from-green-400 to-emerald-600' :
                          index === 4 ? 'from-pink-400 to-rose-600' :
                          'from-indigo-400 to-purple-600'}`}
                    ></div>
                    <div className={`relative bg-gradient-to-br text-white font-black text-lg w-8 h-8 flex items-center justify-center rounded-lg shadow-lg border border-white/20
                      ${index === 0 ? 'from-cyan-400 to-blue-600' : 
                        index === 1 ? 'from-purple-400 to-pink-600' :
                        index === 2 ? 'from-yellow-400 to-orange-600' :
                        index === 3 ? 'from-green-400 to-emerald-600' :
                        index === 4 ? 'from-pink-400 to-rose-600' :
                        'from-indigo-400 to-purple-600'}`}>
                      {letter}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
              <div className="flex items-center gap-4">
               <motion.div 
                 className="text-purple-300/80 text-sm font-medium"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
               >
                 {user?.username}
                 {user?.role === 'admin' && (
                   <span className="ml-2 text-xs bg-purple-600 px-2 py-1 rounded">ADMIN</span>
                 )}
               </motion.div>
               
               {user?.role === 'admin' && (
                 <Link to="/admin">
                   <motion.button
                     className="relative group overflow-hidden rounded-xl"
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                   >
                     <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-xy"></div>
                     <div className="relative bg-transparent text-white font-semibold py-2 px-5 rounded-xl border border-white/20 flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                       </svg>
                       <span>Admin</span>
                     </div>
                   </motion.button>
                 </Link>
               )}
              
              <motion.button
                onClick={handleLogout}
                className="relative group overflow-hidden rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-gradient-xy"></div>
                <div className="relative bg-transparent text-white font-semibold py-2 px-5 rounded-xl border border-white/20 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar sesión</span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>
  
      <div className="relative z-10 py-10 flex-1">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UpdateProvider>
            <motion.div 
              className="flex flex-col md:flex-row gap-6 items-start justify-center w-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* Global Tops - Left Panel */}
              <motion.div 
                className="flex-1 flex justify-center w-full md:w-auto"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-full max-w-sm">
                  <GlobalTops />
                </div>
              </motion.div>

              {/* Wordle Game - Center */}
              <motion.div 
                className="flex-1 flex justify-center w-full md:w-auto"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="relative">
                  {/* Glow effect behind game */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 blur-3xl rounded-full"></div>
                  
                  {/* Game container */}
                  <div className="relative bg-[#0f0f1a]/80 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20 shadow-2xl">
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-purple-500/30 rounded-tl-3xl"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-pink-500/30 rounded-tr-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-pink-500/30 rounded-bl-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-purple-500/30 rounded-br-3xl"></div>
                    
                    <div className="w-full max-w-md">
                      <WordleGame />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Panel - Stats & Add Word */}
              <motion.div 
                className="flex-1 flex flex-col items-center gap-4 w-full md:w-auto"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="w-full max-w-sm">
                  <UserStats />
                </div>
                
                <motion.button
                  onClick={() => setShowAddWord(!showAddWord)}
                  className="w-full max-w-sm relative group overflow-hidden rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-gradient-xy"></div>
                  <div className="relative bg-transparent text-white font-semibold py-3 px-6 rounded-xl border border-white/20 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>{showAddWord ? 'Ocultar Agregar Palabra' : 'Agregar Palabra'}</span>
                  </div>
                </motion.button>
                
                {showAddWord && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-sm"
                  >
                    <AddWord />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </UpdateProvider>
        </main>
      </div>

      {/* Footer */}
      <motion.footer 
        className="relative z-10 py-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center justify-center gap-4 text-purple-500/30 text-xs">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-purple-500/30"></div>
          <span className="tracking-widest uppercase">WORDLE Challenge © 2026</span>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-purple-500/30"></div>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomePage;