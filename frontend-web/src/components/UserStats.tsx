import React, { useEffect, useState } from 'react';
import { getUserStats } from '../services/api';

interface UserStatsData {
  totalGames: number;
  totalWins: number;
}


const UserStats: React.FC = () => {
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    getUserStats().then(data => {
      timeoutId = setTimeout(() => {
        setStats(data);
        setLoading(false);
      }, 1000);
    });
    return () => clearTimeout(timeoutId);
  }, []);

  if (loading) return <div>Cargando estadísticas...</div>;
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
      <h2 className="text-lg font-bold mb-2">Tus Estadísticas</h2>
      <div className="flex flex-col gap-2">
        <div>Juegos jugados: <span className="font-bold">{stats.totalGames}</span></div>
        <div>Victorias: <span className="font-bold">{stats.totalWins}</span></div>
      </div>
    </div>
  );
};

export default UserStats;
