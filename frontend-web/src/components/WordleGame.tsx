import React, { useState, useEffect } from 'react';
import { gameService } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUpdate } from '../context/UpdateContext';
import { motion, AnimatePresence } from 'framer-motion';

interface LetterFeedback {
  letter: string;
  value: number;
}

interface WordleGridProps {
  attempts: LetterFeedback[][];
}

const getBgColor = (value: number) => {
  if (value === 1) return 'from-green-500 to-emerald-600 text-white border-green-400';
  if (value === 2) return 'from-yellow-500 to-orange-500 text-white border-yellow-400';
  return 'from-gray-700 to-gray-800 text-gray-300 border-gray-600';
};

const WordleGrid: React.FC<WordleGridProps> = ({ attempts }) => {
  const rows = Array.from({ length: 5 }, (_, i) => attempts[i] || Array.from({ length: 5 }, () => ({ letter: '', value: 0 })));
  
  return (
    <div className="grid grid-rows-5 gap-2 p-2">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2 justify-center">
          {row.map((cell, j) => (
            <motion.div
              key={j}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: cell.letter ? 1 : 0.8, 
                opacity: cell.letter ? 1 : 0.5 
              }}
              transition={{ delay: cell.letter ? j * 0.1 : 0 }}
              className={`w-14 h-14 flex items-center justify-center border-2 rounded-xl text-2xl font-black bg-gradient-to-br shadow-lg ${getBgColor(cell.value)}`}
              style={{
                textShadow: cell.value > 0 ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
              }}
            >
              {cell.letter}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

interface AttemptsLeftProps {
  attempts: number;
  max: number;
}

const AttemptsLeft: React.FC<AttemptsLeftProps> = ({ attempts, max }) => (
  <div className="flex items-center gap-2">
    <span className="text-purple-300/80 text-sm font-medium">Intentos restantes:</span>
    <div className="flex gap-1">
      {Array.from({ length: max - attempts }, (_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
        />
      ))}
    </div>
  </div>
);

interface WordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

const WordInput: React.FC<WordInputProps> = ({ value, onChange, onSubmit, disabled }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 5);
    onChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-3 items-center w-full max-w-xs">
      <div className="relative w-full transition-transform duration-300 focus-within:scale-[1.02]">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30 group-focus-within:opacity-60 transition-opacity duration-500 animate-gradient-xy"></div>
        <input
          type="text"
          className="relative w-full bg-[#1a1a2e]/90 backdrop-blur-md border border-purple-500/30 text-white placeholder-purple-300/50 rounded-xl px-4 py-3 text-xl uppercase tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-bold"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          maxLength={5}
          disabled={disabled}
          placeholder="Escribe tu palabra"
          autoFocus
        />
      </div>
      
      <motion.button
        onClick={onSubmit}
        disabled={disabled}
        className="relative group overflow-hidden rounded-xl w-full"
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-gradient-xy"></div>
        <div className="relative bg-transparent text-white font-black py-3 px-6 rounded-xl border border-white/20 flex items-center justify-center gap-2 disabled:opacity-50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>ENVIAR</span>
        </div>
      </motion.button>
    </div>
  );
};

const MAX_ATTEMPTS = 5;

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const WordleGame = () => {
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [attempts, setAttempts] = useState<LetterFeedback[][]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showGame, setShowGame] = useState(false);
  const [gameId, setGameId] = useState<number | null>(null);
  const { triggerUpdate } = useUpdate();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (showGame && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1000) {
            clearInterval(intervalId);
            toast.error('¡Tiempo agotado!');
            setShowGame(false);
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [showGame, timeLeft]);

  const handleStartGame = async () => {
    setLoading(true);
    try {
      const response = await gameService.startGame();
      if (response.success && response.gameId) {
        setGameId(response.gameId);
        setShowGame(true);
        setTimeLeft(300000);
        setAttemptsCount(0);
        setAttempts([]);
        setCurrentWord('');
        setSuccess(false);
      } else {
        toast.error(response.message || 'No se pudo iniciar el juego');
      }
    } catch (error) {
      console.error('Error al iniciar el juego:', error);
      toast.error('Error al iniciar el juego');
    } finally {
      setLoading(false);
    }
  };

  const handleGuess = async () => {
    if (currentWord.length !== 5) {
      toast.error('La palabra debe tener 5 letras');
      return;
    }
    setLoading(true);
    try {
      const response = await gameService.sendAttempt(gameId!, currentWord);
      const formattedResult = response.feedback.map((value: number, index: number) => ({
        letter: currentWord[index],
        value
      }));
      setAttempts(prev => [...prev, formattedResult]);
      setAttemptsCount(response.attempts);
      setCurrentWord('');
      
      console.log('Respuesta del intento:', response);
      
      if (response.isWon) {
        setSuccess(true);
        toast.success('¡Felicidades! ¡Has ganado!');
        setShowGame(false);
        triggerUpdate();
      } else if (response.gameCompleted && !response.isWon) {
        toast.error('¡Game Over! Se acabaron los intentos');
        setShowGame(false);
        triggerUpdate();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al validar la palabra');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (value: string) => {
    setCurrentWord(value.toUpperCase());
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
            <span className="text-purple-300/80 font-medium">Cargando...</span>
          </motion.div>
        ) : !showGame ? (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="text-center">
              <motion.h2 
                className="text-white text-3xl font-black mb-2"
                style={{ textShadow: '0 0 30px rgba(139,92,246,0.5)' }}
              >
                ¡Hola!, jugemos!!!
              </motion.h2>
              <p className="text-purple-300/60 text-sm">Adivina la palabra en 5 intentos</p>
            </div>
            
            <motion.button
              onClick={handleStartGame}
              disabled={loading}
              className="relative group overflow-hidden rounded-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-gradient-xy"></div>
              <div className="relative bg-transparent text-white font-black py-4 px-12 rounded-2xl border border-white/20 flex items-center justify-center gap-2 text-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{loading ? 'Iniciando...' : 'JUGAR'}</span>
              </div>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-6 w-full"
          >
            {/* Timer */}
            <motion.div 
              className="flex items-center gap-3 bg-[#1a1a2e]/80 backdrop-blur-md px-6 py-3 rounded-xl border border-purple-500/20"
              animate={{ 
                borderColor: timeLeft < 60000 ? 'rgba(239,68,68,0.5)' : 'rgba(139,92,246,0.2)',
              }}
            >
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-purple-300/80 font-medium">Tiempo:</span>
              <span className={`font-mono text-xl font-bold ${timeLeft < 60000 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </motion.div>

            {/* Game Grid */}
            <WordleGrid attempts={attempts} />
            
            {/* Attempts Left & Input */}
            {attemptsCount < MAX_ATTEMPTS && !success && (
              <motion.div 
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AttemptsLeft attempts={attemptsCount} max={MAX_ATTEMPTS} />
                <WordInput
                  value={currentWord}
                  onChange={handleInput}
                  onSubmit={handleGuess}
                  disabled={loading || success}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer 
        position="top-center" 
        theme="dark"
        toastClassName="bg-[#0f0f1a] border border-purple-500/30 text-white"
        progressClassName="bg-gradient-to-r from-purple-500 to-pink-500"
      />
    </div>
  );
};

export default WordleGame;