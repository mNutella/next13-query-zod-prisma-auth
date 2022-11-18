'use client';

import { PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';

import { PAGE_ROUTES } from '../../core/config/constants';
import useUser from '../../lib/users/hooks/useUser';

export default function AuthMainLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const { error } = useUser();

  if (error) {
    router.push(PAGE_ROUTES.profile);
  }

  return <div>{children}</div>;
}
