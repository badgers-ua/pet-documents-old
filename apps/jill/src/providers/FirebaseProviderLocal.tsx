import { FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import {
  AuthProvider,
  FirebaseAppProvider,
  StorageProvider,
  SuspenseWithPerf,
  useFirebaseApp,
} from 'reactfire';
import { Children } from '../types';

const stringifiedFirebaseConfig = (
  process.env.REACT_APP_FIREBASE_CONFIG ?? ''
).toString();

const firebaseConfig: FirebaseOptions = JSON.parse(stringifiedFirebaseConfig);

const FirebaseProviderLocal = ({ children }: Children) => {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense>
      <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<></>}>
        <AuthProviderLocal>
          <StorageProviderLocal>{children}</StorageProviderLocal>
        </AuthProviderLocal>
      </SuspenseWithPerf>
    </FirebaseAppProvider>
  );
};

const AuthProviderLocal = ({ children }: Children) => {
  const app = useFirebaseApp();
  const auth = getAuth(app);

  return <AuthProvider sdk={auth}>{children}</AuthProvider>;
};

const StorageProviderLocal = ({ children }: Children) => {
  const app = useFirebaseApp();
  const storage = getStorage(app);

  return <StorageProvider sdk={storage}>{children}</StorageProvider>;
};

export default FirebaseProviderLocal;
