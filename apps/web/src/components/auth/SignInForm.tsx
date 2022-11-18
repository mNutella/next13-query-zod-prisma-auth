'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  inputSignInSchema,
  InputSignIn,
  OutputSignIn,
} from '../../lib/auth/models/signIn';
import { API_ROUTES, PAGE_ROUTES } from '@core/config/constants';
import { pathToApiUrl } from '@core/utils/helpers';
import useSessionStorage from '@core/hooks/useSessionStorage';

async function login(credentials: InputSignIn): Promise<OutputSignIn> {
  const rawData = await fetch(pathToApiUrl(API_ROUTES.login), {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  return await rawData.json();
}

const defaultValues: InputSignIn = {
  username: '',
  password: '',
};

export default function LoginForm() {
  const router = useRouter();
  const [_, setAccessToken] = useSessionStorage<string>('accessToken', '');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputSignIn>({
    resolver: zodResolver(inputSignInSchema),
    defaultValues,
  });
  const onSubmit = handleSubmit(async (credentials) => {
    const { token } = await login(credentials);

    setAccessToken(token);
    router.push(PAGE_ROUTES.profile);
  });

  return (
    <form
      className="flex-col w-full gap-4 space-y-5 rounded-lg"
      onSubmit={onSubmit}
    >
      <h2 className="text-2xl">Sign In</h2>
      <div>
        <label htmlFor="username">Username</label>
        <input
          className={`ml-4 bg-gray-100 rounded border-2 ${
            errors?.username ? 'border-red-500' : 'border-blue-500'
          }`}
          {...register('username')}
        />
        {errors?.username && (
          <p role="alert" className="text-red-500">
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="username">Password</label>
        <input
          className={`ml-4 bg-gray-100 rounded border-2 ${
            errors?.password ? 'border-red-500' : 'border-blue-500'
          }`}
          type="password"
          {...register('password')}
        />
        {errors?.password && (
          <p role="alert" className="text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <button type="submit" className="p-2 text-white bg-blue-400 rounded">
        Login
      </button>
    </form>
  );
}
