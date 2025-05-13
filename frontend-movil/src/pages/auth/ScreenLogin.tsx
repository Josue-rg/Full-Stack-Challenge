import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface User {
  id: string;
  username: string;
}

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const { login } = useAuth();

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const usersData = await authService.getAllUsers();
        setUsers(usersData);
      } catch {
        setUsers([]);
      }
    };
    getAllUsers();
  }, []);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      console.error('Por favor, completa todos los campos');
      return;
    }

    const userExists = users.find(user => 
      user.username.toLowerCase() === username.toLowerCase()
    );
    
    if (!userExists) {
      console.error('El usuario no existe');
      return;
    }
    
    try {
      await login(username, password);
    } catch {
      console.error('Contraseña incorrecta');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Iniciar sesión" onPress={handleSubmit} />
      <Text style={styles.registerText}>
        ¿No tienes una cuenta? Regístrate
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#6b46c1',
  },
  title: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  registerText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});

export default LoginPage;
