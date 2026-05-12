import { useEffect, useState, useRef } from "react";

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
  return `${s}s`;
}

export default function TaskItem({ task, onToggle, onDelete, onStart, onPause }) {
  const [visible, setVisible] = useState(false);
  // Affichage local du temps écoulé (mis à jour chaque seconde si running)
  const [displayElapsed, setDisplayElapsed] = useState(task.elapsed || 0);
  const intervalRef = useRef(null);

  // Animation d'apparition
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Tick du timer
  useEffect(() => {
    if (task.running && !task.done) {
      intervalRef.current = setInterval(() => {
        const elapsed = task.elapsed + Math.floor((Date.now() - task.startedAt) / 1000);
        setDisplayElapsed(elapsed);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      setDisplayElapsed(task.elapsed || 0);
    }
    return () => clearInterval(intervalRef.current);
  }, [task.running, task.done, task.elapsed, task.startedAt]);

  const hasTime = displayElapsed > 0;

  return (
    <div className={`task-item task-item-enhanced ${task.done ? "done" : ""} ${visible ? "show" : ""}`}>
      {/* Ligne principale */}
      <div className="task-main-row">
        {/* Checkbox custom */}
        <button
          className={`task-check ${task.done ? "task-check-done" : ""}`}
          onClick={() => onToggle(task.id)}
          title={task.done ? "Marquer comme non fait" : "Marquer comme fait"}
        >
          {task.done ? "✓" : ""}
        </button>

        {/* Texte */}
        <span className="task-text" onClick={() => onToggle(task.id)}>
          {task.text}
        </span>

        {/* Timer controls */}
        {!task.done && (
          <div className="timer-controls">
            {!task.running ? (
              <button
                className="timer-btn timer-start"
                onClick={() => onStart(task.id)}
                title="Démarrer le chrono"
              >
                ▶
              </button>
            ) : (
              <button
                className="timer-btn timer-pause"
                onClick={() => onPause(task.id)}
                title="Pause"
              >
                ⏸
              </button>
            )}
          </div>
        )}

        <button className="task-delete-btn" onClick={() => onDelete(task.id)} title="Supprimer">
          🗑
        </button>
      </div>

      {/* Temps affiché */}
      {(hasTime || task.running) && (
        <div className="task-time-row">
          <span className={`task-time-badge ${task.running ? "task-time-running" : task.done ? "task-time-done" : ""}`}>
            {task.done ? "⏱ Réalisé en" : task.running ? "⏱ En cours" : "⏱ Temps pausé"} : {formatTime(displayElapsed)}
          </span>
        </div>
      )}
    </div>
  );
}