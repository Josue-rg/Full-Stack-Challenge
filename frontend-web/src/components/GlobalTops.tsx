import React, { useEffect, useState } from 'react';
import { getTopPlayers, getPopularWords } from '../services/api';

interface Player {
  user_username: string;
  user_totalWins: number;
}

interface PopularWord {
  word: string;
  totalguesses: string;
}

const GlobalTops = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [words, setWords] = useState<PopularWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1000);

    const fetchData = async () => {
      try {
        const playersData = await getTopPlayers();
        if (isMounted) {
          if ('message' in playersData) {
            setPlayers([]);
          } else {
            setPlayers(playersData);
          }
        }
        const wordsData = await getPopularWords();
        if (isMounted) {
          if ('message' in wordsData) {
            setWords([]);
          } else {
            setWords(wordsData);
          }
        }
      } catch (error) {
        console.error('Error durante el fetch:', error);
        setError('Error al cargar los datos');
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  if (loading) return <div>Cargando tops mundiales...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col gap-6 w-full items-center justify-center">
      <div className="bg-purple-600 text-white rounded-2xl p-4 shadow-[0_0_15px_rgba(139,92,246,0.8)] hover:shadow-[0_0_25px_rgba(139,92,246,1)] transition-all duration-300 ease-in-out transform hover:scale-105 w-full max-w-xs">
        <h2 className="text-lg font-bold mb-4 text-center">Top 10 Jugadores</h2>
        {(() => {
          const validPlayers = players.filter(p => p.user_username && typeof p.user_totalWins === 'number');
          if (validPlayers.length === 0) {
            return <div className="text-gray-300 text-center">Aún no hay jugadores con victorias</div>;
          }
          const getIcon = (index) => {
            if (index === 0) return "👑";
            if (index === 1) return "2️⃣";
            if (index === 2) return "3️⃣";
            return (
              <span className="bg-white text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
            );
          };
          return (
            <ul className="divide-y divide-white/30">
              {validPlayers.slice(0, 10).map((player, index) => (
                <li
                  key={player.user_username}
                  className="flex items-center justify-between gap-2 bg-purple-600/40 px-3 py-2 border-t border-white/30 shadow-inner shadow-purple-300/20 rounded-md"
                >
                  <div className="w-8 text-left">{getIcon(index)}</div>
                  <div className="flex-1 text-center font-semibold">{player.user_username}</div>
                  <div className="text-right text-sm">{player.user_totalWins} 🏆</div>
                </li>
              ))}
            </ul>
          );
        })()}
      </div>
  
      {/* PALABRAS MÁS ADIVINADAS */}
      <div className="bg-gray-800 text-white rounded-2xl p-4 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all duration-300 ease-in-out transform hover:scale-105 w-full max-w-xs">
        <h2 className="text-lg font-bold mb-4 text-center">Palabras Más Adivinadas</h2>
        {(() => {
          const validWords = words.filter(w => w.word && typeof w.totalguesses === 'string');
          if (validWords.length === 0) {
            return <div className="text-gray-400 text-center">Aún no hay palabras adivinadas</div>;
          }
          const getIcon = (index) => {
            if (index === 0) return "👑";
            if (index === 1) return "2️⃣";
            if (index === 2) return "3️⃣";
            return (
              <span className="bg-white text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
            );
          };
          return (
            <ul className="divide-y divide-white/20">
              {validWords.slice(0, 10).map((word, index) => (
                <li
                  key={word.word}
                  className="flex items-center justify-between gap-2 bg-gray-800/50 px-3 py-2 border-t border-white/20 shadow-inner shadow-white/10 rounded-md"
                >
                  <div className="w-8 text-left">{getIcon(index)}</div>
                  <div className="flex-1 text-center font-semibold">{word.word}</div>
                  <div className="text-right text-sm">{word.totalguesses} 🔠</div>
                </li>
              ))}
            </ul>
          );
        })()}
      </div>
    </div>
  );
  
  
  
  
};

export default GlobalTops;
