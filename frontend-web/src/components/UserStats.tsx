import React, { useEffect, useState } from 'react';
import { getUserStats } from '../services/api';

interface UserStatsData {
  totalGames: number;
  totalWins: number;
}

const UserStats: React.FC = () => {
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found');
      setLoading(false);
      return;
    }

    getUserStats(token)
      .then(data => {
        setStats(data);
      })
      .catch(error => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando estadísticas...</div>;

  if (error) return (
    <div className="bg-gray-900 text-white rounded p-4 shadow w-full max-w-xs mx-auto">
      <h2 className="text-lg font-bold mb-2">Error</h2>
      <div className="text-gray-400">{error}</div>
    </div>
  );

  if (!stats) return (
    <div className="bg-gray-900 text-white rounded p-4 shadow w-full max-w-xs mx-auto">
      <h2 className="text-lg font-bold mb-2">Tus Estadísticas</h2>
      <div className="flex flex-col gap-2">
        <div>Juegos jugados: <span className="font-bold">0</span></div>
        <div>Victorias: <span className="font-bold">0</span></div>
      </div>
      <div className="text-gray-400 mt-2">Aún no hay estadísticas</div>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white rounded-2xl p-4 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all duration-300 ease-in-out transform hover:scale-105 w-full max-w-xs mx-auto">
      <h2 className="text-lg font-bold mb-2 text-center">Tus Estadísticas</h2>
      <div className="flex flex-col">
        <div className="border-t border-white/20 py-2 px-3 shadow-inner shadow-white/10 rounded-md">
          Juegos jugados: <span className="font-bold">{stats.totalGames}</span>
        </div>
        <div className="border-t border-white/20 py-2 px-3 shadow-inner shadow-white/10 rounded-md">
          Victorias: <span className="font-bold">{stats.totalWins}</span>
        </div>
      </div>
    </div>
  );
  
  
};

export default UserStats;
