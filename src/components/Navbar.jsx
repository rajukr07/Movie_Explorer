import { NavLink } from "react-router-dom";

function Navbar({ favoritesCount }) {
  return (
    <header className="navbar">
      <NavLink className="logo" to="/">
        🎬 Movie Explorer
      </NavLink>

      <nav>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "active-link" : ""
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            isActive ? "active-link" : ""
          }
        >
          Favorites
          <span className="favorite-count">
            {favoritesCount}
          </span>
        </NavLink>
      </nav>

      <div className="profile">R</div>
    </header>
  );
}

export default Navbar;