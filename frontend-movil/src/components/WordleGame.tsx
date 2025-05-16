import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { gameService } from '../services/api';
import { useUpdate } from '../context/UpdateContext';
import Toast from 'react-native-toast-message';

interface LetterFeedback {
  letter: string;
  value: number;
}

const getBgColor = (value: number) => {
  if (value === 1) return '#22c55e';
  if (value === 2) return '#facc15';
  return '#d1d5db';
};

const WordleGrid: React.FC<{ attempts: LetterFeedback[][] }> = ({ attempts }) => {
  const rows = Array.from({ length: 5 }, (_, i) => 
    attempts[i] || Array.from({ length: 5 }, () => ({ letter: '', value: 0 }))
  );

  return (
    <View style={styles.grid}>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((cell, j) => (
            <View
              key={j}
              style={[
                styles.cell,
                { backgroundColor: getBgColor(cell.value) }
              ]}
            >
              <Text style={styles.cellText}>{cell.letter}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const AttemptsLeft: React.FC<{ attempts: number; max: number }> = ({ attempts, max }) => (
  <Text style={styles.attemptsText}>Intentos restantes: {max - attempts}</Text>
);

const WordInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}> = ({ value, onChange, onSubmit, disabled }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => onChange(text.slice(0, 5).toUpperCase())}
        maxLength={5}
        placeholder="Escribe tu palabra"
        placeholderTextColor="#666"
        autoCapitalize="characters"
        editable={!disabled}
      />
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
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
            Toast.show({
              type: 'error',
              text2: '¡Tiempo agotado!',
              position: 'top',
              visibilityTime: 2000,
              topOffset: 50,
            });
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
        console.log('Error', response.message || 'No se pudo iniciar el juego');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleGuess = async () => {
    if (currentWord.length !== 5) {
      Toast.show({
        type: 'info',
        text2: 'La palabra debe tener 5 letras',
        position: 'top',
        visibilityTime: 2000,
        topOffset: 50,
      });
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
      
      if (response.isWon) {
        setSuccess(true);
        Toast.show({
          type: 'success',
          text1: '¡Woo!',
          text2: '¡Felicidades!, ¡Has ganado!',
          position: 'top',
          visibilityTime: 2000,
          topOffset: 50,
        });
        setShowGame(false);
        triggerUpdate();
      } else if (response.gameCompleted && !response.isWon) {
        Toast.show({
          type: 'error',
          text1: 'Nooooo!',
          text2: 'Game Over, ¡Se acabaron los intentos!',
          position: 'top',
          visibilityTime: 2000,
          topOffset: 50,
        });
        setShowGame(false);
        triggerUpdate();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6b46c1" />
      ) : !showGame ? (
        <View style={styles.startContainer}>
          <Text style={styles.title}>¡Hola!, jugemos!!!</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartGame}
            disabled={loading}
          >
            <Text style={styles.startButtonText}>
              {loading ? 'Iniciando...' : 'JUGAR'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.timerText}>
            Siguiente palabra en: <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
          </Text>
          <WordleGrid attempts={attempts} />
          {attemptsCount < MAX_ATTEMPTS && !success && (
            <>
              <AttemptsLeft attempts={attemptsCount} max={MAX_ATTEMPTS} />
              <WordInput
                value={currentWord}
                onChange={setCurrentWord}
                onSubmit={handleGuess}
                disabled={loading || success}
              />
            </>
          )}
        </>
      )}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#4C1D95',
  },
  grid: {
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  cell: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cellText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 20,
    textAlign: 'center',
    color: '#1F2937',
  },
  button: {
    backgroundColor: '#6b46c1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '60%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  attemptsText: {
    color: 'white',
    fontSize: 16,
    marginVertical: 12,
  },
  startContainer: {
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#6b46c1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  timerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timerValue: {
    fontFamily: 'monospace',
  },
});

export default WordleGame;