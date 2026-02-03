# Keycloak Docker Setup para Desarrollo

Este documento explica cómo configurar y ejecutar Keycloak con Docker Compose para desarrollo.

## Requisitos Previos

- Docker instalado ([descargar](https://www.docker.com/))
- Docker Compose instalado
- Puerto 8080 disponible (Keycloak)
- Puerto 5432 disponible (PostgreSQL)

## Inicio Rápido

### 1. Inicia los servicios

```bash
docker-compose up -d
```

Esto iniciará:
- **Keycloak**: `http://localhost:8080`
- **PostgreSQL**: `localhost:5432`

### 2. Accede a Keycloak

1. Abre tu navegador en `http://localhost:8080`
2. Haz clic en "Administration Console"
3. Inicia sesión con:
   - Usuario: `admin`
   - Contraseña: `admin`

### 3. Crea un Realm

1. En la esquina superior izquierda, haz clic en el dropdown "Master"
2. Haz clic en "Create Realm"
3. Ingresa el nombre (ej: `myrealm`)
4. Haz clic en "Create"

### 4. Crea un Cliente OAuth2

1. Ve a **Clients** en el menú izquierdo
2. Haz clic en "Create"
3. Ingresa el **Client ID** (ej: `angular-app`)
4. Haz clic en "Create"

### 5. Configura el Cliente

En la pestaña **Settings**:
- **Client Protocol**: `openid-connect`
- **Access Type**: `public`
- **Valid Redirect URIs**: Agrega:
  - `http://localhost:4200/callback`
  - `http://localhost:4200/*`
- **Web Origins**: `http://localhost:4200`
- Haz clic en "Save"

En la pestaña **Advanced Settings**:
- **Access Token Lifespan**: `5 minutes`
- **Refresh Token Lifespan**: `30 minutes`

### 6. Actualiza tu configuración Angular

Abre `src/app/auth/auth.config.ts` y reemplaza:

```typescript
authority: 'http://localhost:8080/realms/myrealm',
clientId: 'angular-app',
```

Con los valores que creaste en Keycloak.

### 7. Inicia la aplicación Angular

```bash
pnpm start
```

La aplicación estará en `http://localhost:4200`

## Comandos Docker

### Ver logs

```bash
docker-compose logs -f keycloak
```

### Detener servicios

```bash
docker-compose down
```

### Detener servicios y limpiar volúmenes

```bash
docker-compose down -v
```

### Reiniciar servicios

```bash
docker-compose restart
```

## Crear Usuarios en Keycloak

### Vía Admin Console:

1. Ve a **Users** en el menú izquierdo
2. Haz clic en "Add user"
3. Ingresa el username (ej: `testuser`)
4. Haz clic en "Create"
5. En la pestaña **Credentials**, establece una contraseña
6. Marca "Temporary" como OFF si quieres que sea permanente
7. Haz clic en "Set Password"

## Crear Roles (Opcional)

1. Ve a **Roles** en el menú izquierdo
2. Haz clic en "Create role"
3. Ingresa el nombre del rol (ej: `admin`, `user`)
4. Haz clic en "Create"

### Asignar Roles a Usuarios:

1. Ve a **Users**
2. Selecciona un usuario
3. En la pestaña **Role mappings**, selecciona el rol
4. Haz clic en "Assign"

## Test de Configuración

### Obtener el Discovery Document

```bash
curl http://localhost:8080/realms/myrealm/.well-known/openid-configuration
```

Deberías ver la configuración OIDC del realm.

## Troubleshooting

### Problema: "connection refused" en `http://localhost:8080`

**Solución**: Espera a que el contenedor de Keycloak esté listo. Puede tomar 30-60 segundos en la primera ejecución.

```bash
docker-compose logs keycloak
```

Busca el mensaje "Keycloak ... started" antes de intentar acceder.

### Problema: "Invalid redirect URI"

**Solución**: Asegúrate que la URL de tu aplicación Angular esté en "Valid Redirect URIs" en la configuración del cliente.

### Problema: Base de datos no se conecta

**Solución**: Verifica que PostgreSQL esté corriendo:

```bash
docker-compose logs postgres
```

### Problema: Permisos denegados en volúmenes

**Solución** (en Linux/Mac):

```bash
sudo chown -R 999:999 postgres_data
```

## Próximos Pasos

1. Implementar scopes adicionales (roles, perfiles)
2. Configurar proveedores de identidad (Google, GitHub, etc.)
3. Implementar políticas de acceso
4. Configurar mapeo de atributos personalizados
5. Implementar renovación automática de tokens

## Variables de Ambiente Personalizadas

Si necesitas cambiar credenciales, edita `docker-compose.yml`:

```yaml
environment:
  KEYCLOAK_ADMIN: tu_usuario
  KEYCLOAK_ADMIN_PASSWORD: tu_contraseña
  POSTGRES_PASSWORD: tu_contraseña_db
```

Luego reinicia:

```bash
docker-compose down -v
docker-compose up -d
```

## Recursos Útiles

- [Documentación oficial de Keycloak](https://www.keycloak.org/documentation)
- [Keycloak Docker Images](https://quay.io/repository/keycloak/keycloak)
- [OpenID Connect Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html)
- [Angular OIDC Client Library](https://github.com/damienbod/angular-auth-oidc-client)
