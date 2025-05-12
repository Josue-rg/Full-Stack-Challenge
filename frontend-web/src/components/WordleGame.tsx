import React, { useState, useEffect } from 'react';
import { guessWordService, getTimeUntilNextWord } from '../services/api';
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

const WordleGame: React.FC = () => {
  const [attempts, setAttempts] = useState<LetterFeedback[][]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let lastTime = 0;
    const fetchTime = async () => {
      const ms = await getTimeUntilNextWord();
      setTimeLeft(ms);
      lastTime = ms;
    };
    fetchTime();
    interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 1000) return prev - 1000;
        // Si el contador llega a cero, reinicia el estado del juego
        if (prev <= 1000 && lastTime !== 0) {
          setAttempts([]);
          setCurrentWord('');
          setSuccess(false);
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
      setCurrentWord('');
      if (result.every((l: any) => l.value === 1)) {
        setSuccess(true);
        toast.success('¡Felicidades! ¡Palabra correcta!');
      }
      if (attempts.length + 1 >= MAX_ATTEMPTS && !result.every((l: any) => l.value === 1)) {
        toast.error('¡Has alcanzado el máximo de intentos!');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al enviar intento');
    } finally {
      setLoading(false);
    }
  };

  const hasLost = attempts.length >= MAX_ATTEMPTS && !success;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-purple-900 font-bold text-lg mb-2">
        Siguiente palabra en: <span className="font-mono">{formatTime(timeLeft)}</span>
      </div>
      <WordleGrid attempts={attempts} />
      <AttemptsLeft attempts={attempts.length} max={MAX_ATTEMPTS} />
      {success && (
        <div className="text-green-600 font-bold">¡Adivinaste la palabra! Espera la siguiente ronda.</div>
      )}
      {hasLost && (
        <div className="text-red-600 font-bold">Sin intentos. Espera la siguiente palabra.</div>
      )}
      <WordInput
        value={currentWord}
        onChange={handleInput}
        onSubmit={handleGuess}
        disabled={success || hasLost || loading}
      />
      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
};

export default WordleGame;
