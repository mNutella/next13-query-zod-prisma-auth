'use client';

import Link from 'next/link';
import { PropsWithChildren } from 'react';

export default function NavbarLink({
  href,
  children,
}: PropsWithChildren<{
  href: string;
}>) {
  return (
    <Link role="listitem" href={href}>
      {children}
    </Link>
  );
}
