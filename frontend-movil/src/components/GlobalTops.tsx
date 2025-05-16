import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { getTopPlayers, getPopularWords } from '../services/api';
import { useUpdate } from '../context/UpdateContext';

interface GlobalTopsProps {
  visible: boolean;
  onClose: () => void;
}

interface Player {
  user_username: string;
  user_totalWins: number;
}

interface PopularWord {
  word: string;
  totalguesses: string;
}

const GlobalTops: React.FC<GlobalTopsProps> = ({ visible, onClose }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [words, setWords] = useState<PopularWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
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

  const getIcon = (index: number) => {
    if (index === 0) return "👑";
    if (index === 1) return "2️⃣";
    if (index === 2) return "3️⃣";
    return `${index + 1}`;
  };

  if (loading) return <Text style={styles.loadingText}>Cargando tops mundiales...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <ScrollView 
            style={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.title}>Top 10 Jugadores</Text>
              {players.length === 0 ? (
                <Text style={styles.emptyText}>Aún no hay jugadores con victorias</Text>
              ) : (
                <View style={styles.list}>
                  {players.slice(0, 10).map((player, index) => (
                    <View key={player.user_username} style={styles.listItem}>
                      <Text style={styles.icon}>{getIcon(index)}</Text>
                      <Text style={styles.playerName}>{player.user_username}</Text>
                      <Text style={styles.score}>{player.user_totalWins} 🏆</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.title}>Palabras Más Adivinadas</Text>
              {words.length === 0 ? (
                <Text style={styles.emptyText}>Aún no hay palabras adivinadas</Text>
              ) : (
                <View style={styles.list}>
                  {words.slice(0, 10).map((word, index) => (
                    <View key={word.word} style={styles.listItem}>
                      <Text style={styles.icon}>{getIcon(index)}</Text>
                      <Text style={styles.wordText}>{word.word}</Text>
                      <Text style={styles.score}>{word.totalguesses} 🔠</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  section: {
    backgroundColor: '#4C1D95',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  list: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  icon: {
    width: 30,
    fontSize: 16,
    textAlign: 'center',
  },
  playerName: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  wordText: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  score: {
    color: 'white',
    fontSize: 14,
    minWidth: 50,
    textAlign: 'right',
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    padding: 16,
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    padding: 16,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default GlobalTops;
