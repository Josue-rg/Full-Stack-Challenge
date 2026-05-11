# Backend - Wordle Challenge

Backend NestJS para el juego Wordle, configurado con base de datos PostgreSQL en Neon.

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- Conexión a internet (para conectarse a Neon)

### Instalación y Ejecución

```bash
# 1. Navega al directorio del backend
cd backend

# 2. Instala dependencias
npm install

# 3. Copia el archivo de entorno (si no existe)
cp .env.template .env

# 4. Edita .env y configura:
#    - DB_CONNECTION_STRING (tu connection string de Neon)
#    - JWT_SECRET (una clave segura)

# 5. Inicia el servidor de desarrollo
npm run start:dev
```

El servidor estará disponible en: **http://localhost:3001**

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev      # Inicia en modo desarrollo con watch

# Producción
npm run build          # Compila la aplicación
npm run start:prod     # Inicia en modo producción

# Calidad de código
npm run lint           # Ejecuta ESLint
npm run format         # Formatea con Prettier

# Tests
npm run test           # Ejecuta tests unitarios
npm run test:watch     # Tests en modo watch
npm run test:e2e       # Tests end-to-end
```

## 🗄️ Base de Datos

Este proyecto usa **Neon PostgreSQL** como base de datos. La BD está en la nube y es compartida entre desarrollo y producción.

### Configuración de Neon

1. Crea una cuenta en [neon.tech](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia el connection string
4. Pégalo en tu archivo `.env` como `DB_CONNECTION_STRING`

Lee [SETUP_NEON.md](./SETUP_NEON.md) para instrucciones detalladas.

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz del backend con:

```env
# Conexión a Neon PostgreSQL
DB_CONNECTION_STRING=postgresql://usuario:password@ep-xxx.region.aws.neon.tech/database?sslmode=require

# Clave secreta para JWT (¡cámbiala en producción!)
JWT_SECRET=tu_clave_secreta_muy_segura

# Puerto del servidor
PORT=3001

# Entorno (development/production)
NODE_ENV=development
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── auth/           # Autenticación y autorización
│   ├── entities/       # Entidades de TypeORM
│   ├── game/           # Módulo del juego
│   ├── stats/          # Módulo de estadísticas
│   ├── words/          # Módulo de palabras
│   ├── app.module.ts   # Módulo principal
│   └── main.ts         # Punto de entrada
├── test/               # Tests
├── .env                # Variables de entorno (NO subir al repo)
├── .env.template       # Plantilla de variables
└── package.json
```

## 🔐 Seguridad

- **Nunca** subas el archivo `.env` al repositorio
- Cambia `JWT_SECRET` antes de producción
- Usa HTTPS en producción
- Mantén tu connection string de Neon en secreto

## 🚨 Solución de Problemas

### Puerto ya en uso
Si ves `EADDRINUSE: address already in use :::3000`, el puerto 3000 está ocupado. Este proyecto usa el puerto **3001** por defecto.

### Error de conexión a BD
- Verifica tu connection string de Neon
- Asegúrate de tener conexión a internet
- Revisa que tu proyecto Neon esté activo

### Error de SSL
La configuración ya incluye SSL para Neon. No debería haber problemas.

## 📚 Recursos Adicionales

- [Documentación de NestJS](https://docs.nestjs.com)
- [Documentación de TypeORM](https://typeorm.io)
- [Documentación de Neon](https://neon.tech/docs)
- [SETUP_NEON.md](./SETUP_NEON.md) - Guía detallada de configuración

## 🤝 Contribución

1. Crea una rama para tu feature
2. Haz commit de tus cambios
3. Haz push a la rama
4. Crea un Pull Request

## 📄 Licencia

Este proyecto es privado y propietario.

---

**Nota**: Para desarrollo local, el backend se conecta a la BD en Neon (nube). No se requiere PostgreSQL local.