# 🎮 Wordle Full-Stack Challenge

Aplicación completa de Wordle con backend en NestJS, frontend web en React y aplicación móvil en React Native con Expo.

---

## 📋 Descripción del Proyecto

Este es un juego de Wordle completo donde los usuarios pueden:
- Registrarse y autenticarse con JWT
- Jugar partidas de Wordle con palabras de 5 letras
- Ver estadísticas personales (partidas jugadas, ganadas, palabras adivinadas)
- Consultar rankings globales de mejores jugadores
- Ver las palabras más adivinadas por todos los usuarios

El sistema asigna palabras aleatorias que el usuario no ha ganado previamente, y cada usuario tiene 5 intentos por partida.

---

## 🏗️ Arquitectura del Proyecto

```
Full-Stack-Challenge/
├── backend/              # API REST con NestJS
├── frontend-web/         # Aplicación web con React + Vite
├── frontend-movil/       # Aplicación móvil con React Native + Expo
└── README.md            # Este archivo
```

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **NestJS** - Framework de Node.js
- **TypeORM** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación con tokens
- **Bcrypt** - Encriptación de contraseñas
- **Passport** - Estrategias de autenticación
- **Class Validator** - Validación de DTOs

### Frontend Web
- **React 19** - Librería de UI
- **Vite** - Build tool y dev server
- **TypeScript** - Tipado estático
- **React Router DOM** - Navegación
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **React Toastify** - Notificaciones

### Frontend Móvil
- **React Native** - Framework móvil
- **Expo** - Plataforma de desarrollo
- **TypeScript** - Tipado estático
- **React Navigation** - Navegación
- **Axios** - Cliente HTTP
- **AsyncStorage** - Almacenamiento local
- **React Native Animatable** - Animaciones

---

## 🗄️ Base de Datos

### Configuración de PostgreSQL

El proyecto utiliza **PostgreSQL** como base de datos. La configuración está hardcodeada en [`backend/src/app.module.ts`](backend/src/app.module.ts:16):

```
Host: localhost
Puerto: 5432
Usuario: postgres
Contraseña: root
Base de datos: wordle_db
```

### Entidades

El sistema cuenta con 5 entidades principales:

1. **User** - Usuarios del sistema
   - id, username, password (hasheado)
   - totalGames, totalWins

2. **Word** - Palabras disponibles para jugar
   - id, word (5 letras), used

3. **Game** - Partidas jugadas
   - id, userId, wordId, completed, won
   - Relación con attempts

4. **Attempt** - Intentos de cada partida
   - id, gameId, word, result (feedback)

5. **Win** - Registro de palabras ganadas por usuario
   - id, userId, wordId, wonAt

### Sincronización Automática

TypeORM está configurado con `synchronize: true`, lo que significa que **las tablas se crean automáticamente** al iniciar el backend. No necesitas ejecutar migraciones manualmente.

---

## ⚙️ Variables de Entorno

### Backend

**NO tiene archivo `.env`**. La configuración está directamente en el código:

- Base de datos: Configurada en [`app.module.ts`](backend/src/app.module.ts:16)
- Puerto: 3000 (definido en [`main.ts`](backend/src/main.ts:22))
- JWT Secret: Configurado en [`auth.module.ts`](backend/src/auth/auth.module.ts)


**IMPORTANTE para Expo**: Si vas a probar en un dispositivo físico, debes cambiar `localhost` por la **IP de tu red local** (ejemplo: `http://192.168.1.100:3000`).

---

## 🚀 Cómo Ejecutar el Proyecto

### Prerrequisitos

1. **Node.js** (v18 o superior)
2. **PostgreSQL** instalado y corriendo
3. **npm** o **yarn**
4. Para móvil: **Expo Go** app en tu dispositivo (opcional)

### 1. Configurar la Base de Datos

Crea la base de datos en PostgreSQL:

```sql
CREATE DATABASE wordle_db;
```

Asegúrate de que PostgreSQL esté corriendo con:
- Usuario: `postgres`
- Contraseña: `root`
- Puerto: `5432`

Si tu configuración es diferente, modifica [`backend/src/app.module.ts`](backend/src/app.module.ts:16).

### 2. Ejecutar el Backend

```bash
cd backend
npm install
npm run start:dev
```

### 3. Ejecutar el Frontend Web

```bash
cd frontend-web
npm install
npm run dev
```

### 4. Ejecutar el Frontend Móvil

```bash
cd frontend-movil
npm install
npm start
```

Opciones disponibles:
- `npm run android` - Abrir en emulador Android
- `npm run ios` - Abrir en simulador iOS (solo Mac)
- `npm run web` - Abrir en navegador
- Escanear QR con **Expo Go** app

**IMPORTANTE**: Si usas un dispositivo físico, cambia la URL en [`frontend-movil/src/services/api.ts`](frontend-movil/src/services/api.ts:6) a tu IP local.

---

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión (devuelve JWT)
- `GET /api/auth/users` - Listar todos los usuarios

### Juego
- `POST /api/games/start` - Iniciar nueva partida
- `POST /api/games/attempt` - Enviar intento de palabra

### Estadísticas
- `GET /api/stats/games` - Estadísticas del usuario actual
- `GET /api/stats/wins` - Victorias del usuario
- `GET /api/stats/top-users` - Top 10 jugadores
- `GET /api/stats/popular-words` - Palabras más adivinadas

### Palabras
- `POST /api/words` - Agregar nueva palabra (5 letras)
- `GET /api/words` - Listar todas las palabras

---

## 🎯 Funcionalidades Principales

### Sistema de Juego
- Palabras de exactamente 5 letras
- 5 intentos por partida
- Feedback visual:
  - **Verde (1)**: Letra correcta en posición correcta
  - **Amarillo (2)**: Letra correcta en posición incorrecta
  - **Gris (3)**: Letra no está en la palabra

### Sistema de Usuarios
- Registro con username único
- Contraseñas encriptadas con bcrypt
- Autenticación JWT con guards
- Sesión persistente en móvil con AsyncStorage

### Estadísticas
- Partidas totales jugadas
- Partidas ganadas
- Porcentaje de victorias
- Palabras adivinadas vs disponibles
- Rankings globales

### Lógica de Palabras
- El sistema asigna palabras que el usuario NO ha ganado
- Si el usuario ganó todas las palabras, recibe un mensaje especial
- Las palabras se seleccionan aleatoriamente

---

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- JWT para autenticación stateless
- Guards de Passport para proteger rutas
- Validación de DTOs con class-validator
- CORS habilitado para desarrollo

---

## 📱 Diferencias entre Plataformas

### Web
- Navegación con React Router
- Notificaciones con React Toastify
- Animaciones con Framer Motion
- Estilos con Tailwind CSS

### Móvil
- Navegación con React Navigation Stack
- Notificaciones con Toast Message
- Animaciones con React Native Animatable
- Estilos con StyleSheet nativo
- Almacenamiento con AsyncStorage

---

## 🐛 Troubleshooting

### Backend no inicia
- Verifica que PostgreSQL esté corriendo
- Confirma que la base de datos `wordle_db` existe
- Revisa usuario/contraseña en [`app.module.ts`](backend/src/app.module.ts:16)

### Frontend móvil no conecta
- Cambia `localhost` por tu IP local en [`api.ts`](frontend-movil/src/services/api.ts:6)
- Asegúrate de estar en la misma red WiFi
- Verifica que el backend esté corriendo

### Error de CORS
- El backend tiene CORS habilitado con `origin: true`
- Si persiste, verifica la configuración en [`main.ts`](backend/src/main.ts:8)

---

## 📝 Notas Adicionales

- El proyecto NO usa variables de entorno, todo está hardcodeado
- TypeORM sincroniza automáticamente las tablas (no usar en producción)
- Los logs de consola muestran la palabra correcta en el backend
- El juego permite 5 intentos por partida
- Las palabras deben ser exactamente de 5 letras

---

## 👨‍💻 Desarrollo

### Scripts Disponibles

**Backend:**
- `npm run start:dev` - Modo desarrollo con hot reload
- `npm run build` - Compilar para producción
- `npm run start:prod` - Ejecutar en producción
- `npm run test` - Ejecutar tests

**Frontend Web:**
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build

**Frontend Móvil:**
- `npm start` - Iniciar Expo
- `npm run android` - Abrir en Android
- `npm run ios` - Abrir en iOS
- `npm run web` - Abrir en web

---

## 🎮 ¡A Jugar!

1. Inicia PostgreSQL
2. Corre el backend
3. Corre el frontend que prefieras (web o móvil)
4. Regístrate y empieza a adivinar palabras

**¡Buena suerte adivinando las palabras!** 🎯
