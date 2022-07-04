import React from 'react';
import { getAuth } from 'firebase/auth';
import {
  AuthProvider,
  FirebaseAppProvider,
  SuspenseWithPerf,
  useFirebaseApp,
} from 'reactfire';
import { Children } from '../types';
import { FirebaseOptions } from 'firebase/app';

const firebaseConfig: FirebaseOptions = JSON.parse(
  process.env.REACT_APP_FIREBASE_CONFIG ?? '',
);

const FirebaseProviderLocal = ({ children }: Children) => {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense>
      <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<></>}>
        <AuthProviderLocal>{children}</AuthProviderLocal>
      </SuspenseWithPerf>
    </FirebaseAppProvider>
  );
};

const AuthProviderLocal = ({ children }: Children) => {
  const app = useFirebaseApp();
  const auth = getAuth(app);

  return <AuthProvider sdk={auth}>{children}</AuthProvider>;
};

export default FirebaseProviderLocal;
