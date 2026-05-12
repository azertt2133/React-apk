import { Link } from "react-router-dom";
import { loadTasks } from "../utils/storage";

export default function Home() {
  const tasks = loadTasks();
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

  return (
    <section className="page page-home">
      {/* Hero Section */}
      <div className="hero">
        <h1 className="hero-title">Bienvenue sur LXCO</h1>
        <p className="hero-subtitle">
          Gérez vos tâches et vos contacts dans une interface moderne, élégante et futuriste.
        </p>
        <Link to="/tasks" className="cta">Commencer maintenant</Link>
      </div>

      {/* Aperçu des tâches */}
      <div className="preview">
        <h2>📋 Aperçu des tâches</h2>
        {tasks.length > 0 ? (
          <ul>
            {tasks.slice(0, 3).map(t => (
              <li key={t.id}>{t.text}</li>
            ))}
          </ul>
        ) : (
          <p>Aucune tâche pour le moment.</p>
        )}
        <Link to="/tasks" className="cta">Voir toutes les tâches</Link>
      </div>

      {/* Aperçu des contacts */}
      <div className="preview">
        <h2>👥 Aperçu des contacts</h2>
        {contacts.length > 0 ? (
          <ul>
            {contacts.slice(-3).map((c, i) => (
              <li key={i}>{c.name} — {c.phone}</li>
            ))}
          </ul>
        ) : (
          <p>Aucun contact enregistré.</p>
        )}
        <Link to="/contact" className="cta">Voir tous les contacts</Link>
      </div>
    </section>
  );
}
