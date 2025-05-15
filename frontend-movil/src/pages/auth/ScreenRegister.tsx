import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
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
      <View style={styles.formContainer}>
        <Text style={styles.title}>Crear una cuenta</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleSubmit}
        >
          <Text style={styles.loginButtonText}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.registerText}>
            ¿Ya tienes una cuenta? <Text style={styles.registerLink}>Inicia sesión</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C1D95',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#4',
    padding: 32,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#C084FC',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    color: 'black',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  loginButton: {
    backgroundColor: '#4C1D95',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#FBD5E0',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  registerLink: {
    textDecorationLine: 'underline',
  },
});

export default ScreenRegister;
