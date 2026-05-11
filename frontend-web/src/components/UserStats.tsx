import React, { useEffect, useState } from 'react';
import { getUserStats } from '../services/api';
import { useUpdate } from '../context/UpdateContext';
import { motion } from 'framer-motion';

interface UserStatsData {
  totalGames: number;
  totalWins: number;
}

const UserStats: React.FC = () => {
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { updateCounter } = useUpdate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found');
      setLoading(false);
      return;
    }

    getUserStats()
      .then(data => {
        setStats(data);
      })
      .catch(error => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [updateCounter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <div className="relative">
          <div className="w-10 h-10 border-4 border-purple-500/30 rounded-full"></div>
          <div className="absolute inset-0 w-10 h-10 border-4 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
        <span className="text-purple-300/60 text-sm">Cargando estadísticas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="relative bg-[#0f0f1a]/90 backdrop-blur-xl rounded-2xl p-5 border border-red-500/20 shadow-2xl w-full max-w-xs mx-auto overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold">Error</h2>
            <p className="text-red-300/60 text-sm">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const winRate = stats ? Math.round((stats.totalWins / Math.max(stats.totalGames, 1)) * 100) : 0;

  return (
    <motion.div 
      className="relative bg-[#0f0f1a]/90 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/20 shadow-2xl w-full max-w-xs mx-auto overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Scanning line */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan"></div>
      
      {/* Header */}
      <div className="relative flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-lg font-black text-white" style={{ textShadow: '0 0 20px rgba(6,182,212,0.5)' }}>
          Tus Estadísticas
        </h2>
      </div>

      {/* Stats */}
      <div className="relative space-y-3">
        {/* Games Played */}
        <motion.div 
          className="flex items-center gap-3 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 px-4 py-3 rounded-xl border border-cyan-500/10"
          whileHover={{ x: 5 }}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-purple-300/60 text-xs uppercase tracking-wider font-medium">Juegos Jugados</p>
            <p className="text-white font-black text-2xl">{stats?.totalGames || 0}</p>
          </div>
        </motion.div>

        {/* Wins */}
        <motion.div 
          className="flex items-center gap-3 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 px-4 py-3 rounded-xl border border-yellow-500/10"
          whileHover={{ x: 5 }}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-yellow-300/60 text-xs uppercase tracking-wider font-medium">Victorias</p>
            <p className="text-white font-black text-2xl">{stats?.totalWins || 0}</p>
          </div>
        </motion.div>

        {/* Win Rate */}
        <motion.div 
          className="flex items-center gap-3 bg-gradient-to-r from-green-900/30 to-emerald-900/30 px-4 py-3 rounded-xl border border-green-500/10"
          whileHover={{ x: 5 }}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-green-300/60 text-xs uppercase tracking-wider font-medium">Tasa de Victoria</p>
            <div className="flex items-center gap-2">
              <p className="text-white font-black text-2xl">{winRate}%</p>
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${winRate}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {!stats && (
        <div className="relative mt-4 text-center">
          <p className="text-cyan-300/40 text-sm">Aún no hay estadísticas</p>
        </div>
      )}
    </motion.div>
  );
};

export default UserStats;