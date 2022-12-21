import { Navigate, useSearchParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { CircularProgress, Stack } from '@mui/material';

export default function Oauth2RedirectHandler() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { register } = useAuth() as any;

  if (token) {
    register(token);
    return (
      <Stack
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Stack>
    );
  } else {
    return (
      <Navigate
        to={{
          pathname: '/account/login'
        }}
      />
    );
  }
}
