import { LogLevel, OpenIdConfiguration } from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment';

export function getAuthConfig(): OpenIdConfiguration {
  return {
    configId: '0-angular-keycloak',
    clientId: environment.keycloak.clientId,
    authority: environment.keycloak.authority,
    redirectUrl: environment.keycloak.redirectUrl,
    postLogoutRedirectUri: environment.keycloak.postLogoutRedirectUri,
    scope: 'openid profile email offline_access',
    responseType: 'code',

    silentRenew: true,
    useRefreshToken: true,
    renewTimeBeforeTokenExpiresInSeconds: 30,
    silentRenewTimeoutInSeconds: 20,

    ignoreNonceAfterRefresh: true,
    logLevel: LogLevel.Debug,
    autoUserInfo: true,

    triggerAuthorizationResultEvent: true,
    autoCleanStateAfterAuthentication: true,
  };
}
