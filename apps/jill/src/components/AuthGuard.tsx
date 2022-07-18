import { useNavigate } from 'react-router-dom';
import { useSigninCheck } from 'reactfire';

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const { data, status } = useSigninCheck();
  const navigate = useNavigate();

  if (status === 'loading') {
    return <></>;
  }

  if (!data?.signedIn) {
    navigate('/sign-in');
    return <></>;
  }

  return children as JSX.Element;
};

export default AuthGuard;
