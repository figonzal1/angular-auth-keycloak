export const environment = {
  production: false,
  keycloak: {
    authority: 'http://localhost:8080/realms/angular-auth-realm',
    clientId: 'angular-client',
    redirectUrl: 'http://localhost:4200/callback',
    postLogoutRedirectUri: 'http://localhost:4200',
  },
  apiUrl: 'http://localhost:3000/api',
};
