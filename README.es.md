# Angular Authentication with Keycloak Template

**[English](README.md)** | **Español**

Template de autenticación para aplicaciones Angular usando Keycloak como proveedor de identidad OIDC (OpenID Connect). Este proyecto está listo para usar y puede servir como base para implementar autenticación segura en tus aplicaciones Angular.

## Características

- Autenticación OIDC completa con Keycloak
- Renovación automática de tokens (silent renew)
- Guards para protección de rutas
- Interceptor HTTP para agregar tokens automáticamente
- Logout con revocación de tokens
- Configuración de entornos (desarrollo, producción)
- Docker Compose para Keycloak y PostgreSQL
- TailwindCSS para estilos
- ESLint + Prettier para calidad de código
- Vitest para testing

## Vista Previa de la Interfaz

### Página de Login
![Interfaz de Login](./media/login.png)

### Dashboard
![Interfaz del Dashboard](./media/dashboard.png)

## Requisitos Previos

- Node.js 18+ y pnpm
- Docker y Docker Compose
- Angular CLI 21+

## Instalación

### 1. Clonar e instalar dependencias

```bash
git clone <repository-url>
cd angular-auth-keycloack
pnpm install
```

### 2. Levantar Keycloak con Docker

```bash
docker-compose up -d
```

Esto iniciará:
- Keycloak en `http://localhost:8080`
- PostgreSQL en `localhost:5432`

Credenciales de administrador de Keycloak:
- Usuario: `admin`
- Contraseña: `admin`

### 3. Configurar Keycloak

#### a) Acceder a la consola de administración

1. Ir a `http://localhost:8080`
2. Hacer clic en "Administration Console"
3. Login con admin/admin

#### b) Crear el Realm

1. En el menú superior izquierdo, hacer clic en "Create realm"
2. Nombre: `angular-auth-realm`
3. Hacer clic en "Create"

#### c) Crear el Cliente

1. Ir a "Clients" en el menú lateral
2. Hacer clic en "Create client"
3. Configurar:
   - **Client type**: OpenID Connect
   - **Client ID**: `angular-client`
4. Hacer clic en "Next"
5. Configurar:
   - **Client authentication**: OFF
   - **Authorization**: OFF
   - **Authentication flow**: Marcar "Standard flow" y "Direct access grants"
6. Hacer clic en "Next"
7. Configurar URLs:
   - **Root URL**: `http://localhost:4200`
   - **Home URL**: `http://localhost:4200`
   - **Valid redirect URIs**: `http://localhost:4200/*`
   - **Valid post logout redirect URIs**: `http://localhost:4200/*`
   - **Web origins**: `http://localhost:4200`
8. Hacer clic en "Save"

#### d) Configurar Client Scopes (Avanzado)

1. En el cliente `angular-client`, ir a la pestaña "Client scopes"
2. Asegurarse de que estén asignados:
   - `openid`
   - `profile`
   - `email`
   - `offline_access` (para refresh tokens)

#### e) Crear un usuario de prueba

1. Ir a "Users" en el menú lateral
2. Hacer clic en "Create new user"
3. Configurar:
   - **Username**: `testuser`
   - **Email**: `test@example.com`
   - **Email verified**: ON
   - **First name**: Test
   - **Last name**: User
4. Hacer clic en "Create"
5. Ir a la pestaña "Credentials"
6. Hacer clic en "Set password"
7. Establecer contraseña: `test123`
8. Desmarcar "Temporary"
9. Hacer clic en "Save"

### 4. Iniciar la aplicación Angular

```bash
pnpm start
```

La aplicación estará disponible en `http://localhost:4200`

## Estructura del Proyecto

```
angular-auth-keycloack/
├── src/
│   ├── app/
│   │   ├── auth/                      # Módulo de autenticación
│   │   │   ├── auth.config.ts         # Configuración OIDC
│   │   │   ├── auth.guard.ts          # Guard para rutas protegidas
│   │   │   ├── auth.interceptor.ts    # Interceptor para agregar tokens
│   │   │   └── auth.service.ts        # Servicio de autenticación
│   │   ├── components/
│   │   │   ├── callback/              # Componente callback de OIDC
│   │   │   ├── dashboard/             # Página protegida (ejemplo)
│   │   │   └── login/                 # Página de login
│   │   ├── app.config.ts              # Configuración principal de la app
│   │   ├── app.routes.ts              # Definición de rutas
│   │   ├── app.ts                     # Componente raíz
│   │   └── app.html                   # Template raíz
│   ├── environments/                  # Variables de entorno
│   │   ├── environment.ts             # Env por defecto
│   │   ├── environment.development.ts # Env desarrollo
│   │   └── environment.production.ts  # Env producción
│   ├── main.ts                        # Punto de entrada
│   └── index.html                     # HTML principal
├── keycloak/                          # Capturas de pantalla de configuración
├── docker-compose.yml                 # Configuración de Docker
├── package.json                       # Dependencias y scripts
├── angular.json                       # Configuración de Angular
├── tsconfig.json                      # Configuración de TypeScript
└── tailwind.config.js                 # Configuración de TailwindCSS
```

## Configuración de Entornos

### Desarrollo (`src/environments/environment.development.ts`)

```typescript
export const environment = {
  production: false,
  keycloak: {
    clientId: 'angular-client',
    authority: 'http://localhost:8080/realms/angular-auth-realm',
    redirectUrl: 'http://localhost:4200/callback',
    postLogoutRedirectUri: 'http://localhost:4200',
  },
  apiUrl: 'http://localhost:3000/api',
};
```

### Producción (`src/environments/environment.production.ts`)

Actualizar con las URLs de producción:

```typescript
export const environment = {
  production: true,
  keycloak: {
    clientId: 'angular-client',
    authority: 'https://tu-keycloak.com/realms/angular-auth-realm',
    redirectUrl: 'https://tu-app.com/callback',
    postLogoutRedirectUri: 'https://tu-app.com',
  },
  apiUrl: 'https://tu-api.com/api',
};
```

## Scripts Disponibles

```bash
# Desarrollo
pnpm start              # Inicia el servidor de desarrollo en http://localhost:4200

# Build
pnpm build              # Build de producción
pnpm watch              # Build en modo watch

# Testing
pnpm test               # Ejecuta tests con Vitest

# Linting y formateo
pnpm lint               # Ejecuta ESLint
pnpm format             # Formatea código con Prettier
```

## Flujo de Autenticación

1. **Usuario no autenticado** accede a la aplicación
2. Es redirigido a `/login`
3. Al hacer clic en "Login", se inicia el flujo OIDC:
   - Redirección a Keycloak
   - Usuario ingresa credenciales
   - Keycloak valida y redirige a `/callback` con código de autorización
4. **CallbackComponent** procesa el código y obtiene tokens
5. Usuario es redirigido al dashboard
6. **AuthGuard** protege rutas que requieren autenticación
7. **AuthInterceptor** agrega automáticamente el token a las peticiones HTTP
8. Los tokens se renuevan automáticamente antes de expirar (silent renew)

## Arquitectura de Autenticación

El proyecto usa una **arquitectura en capas** para la autenticación:

```
Componentes (Login, Dashboard, etc.)
         ↓
   AuthService (Abstracción)
         ↓
OidcSecurityService (angular-auth-oidc-client)
         ↓
     Keycloak
```

**¿Por qué usar `AuthService` en lugar de `OidcSecurityService` directamente?**

- **Abstracción**: Si cambias de librería OIDC, solo modificas `AuthService`
- **Consistencia**: Todos los componentes usan la misma interfaz
- **Mantenibilidad**: Lógica centralizada en un solo lugar
- **Testing**: Más fácil hacer mocks del `AuthService`

## Uso del AuthService

El proyecto ya usa `AuthService` consistentemente en todos los componentes. Ejemplos:

### Login Component (src/app/components/login/login.component.ts:28)

```typescript
import { AuthService } from '../../auth/auth.service';

export class LoginComponent {
  private authService = inject(AuthService);

  login() {
    this.authService.login(); // Inicia flujo OIDC
  }
}
```

### Dashboard Component (src/app/components/dashboard/dashboard.component.ts:30)

```typescript
import { AuthService } from '../../auth/auth.service';

export class DashboardComponent {
  private authService = inject(AuthService);

  userData$ = this.authService.getUserData$();
  accessToken$ = this.authService.getAccessToken$();

  logout() {
    this.authService.logout(); // Cierra sesión y revoca tokens
  }
}
```

### Callback Component (src/app/components/callback/callback.component.ts:28)

```typescript
import { AuthService } from '../../auth/auth.service';

export class CallbackComponent {
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.checkAuth().subscribe(result => {
      if (result.isAuthenticated) {
        // Redirigir al dashboard
      }
    });
  }
}
```

### Métodos disponibles en AuthService

```typescript
// Iniciar login
authService.login(): void

// Cerrar sesión y revocar tokens
authService.logout(): void

// Verificar autenticación
authService.checkAuth(): Observable<LoginResponse>
authService.isAuthenticated(): Observable<boolean>

// Obtener datos del usuario
authService.getUserData$(): Observable<UserDataResult>

// Obtener tokens
authService.getAccessToken$(): Observable<string>
authService.getIdToken$(): Observable<string>
```

## Protección de Rutas

El proyecto incluye un ejemplo de ruta protegida en `src/app/app.routes.ts:11`:

```typescript
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'callback', component: CallbackComponent },
  {
    path: 'dashboard',              // Ruta protegida del proyecto
    component: DashboardComponent,
    canActivate: [authGuard],       // Guard que verifica autenticación
  },
];
```

El `authGuard` verifica que el usuario esté autenticado. Si no lo está, redirige automáticamente a `/login`.

**Para agregar más rutas protegidas**, simplemente agrega `canActivate: [authGuard]`:

```typescript
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard],  // Nueva ruta protegida
}
```

## Interceptor HTTP y Tokens

### ¿Qué token se envía a la API?

El `AuthInterceptor` (configurado en `src/app/auth/auth.interceptor.ts:6`) agrega automáticamente el **Access Token JWT de Keycloak** a todas las peticiones HTTP:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const oidcSecurityService = inject(OidcSecurityService);

  return oidcSecurityService.getAccessToken().pipe(
    switchMap((token) => {
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,  // Token JWT de Keycloak
          },
        });
      }
      return next(req);
    }),
  );
};
```

### Contenido del Token JWT

El token que se envía contiene información del usuario y la autenticación:

```json
{
  "exp": 1738675200,
  "iat": 1738671600,
  "iss": "http://localhost:8080/realms/angular-auth-realm",
  "sub": "user-uuid",
  "preferred_username": "testuser",
  "email": "test@example.com",
  "given_name": "Test",
  "family_name": "User",
  "scope": "openid profile email"
}
```

### Validación en tu API Backend

Tu API backend debe **validar este token JWT** contra Keycloak. Ejemplos:

#### Node.js/Express

```bash
npm install express-jwt jwks-rsa
```

```javascript
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Validación automática del token
app.use(jwt({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: 'http://localhost:8080/realms/angular-auth-realm/protocol/openid-connect/certs'
  }),
  audience: 'angular-client',
  issuer: 'http://localhost:8080/realms/angular-auth-realm',
  algorithms: ['RS256']
}));

// Ruta protegida
app.get('/api/protected', (req, res) => {
  // req.user contiene los datos del token
  res.json({ message: 'Autenticado', user: req.user });
});
```

#### Spring Boot (Java)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
```

```yaml
# application.yml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8080/realms/angular-auth-realm
```

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());
        return http.build();
    }
}
```

#### .NET/C#

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "http://localhost:8080/realms/angular-auth-realm";
        options.Audience = "angular-client";
        options.RequireHttpsMetadata = false; // Solo para desarrollo
    });

// Ruta protegida
[Authorize]
[ApiController]
public class ProtectedController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        var username = User.Identity.Name;
        return Ok(new { message = "Autenticado", username });
    }
}
```

### Configuración actual del interceptor

El interceptor está configurado en `src/app/app.config.ts`:

```typescript
provideHttpClient(
  withInterceptors([authInterceptor])
)
```

**IMPORTANTE**: El interceptor agrega el token a **todas las peticiones HTTP**. Si haces peticiones a APIs externas que no deberían tener el token, modifica el interceptor:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const oidcSecurityService = inject(OidcSecurityService);

  // Solo agregar token a peticiones de tu API
  const isApiRequest = req.url.startsWith(environment.apiUrl);

  if (!isApiRequest) {
    return next(req); // No agregar token a URLs externas
  }

  return oidcSecurityService.getAccessToken().pipe(
    switchMap((token) => {
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      return next(req);
    }),
  );
};
```

## Personalización

### Cambiar nombre del realm

1. Actualizar en Keycloak
2. Actualizar en `src/environments/environment.development.ts`:
   ```typescript
   authority: 'http://localhost:8080/realms/TU-REALM'
   ```

### Cambiar nombre del cliente

1. Actualizar en Keycloak
2. Actualizar en `src/environments/environment.development.ts`:
   ```typescript
   clientId: 'tu-cliente-id'
   ```

### Agregar más scopes

En `src/app/auth/auth.config.ts`:
```typescript
scope: 'openid profile email offline_access roles'
```

## Solución de Problemas

### Error: "Invalid redirect_uri"

Verificar que la URL de callback esté configurada correctamente en:
- Keycloak: Valid redirect URIs
- `environment.ts`: redirectUrl

### Error: "Client not found"

Verificar que el `clientId` en `environment.ts` coincida exactamente con el Client ID en Keycloak.

### Tokens no se renuevan

Verificar que:
- El scope `offline_access` esté incluido
- `useRefreshToken: true` esté en `auth.config.ts`
- El cliente tenga habilitado "Standard flow"

### No redirige después del login

Verificar que:
- La ruta `/callback` esté configurada
- El componente CallbackComponent esté importado

## Stack Tecnológico

- **Angular 21.1.2**: Framework principal
- **angular-auth-oidc-client 21.0.1**: Librería para OIDC
- **Keycloak 26.5.2**: Proveedor de identidad
- **TailwindCSS 4.1.18**: Framework de estilos
- **Vitest 4.0.18**: Testing
- **ESLint + Prettier**: Calidad de código
- **Docker + Docker Compose**: Containerización

## Siguientes Pasos

- [ ] Configurar roles y permisos en Keycloak
- [ ] Implementar autorización basada en roles
- [ ] Agregar refresh token rotation
- [ ] Configurar 2FA/MFA
- [ ] Implementar backend API protegido
- [ ] Configurar HTTPS para producción
- [ ] Agregar tests e2e

## Recursos Útiles

- [Documentación de Keycloak](https://www.keycloak.org/documentation)
- [angular-auth-oidc-client](https://github.com/damienbod/angular-auth-oidc-client)
- [OIDC Specification](https://openid.net/connect/)
- [Capturas de configuración](./keycloak/)

## Licencia

MIT

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.
