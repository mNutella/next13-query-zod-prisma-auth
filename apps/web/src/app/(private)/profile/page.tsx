'use client';

import useUser from '../../../lib/users/hooks/useUser';

export default function Profile() {
  const { user } = useUser();

  return (
    <section>
      <h1 className="text-2xl">User Profile</h1>
      <p className="text-lg">{JSON.stringify(user, null, 2)}</p>
    </section>
  );
}
