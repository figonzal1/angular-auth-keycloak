export const environment = {
  production: true,
  keycloak: {
    clientId: 'angular-client',
    authority: 'https://your-keycloak-domain.com/realms/angular-auth-realm',
    redirectUrl: 'https://your-app-domain.com/callback',
    postLogoutRedirectUri: 'https://your-app-domain.com/login',
  },
  apiUrl: 'https://your-api-domain.com/api',
};
