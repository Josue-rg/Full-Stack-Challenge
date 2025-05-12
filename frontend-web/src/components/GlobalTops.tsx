import React, { useEffect, useState } from 'react';
import { getTopPlayers, getPopularWords } from '../services/api';

interface Player {
  username: string;
  wins: number;
}

interface PopularWord {
  word: string;
  count: number;
}

const GlobalTops: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [words, setWords] = useState<PopularWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1000);

    getTopPlayers().then((playersData) => {
      if (isMounted) setPlayers(playersData);
    });
    getPopularWords().then((wordsData) => {
      if (isMounted) setWords(wordsData);
    });
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  if (loading) return <div>Cargando tops mundiales...</div>;

  return (
    <div className="flex flex-col gap-6 w-full items-center justify-center">
    <div className="bg-purple-700 text-white rounded-2xl p-4 shadow-[0_0_15px_rgba(139,92,246,0.8)] hover:shadow-[0_0_25px_rgba(139,92,246,1)] transition-all duration-300 ease-in-out transform hover:scale-105 w-full max-w-xs">
      <h2 className="text-lg font-bold mb-2">Top 10 Jugadores</h2>
      {(() => {
        const validPlayers = players.filter(p => p.username && typeof p.wins === 'number');
        if (validPlayers.length === 0) {
          return <div className="text-gray-400">Aún no hay jugadores</div>;
        }
        return (
          <ol className="list-decimal ml-4">
            {validPlayers.slice(0, 10).map((player) => (
              <li key={player.username} className="mb-1">
                <span className="font-bold">{player.username}</span> - {player.wins} victorias
              </li>
            ))}
          </ol>
        );
      })()}
    </div>

    <div className="bg-gray-900 text-white rounded-2xl p-4 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all duration-300 ease-in-out transform hover:scale-105 w-full max-w-xs">
      <h2 className="text-lg font-bold mb-2">Palabras Más Adivinadas</h2>
      {(() => {
        const validWords = words.filter(w => w.word && typeof w.count === 'number');
        if (validWords.length === 0) {
          return <div className="text-gray-400">Aún no hay palabras</div>;
        }
        return (
          <ol className="list-decimal ml-4">
            {validWords.slice(0, 10).map((word) => (
              <li key={word.word} className="mb-1">
                <span className="font-bold">{word.word}</span> - {word.count} veces
              </li>
            ))}
          </ol>
        );
      })()}
    </div>

    </div>
  );
};

export default GlobalTops;
