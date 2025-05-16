import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserStats } from '../services/api';
import { useUpdate } from '../context/UpdateContext';

interface UserStatsData {
  totalGames: number;
  totalWins: number;
}

const UserStats: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { updateCounter } = useUpdate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setError('No se encontró el token');
          setLoading(false);
          return;
        }

        const data = await getUserStats(token);
        setStats(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [updateCounter]);

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
          
          {loading ? (
            <ActivityIndicator size="large" color="#6b46c1" />
          ) : error ? (
            <View style={styles.section}>
              <Text style={styles.title}>Error</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : !stats ? (
            <View style={styles.section}>
              <Text style={styles.title}>Tus Estadísticas</Text>
              <View style={styles.statsContainer}>
                <View style={styles.listItem}>
                  <Text style={styles.statText}>Juegos jugados: <Text style={styles.boldText}>0</Text></Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.statText}>Victorias: <Text style={styles.boldText}>0</Text></Text>
                </View>
              </View>
              <Text style={styles.emptyText}>Aún no hay estadísticas</Text>
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.title}>Tus Estadísticas</Text>
              <View style={styles.statsContainer}>
                <View style={styles.listItem}>
                  <Text style={styles.statText}>
                    Juegos jugados: <Text style={styles.boldText}>{stats.totalGames}</Text>
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.statText}>
                    Victorias: <Text style={styles.boldText}>{stats.totalWins}</Text>
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  statsContainer: {
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  statText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    padding: 16,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
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

export default UserStats;
