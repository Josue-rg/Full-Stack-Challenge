import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';

interface User {
  id: string;
  username: string;
}

const ScreenRegister = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const { register } = useAuth();

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
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      console.error('Completa todos los campos');
      return;
    }

    if (username.length < 3) {
      console.error('El username debe tener al menos 3 caracteres');
      return;
    }

    if (password.length < 4) {
      console.error('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    const userExists = users.find(user => 
      user.username.toLowerCase() === username.toLowerCase()
    );
    
    if (userExists) {
      console.error('El nombre de usuario ya está en uso');
      return;
    }
    
    try {
      await register(username, password);
      console.log('¡Cuenta creada exitosamente!');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } catch {
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear una cuenta</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Registrarse" onPress={handleSubmit} />
      <Text style={styles.registerText}>
        ¿Ya tienes una cuenta? Inicia sesión
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
});

export default ScreenRegister;
