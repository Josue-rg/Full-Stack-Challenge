import React, { useEffect, useState } from 'react';
import { getTopPlayers, getPopularWords } from '../services/api';
import { useUpdate } from '../context/UpdateContext';
import { motion } from 'framer-motion';

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
  const { updateCounter } = useUpdate();

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1000);

    const fetchData = async () => {
      try {
        const playersData = await getTopPlayers();
        console.log('Datos de jugadores:', playersData);
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
  }, [updateCounter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-purple-500/30 rounded-full"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
        <span className="text-purple-300/60 text-sm">Cargando tops mundiales...</span>
      </div>
    );
  }
  
  if (error) return <div className="text-red-400 text-center p-4">{error}</div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="flex flex-col gap-6 w-full items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* TOP 10 JUGADORES */}
      <motion.div 
        className="relative bg-[#0f0f1a]/90 backdrop-blur-xl rounded-2xl p-5 border border-purple-500/20 shadow-2xl w-full max-w-xs overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Scanning line */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent animate-scan"></div>
        
        {/* Header */}
        <div className="relative flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h2 className="text-lg font-black text-white" style={{ textShadow: '0 0 20px rgba(139,92,246,0.5)' }}>
            Top 10 Jugadores
          </h2>
        </div>

        {/* List */}
        <motion.ul 
          className="relative space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {(() => {
            const validPlayers = players.filter(p => p.user_username && typeof p.user_totalWins === 'number');
            if (validPlayers.length === 0) {
              return <div className="text-purple-300/40 text-center py-4">Aún no hay jugadores con victorias</div>;
            }
            const getIcon = (index: number) => {
              if (index === 0) return <span className="text-xl">👑</span>;
              if (index === 1) return <span className="text-xl">🥈</span>;
              if (index === 2) return <span className="text-xl">🥉</span>;
              return (
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xs font-bold text-white">
                  {index + 1}
                </span>
              );
            };
            return (
              <>
                {validPlayers.slice(0, 10).map((player, index) => (
                  <motion.li
                    key={player.user_username}
                    variants={itemVariants}
                    className="flex items-center gap-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 px-3 py-2 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
                    whileHover={{ x: 5, backgroundColor: 'rgba(139,92,246,0.1)' }}
                  >
                    <div className="w-8 flex-shrink-0">{getIcon(index)}</div>
                    <div className="flex-1 text-center">
                      <span className="text-white font-semibold text-sm truncate block">{player.user_username}</span>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="text-purple-400 font-bold text-sm">{player.user_totalWins}</span>
                      <span className="text-xs ml-1">🏆</span>
                    </div>
                  </motion.li>
                ))}
              </>
            );
          })()}
        </motion.ul>
      </motion.div>

      {/* PALABRAS MÁS ADIVINADAS */}
      <motion.div 
        className="relative bg-[#0f0f1a]/90 backdrop-blur-xl rounded-2xl p-5 border border-pink-500/20 shadow-2xl w-full max-w-xs overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Scanning line */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent animate-scan"></div>
        
        {/* Header */}
        <div className="relative flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-lg font-black text-white" style={{ textShadow: '0 0 20px rgba(236,72,153,0.5)' }}>
            Palabras Top
          </h2>
        </div>

        {/* List */}
        <motion.ul 
          className="relative space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {(() => {
            const validWords = words.filter(w => w.word && typeof w.totalguesses === 'string');
            if (validWords.length === 0) {
              return <div className="text-pink-300/40 text-center py-4">Aún no hay palabras adivinadas</div>;
            }
            const getIcon = (index: number) => {
              if (index === 0) return <span className="text-xl">👑</span>;
              if (index === 1) return <span className="text-xl">🥈</span>;
              if (index === 2) return <span className="text-xl">🥉</span>;
              return (
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {index + 1}
                </span>
              );
            };
            return (
              <>
                {validWords.slice(0, 10).map((word, index) => (
                  <motion.li
                    key={word.word}
                    variants={itemVariants}
                    className="flex items-center gap-3 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 px-3 py-2 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300"
                    whileHover={{ x: 5, backgroundColor: 'rgba(6,182,212,0.1)' }}
                  >
                    <div className="w-8 flex-shrink-0">{getIcon(index)}</div>
                    <div className="flex-1 text-center">
                      <span className="text-white font-semibold text-sm uppercase tracking-wider truncate block">{word.word}</span>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="text-cyan-400 font-bold text-sm">{word.totalguesses}</span>
                      <span className="text-xs ml-1">🔤</span>
                    </div>
                  </motion.li>
                ))}
              </>
            );
          })()}
        </motion.ul>
      </motion.div>
    </motion.div>
  );
};

export default GlobalTops;