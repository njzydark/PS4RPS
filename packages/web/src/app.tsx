import { Link, Outlet } from 'react-router-dom';

export const App = () => {
  return (
    <>
      <nav style={{ marginBottom: 24 }}>
        <Link to="/" style={{ marginRight: 12 }}>
          Home
        </Link>
        <Link to="/about">About</Link>
      </nav>
      <Outlet />
    </>
  );
};
