'use client';

import { useEffect, useState } from 'react';

import useSessionStorage from '@core/hooks/useSessionStorage';
import useJWT from '@core/hooks/useJWT';
import { JWTUser } from '@core/types';

type UserData = {
  user?: JWTUser;
  isLoggedIn: boolean;
  error: boolean;
};
type UseUserReturn = UserData;

export default function useUser(): UseUserReturn {
  const [accessToken] = useSessionStorage('accessToken', null);
  const jwtData = useJWT(accessToken);
  const [data, setData] = useState<UserData>({
    user: undefined,
    isLoggedIn: false,
    error: !accessToken,
  });

  useEffect(() => {
    if (jwtData) {
      setData({
        user: jwtData?.payload?.user,
        isLoggedIn: !!jwtData?.payload?.user,
        error: !accessToken,
      });
    }
  }, [jwtData]);

  return data;
}
