import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__mark" aria-hidden="true" />
          <span className="navbar__brand-text">Creatorverse</span>
        </Link>
        <nav className="navbar__links" aria-label="Main">
          <NavLink to="/" className="navbar__link" end>
            All creators
          </NavLink>
          <NavLink to="/add" className="navbar__link">
            Add a creator
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
