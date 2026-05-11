# Configuración de Backend con Neon PostgreSQL

## Arquitectura del Proyecto

Este backend está configurado para:
- ✅ **Desarrollo local**: Tu backend corre en tu máquina, pero se conecta a la BD en Neon (nube)
- ✅ **Producción**: El backend desplegado también usa la misma BD en Neon
- ✅ **Base de datos centralizada**: Todos los entornos usan la misma BD en Neon

## Configuración Rápida

### 1. Tener tu connection string de Neon

Ya tienes tu connection string en el `.env`:
```
DB_CONNECTION_STRING=postgresql://neondb_owner:npg_0YyVEMCO6qph@ep-crimson-salad-aqoyw52x-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. Trabajar en desarrollo local

```bash
# 1. Instala dependencias (si es la primera vez)
cd backend
npm install

# 2. Asegúrate de tener el archivo .env configurado (ya lo tienes)
# El puerto está configurado en 3001 para evitar conflictos

# 3. Inicia el backend en modo desarrollo
npm run start:dev
```

El backend estará disponible en: `http://localhost:3001`

### 3. Desplegar a producción

Cuando quieras desplegar:

1. **Cambia el NODE_ENV a production** en tu `.env`:
   ```
   NODE_ENV=production
   ```

2. **Cambia el JWT_SECRET** por uno seguro:
   ```
   JWT_SECRET=tu_clave_muy_segura_de_produccion
   ```

3. **Construye y prueba localmente**:
   ```bash
   npm run build
   npm run start:prod
   ```

4. **Sube los cambios a tu repositorio** (GitHub, etc.)

5. **Despliega en tu plataforma** (Vercel, Railway, Render, etc.)
   - Configura las variables de entorno en tu plataforma de despliegue
   - Asegúrate de incluir `DB_CONNECTION_STRING` y `JWT_SECRET`

## Variables de Entorno

| Variable | Descripción | Valor Actual |
|----------|-------------|--------------|
| `DB_CONNECTION_STRING` | Conexión a Neon PostgreSQL | ✅ Configurada |
| `JWT_SECRET` | Clave para JWT | ⚠️ ¡CÁMBIALA! |
| `PORT` | Puerto del servidor | 3001 |
| `NODE_ENV` | Entorno (development/production) | development |

## Flujo de Trabajo Recomendado

### Desarrollo diario:
```bash
# En tu terminal local
cd backend
npm run start:dev
# Tu backend usa la BD en Neon (nube)
```

### Antes de hacer deploy:
1. Cambia `NODE_ENV=production`
2. Cambia `JWT_SECRET` por una clave segura
3. Haz commit y push a tu repositorio
4. Despliega en tu plataforma

### Después del deploy:
- Tu backend en producción usará la MISMA BD en Neon
- Los datos persisten entre desarrollo y producción
- Puedes seguir desarrollando localmente sin afectar producción

## Solución de Problemas

### Error: Puerto 3000 ya en uso
El backend está configurado para usar el puerto **3001** por defecto. Si ves este error, es porque otra aplicación está usando el 3000. No debería pasar con la configuración actual.

### Error de conexión a Neon
- Verifica que tu connection string sea correcto
- Asegúrate de tener conexión a internet
- Revisa que tu proyecto Neon esté activo

### Error de SSL
La configuración ya incluye `sslmode=require` y `rejectUnauthorized: false`, lo cual es necesario para Neon.

### Tablas no existen
Con `synchronize: true`, TypeORM crea/actualiza las tablas automáticamente al iniciar. Si hay problemas:
1. Revisa que las entidades estén correctas
2. Reinicia el backend
3. Las tablas se crearán automáticamente

## Consideraciones de Seguridad

⚠️ **IMPORTANTE**:
- Nunca subas el archivo `.env` al repositorio (ya está en `.gitignore`)
- Usa siempre `.env.template` como referencia
- Cambia `JWT_SECRET` antes de producción
- Mantén tu connection string de Neon en secreto

## Recursos

- [Dashboard de Neon](https://console.neon.tech)
- [Documentación de NestJS](https://docs.nestjs.com)
- [Documentación de TypeORM](https://typeorm.io)

---

**Nota**: Esta configuración permite trabajar de forma ágil, con la BD en la nube accesible desde cualquier lugar, ideal para desarrollo y despliegue continuo.