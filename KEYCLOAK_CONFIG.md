# Configuración de Keycloak con Angular

## Pasos para configurar Keycloak

### 1. Crear un nuevo Cliente en Keycloak

1. Accede a la consola de administración de Keycloak
2. Selecciona tu Realm
3. Ve a **Clients** → **Create**
4. Ingresa el **Client ID** (ej: `angular-app`)
5. Haz clic en **Save**

### 2. Configurar el Cliente

En la pestaña **Settings**:
- **Client Protocol**: `openid-connect`
- **Access Type**: `public` (si no necesitas client secret)
- **Valid Redirect URIs**:
  - `http://localhost:4200/login-callback`
  - `http://localhost:4200/*`
- **Web Origins**: `http://localhost:4200`

En la pestaña **Advanced Settings**:
- **Access Token Lifespan**: 5 minutes (o el que prefieras)
- **Refresh Token Lifespan**: 30 minutes

### 3. Obtener Configuration Discovery

Keycloak expone la configuración OIDC en:
```
http://localhost:8080/realms/YOUR_REALM/.well-known/openid-configuration
```

### 4. Actualizar el archivo `src/app/auth/auth.config.ts`

Reemplaza los valores en el archivo:

```typescript
authority: 'http://localhost:8080/realms/YOUR_REALM',
clientId: 'YOUR_CLIENT_ID',
```

**Valores a cambiar:**
- `YOUR_REALM`: Tu nombre de realm en Keycloak (ej: `master`, `myrealm`)
- `YOUR_CLIENT_ID`: El Client ID que creaste (ej: `angular-app`)
- La URL base de Keycloak si no es `http://localhost:8080`

### 5. Scopes

Por defecto están configurados:
- `openid`: Identificación del usuario
- `profile`: Información de perfil (name, picture, etc.)
- `email`: Email del usuario

Puedes agregar más scopes si los tienes configurados en Keycloak:
```typescript
scope: 'openid profile email roles',
```

## Estructura del Proyecto

```
src/app/
├── auth/
│   ├── auth.config.ts       # Configuración OIDC (EDITA ESTO)
│   ├── auth.service.ts      # Servicio de autenticación
│   ├── auth.interceptor.ts  # Interceptor para tokens
│   └── auth.guard.ts        # Guard para rutas protegidas
├── components/
│   ├── login/               # Componente de login
│   ├── login-callback/      # Manejo del callback de Keycloak
│   └── dashboard/           # Página protegida de ejemplo
├── app.ts                   # Componente raíz
├── app.routes.ts            # Rutas de la aplicación
└── app.config.ts            # Configuración de la app
```

## Rutas Disponibles

- `/login` - Página de login (pública)
- `/login-callback` - Callback de Keycloak (pública, usada internamente)
- `/dashboard` - Página protegida (requiere autenticación)

## Ejecución

```bash
pnpm install
pnpm start
```

Abre `http://localhost:4200` en tu navegador.

## Debugging

### Ver tokens en la consola del navegador

En `src/app/components/dashboard/dashboard.component.ts` verás el access token mostrado en la página.

### Obtener userData

El servicio `AuthService` proporciona acceso a:
- `getUserData()` - Datos del usuario desde el token ID
- `getAccessToken()` - Token de acceso
- `getIdToken()` - ID token
- `isAuthenticated$` - Observable del estado de autenticación

### Problemas comunes

1. **CORS Error**: Asegúrate de que Keycloak tiene la URL de tu app en `Web Origins`
2. **Callback no funciona**: Verifica que `redirectUrl` en `auth.config.ts` coincida con la URL configurada en Keycloak
3. **No se cargan los datos del usuario**: Asegúrate de que `autoUserInfo` está en `false` en la configuración (está así por defecto)

## Cliente Confidencial (con Client Secret)

Si tu cliente de Keycloak es **confidencial** (tiene Client Secret):

1. Cambio en `auth.config.ts`:
```typescript
responseType: 'code',
// Agregar:
useRefreshToken: true,
```

2. Necesitarás un backend para intercambiar el código por tokens (OAuth2 Code Exchange)

Para este ejemplo, usamos `public` client que es más simple para SPAs.

## Próximos Pasos

- Agregar más roles y permisos
- Implementar logout en todas las tabs del navegador
- Agregar refresh token handler
- Implementar scopes dinámicos
- Agregar logging y debugging
