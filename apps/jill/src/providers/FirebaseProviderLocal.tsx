import React from 'react';
import { getAuth } from 'firebase/auth';
import {
  AuthProvider,
  FirebaseAppProvider,
  SuspenseWithPerf,
  useFirebaseApp,
} from 'reactfire';
import { Children } from '../types';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASURMENT_ID1,
};

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
