import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="logo">To‑Do Pro</h2>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/tasks">Tâches</Link></li>
        <li><Link to="/about">À propos</Link></li>
      </ul>
      <div className="navbar-right">
        <ThemeToggle />
      </div>
    </nav>
  );
}
