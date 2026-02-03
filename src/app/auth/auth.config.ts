import { OpenIdConfiguration } from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment';

export function getAuthConfig(): OpenIdConfiguration {
  return {
    authority: environment.keycloak.authority,
    clientId: environment.keycloak.clientId,
    responseType: 'code',
    scope: 'openid profile email',
    redirectUrl: environment.keycloak.redirectUrl,
    postLogoutRedirectUri: environment.keycloak.postLogoutRedirectUri,
    autoUserInfo: false,
  };
}
