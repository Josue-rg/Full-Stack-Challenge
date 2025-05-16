import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import WordleGame from '../components/WordleGame';
import GlobalTops from '../components/GlobalTops';
import UserStats from '../components/UserStats';
import { UpdateProvider } from '../context/UpdateContext';

const ScreenHome = () => {
  const { logout } = useAuth();
  const [showTops, setShowTops] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowTops(true)}
        >
          <Text style={styles.iconText}>🏆</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>WORDLE</Text>
        
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowStats(true)}
        >
          <Text style={styles.iconText}>👑</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <UpdateProvider>
          <WordleGame />
          <GlobalTops visible={showTops} onClose={() => setShowTops(false)} />
          <UserStats visible={showStats} onClose={() => setShowStats(false)} />
        </UpdateProvider>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C1D95',
  },
  navbar: {
    backgroundColor: '#4C1D95',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C084FC',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    marginTop: 34,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#4C1D95',
  },
  iconButton: {
    padding: 10,
  },
  iconText: {
    fontSize: 24,
  },
  logoutButton: {
    backgroundColor: '#4C1D95',
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 100,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ScreenHome;
