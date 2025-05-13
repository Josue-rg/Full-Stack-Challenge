import React, { useState, useEffect } from 'react';
import { guessWordService, getTimeUntilNextWord, getAttemptsService, getUserStats } from '../services/api';
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
    const val = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 5);
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

const winSound = new Audio('/sounds/victoria.mp3');
const loseSound = new Audio('/sounds/derrota.mp3');
const timeoutSound = new Audio('/sounds/timeout.mp3');

const WordleGame: React.FC = () => {
  useEffect(() => {
    const savedGameState = localStorage.getItem('wordleGameState');
    if (savedGameState) {
      const { attemptsCount, attempts, currentWord, success, timeLeft } = JSON.parse(savedGameState);
      setAttemptsCount(attemptsCount);
      setAttempts(attempts);
      setCurrentWord(currentWord);
      setSuccess(success);
      setTimeLeft(timeLeft);
    }
  }, []);

  const [attemptsCount, setAttemptsCount] = useState(0);
  const [attempts, setAttempts] = useState<LetterFeedback[][]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const gameState = {
      attemptsCount,
      attempts,
      currentWord,
      success,
      timeLeft,
    };
    localStorage.setItem('wordleGameState', JSON.stringify(gameState));
  }, [attemptsCount, attempts, currentWord, success, timeLeft]);

  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const { attempts } = await getAttemptsService();
        setAttemptsCount(attempts);
      } catch (e) {
        setAttemptsCount(0);
      }
    };
    fetchAttempts();
    let interval: NodeJS.Timeout;
    let lastTime = 0;
    let playedTimeout = false;
    const fetchTime = async () => {
      const ms = await getTimeUntilNextWord();
      setTimeLeft(ms);
      lastTime = ms;
      playedTimeout = false;
    };
    fetchTime();
    interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 1000) return prev - 1000;
        if (prev <= 1000 && lastTime !== 0) {
          if (!playedTimeout) {
            winSound.pause();
            winSound.currentTime = 0;
            loseSound.pause();
            loseSound.currentTime = 0;
            timeoutSound.currentTime = 0;
            timeoutSound.play();
            playedTimeout = true;
          }
          setAttempts([]);
          setCurrentWord('');
          setSuccess(false);
          setAttemptsCount(0);
          lastTime = 0;
          fetchTime();
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInput = (value: string) => {
    setCurrentWord(value.toUpperCase());
  };

  const handleGuess = async () => {
    if (currentWord.length !== 5) {
      toast.error('La palabra debe tener 5 letras');
      return;
    }
    setLoading(true);
    try {
      const result = await guessWordService(currentWord);
      setAttempts(prev => [...prev, result]);
      setAttemptsCount(prev => prev + 1);
      setCurrentWord('');
      if (result.every((l: any) => l.value === 1)) {
        setSuccess(true);
        toast.success('¡Felicidades! ¡Palabra correcta!');
        winSound.currentTime = 0;
        winSound.play();
        setAttempts([]);
        setCurrentWord('');
        setAttemptsCount(MAX_ATTEMPTS);
        return;
      }
      if (attempts.length + 1 >= MAX_ATTEMPTS && !result.every((l: any) => l.value === 1)) {
        toast.error('Lo siento, has perdido.');
        loseSound.currentTime = 0;
        loseSound.play();
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error al enviar intento';
      if (msg.toLowerCase().includes('espera la siguiente palabra') || msg.toLowerCase().includes('completado')) {
        toast.info('No puedes jugar hasta la siguiente palabra.');
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const hasLost = attemptsCount >= MAX_ATTEMPTS && !success;

  useEffect(() => {
    if (success || hasLost || timeLeft === 0) {
      const fetchStats = async () => {
        try {
          const updatedStats = await getUserStats();
          setStats(updatedStats);
        } catch (error) {
          console.error('Error al obtener estadísticas:', error);
        }
      };
      fetchStats();
    }
  }, [success, hasLost, timeLeft]);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-white font-bold text-lg mb-2">
        Siguiente palabra en: <span className="font-mono">{formatTime(timeLeft)}</span>
      </div>
      <WordleGrid attempts={attempts} />
      {attemptsCount < MAX_ATTEMPTS ? <AttemptsLeft attempts={attemptsCount} max={MAX_ATTEMPTS} /> : null}
      {attemptsCount < MAX_ATTEMPTS ? (
        <WordInput
          value={currentWord}
          onChange={handleInput}
          onSubmit={handleGuess}
          disabled={success || hasLost || loading}
        />
      ) : (
        <div className="text-red-900 font-bold">Espera a que termine el tiempo para adivinar otra palabra.</div>
      )}

      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
};

export default WordleGame;
