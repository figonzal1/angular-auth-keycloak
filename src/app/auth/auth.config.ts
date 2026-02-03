import { OpenIdConfiguration } from 'angular-auth-oidc-client';

export function getAuthConfig(): OpenIdConfiguration {
  return {
    authority: 'http://localhost:8080/realms/YOUR_REALM', // Cambia con tu URL y realm de Keycloak
    clientId: 'YOUR_CLIENT_ID', // Cambia con tu Client ID
    responseType: 'code',
    scope: 'openid profile email',
    redirectUrl: window.location.origin + '/callback',
    postLogoutRedirectUri: window.location.origin,
    autoUserInfo: false,
  };
}
