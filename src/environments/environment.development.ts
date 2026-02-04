export const environment = {
  production: false,
  keycloak: {
    clientId: 'angular-client',
    authority: 'http://localhost:8080/realms/angular-auth-realm',
    redirectUrl: 'http://localhost:4200/callback',
    postLogoutRedirectUri: 'http://localhost:4200/login',
  },
  apiUrl: 'http://localhost:3000/api',
};
