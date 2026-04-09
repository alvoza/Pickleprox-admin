import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
  ClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '',
};

const userPool = new CognitoUserPool(poolData);

const ADMIN_GROUPS = ['app_managers', 'court_owners', 'tournament_admins'];
const SUPER_ADMIN_GROUP = 'app_managers';

export async function signIn(email: string, password: string): Promise<CognitoUserSession> {
  return new Promise((resolve, reject) => {
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
      newPasswordRequired: () => {
        reject(new Error('Password change required. Please contact an administrator.'));
      },
    });
  });
}

export async function signOut(): Promise<void> {
  const currentUser = userPool.getCurrentUser();
  if (currentUser) {
    currentUser.signOut();
  }
}

export async function getAuthToken(): Promise<string | null> {
  return new Promise((resolve) => {
    const currentUser = userPool.getCurrentUser();
    if (!currentUser) {
      resolve(null);
      return;
    }
    currentUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session?.isValid()) {
        resolve(null);
        return;
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

export async function getCurrentSession(): Promise<CognitoUserSession | null> {
  return new Promise((resolve) => {
    const currentUser = userPool.getCurrentUser();
    if (!currentUser) {
      resolve(null);
      return;
    }
    currentUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session?.isValid()) {
        resolve(null);
        return;
      }
      resolve(session);
    });
  });
}

export function isAdmin(session: CognitoUserSession): boolean {
  const payload = session.getIdToken().decodePayload();
  const groups: string[] = payload['cognito:groups'] || [];
  return groups.some(g => ADMIN_GROUPS.includes(g));
}

export function isSuperAdmin(session: CognitoUserSession): boolean {
  const payload = session.getIdToken().decodePayload();
  const groups: string[] = payload['cognito:groups'] || [];
  return groups.includes(SUPER_ADMIN_GROUP);
}

export function getUserFromSession(session: CognitoUserSession) {
  const payload = session.getIdToken().decodePayload();
  return {
    userId: payload.sub as string,
    email: payload.email as string,
    name: (payload.name || payload.email) as string,
    groups: (payload['cognito:groups'] || []) as string[],
    isAdmin: isAdmin(session),
    isSuperAdmin: isSuperAdmin(session),
  };
}
