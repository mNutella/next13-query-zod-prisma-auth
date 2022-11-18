import { PAGE_ROUTES } from '../core/config/constants';
import NavbarLink from './NavbarLink';
import NavProfileInfo from './NavProfileInfo';

export default function Navbar() {
  return (
    <nav className="p-2">
      <ul className="container mx-auto lg:flex lg:space-x-4 lg:items-center">
        <li role="list">
          <NavbarLink href={PAGE_ROUTES.main}>Home</NavbarLink>
        </li>
        <li>
          <NavbarLink href={PAGE_ROUTES.login}>SignIn</NavbarLink>
        </li>
        <li>
          <NavbarLink href={PAGE_ROUTES.profile}>Profile</NavbarLink>
        </li>
        <li>
          <NavbarLink href={PAGE_ROUTES.posts}>Posts</NavbarLink>
        </li>
        <NavProfileInfo />
      </ul>
    </nav>
  );
}
