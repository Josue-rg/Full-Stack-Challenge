import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ScreenHome = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.title}>WORDLE</Text>
        <Button title="Cerrar sesión" onPress={handleLogout} color="#4c51bf" />
      </View>
      <View style={styles.content}>
        <View style={styles.card}><Text style={styles.cardText}>Juego de Wordle</Text></View>
        <View style={styles.card}><Text style={styles.cardText}>Estadísticas del Usuario</Text></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  navbar: {
    backgroundColor: '#6b46c1',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#6b46c1',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ScreenHome;
