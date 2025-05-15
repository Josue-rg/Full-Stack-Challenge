import React, { useState, useEffect } from 'react';
import { gameService } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LetterFeedback {
  letter: string;
  value: number;
}

interface WordleGridProps {
  attempts: LetterFeedback[][];
}

const getBgColor = (value: number) => {
  if (value === 1) return 'bg-green-500 text-white';
  if (value === 2) return 'bg-yellow-400 text-white';
  return 'bg-gray-300 text-gray-800';
};

const WordleGrid: React.FC<WordleGridProps> = ({ attempts }) => {
  const rows = Array.from({ length: 5 }, (_, i) => attempts[i] || Array.from({ length: 5 }, () => ({ letter: '', value: 0 })));
  return (
    <div className="grid grid-rows-5 gap-2">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2">
          {row.map((cell, j) => (
            <div
              key={j}
              className={`w-12 h-12 flex items-center justify-center border rounded text-2xl font-bold ${getBgColor(cell.value)}`}
            >
              {cell.letter}
            </div>
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
  <div className="text-gray-100">Intentos restantes: {max - attempts}</div>
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
    <div className="flex flex-col gap-2 items-center">
      <input
        type="text"
        className="border rounded px-4 py-2 text-xl uppercase tracking-widest text-center"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        maxLength={5}
        disabled={disabled}
        placeholder="Escribe tu palabra"
        autoFocus
      />
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="bg-white text-blhack px-4 py-2 rounded hover:bg-purple-800 disabled:opacity-50"
      >
        Enviar
      </button>
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

  // Temporizador para el juego
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

    // Limpiar el intervalo cuando el componente se desmonte o el juego termine
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
      } else if (response.gameCompleted && !response.isWon) {
        toast.error('¡Game Over! Se acabaron los intentos');
        setShowGame(false);
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
    <div className="flex flex-col items-center gap-4">
      {loading ? (
        <div className="loading-spinner">Cargando...</div>
      ) : !showGame ? (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-white text-2xl mb-4">¡Hola!, jugemos!!!</h2>
          <button
            onClick={handleStartGame}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors text-xl font-bold"
            disabled={loading}
          >
            {loading ? 'Iniciando...' : 'JUGAR'}
          </button>
        </div>
      ) : (
        <>
          <div className="text-white font-bold text-lg mb-2">
            Siguiente palabra en: <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
          <WordleGrid attempts={attempts} />
          {attemptsCount < MAX_ATTEMPTS && !success && (
            <>
              <AttemptsLeft attempts={attemptsCount} max={MAX_ATTEMPTS} />
              <WordInput
                value={currentWord}
                onChange={handleInput}
                onSubmit={handleGuess}
                disabled={loading || success}
              />
            </>
          )}
        </>
      )}
      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
};

export default WordleGame;
