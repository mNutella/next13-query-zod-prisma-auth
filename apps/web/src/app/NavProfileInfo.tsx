'use client';

import Link from 'next/link';

import { PAGE_ROUTES } from '../core/config/constants';
import useUser from '../lib/users/hooks/useUser';

export default function NavProfileInfo() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <li>
      <Link role="listitem" href={PAGE_ROUTES.profile}>
        <div className="flex items-center ">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-400">
            <p className="m-auto text-white bold">
              {user.name[0].toUpperCase()}
            </p>
          </div>
          <p className="ml-4 text-gray-700 bold whitespace-nowrap">
            {user?.name + ' ' + user?.surname}
          </p>
        </div>
      </Link>
    </li>
  );
}
