import { useEffect, useState, useRef } from "react";

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
  if (m > 0) return `${m}m ${String(s).padStart(2,"0")}s`;
  return `${s}s`;
}

export default function TaskItem({ task, onToggle, onDelete, onStart, onPause }) {
  const [visible, setVisible]           = useState(false);
  const [displayElapsed, setDisplayElapsed] = useState(task.elapsed || 0);
  const intervalRef = useRef(null);

  // animation d'apparition
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // tick du chrono
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (task.running && !task.done) {
      intervalRef.current = setInterval(() => {
        setDisplayElapsed(task.elapsed + Math.floor((Date.now() - task.startedAt) / 1000));
      }, 1000);
    } else {
      setDisplayElapsed(task.elapsed || 0);
    }
    return () => clearInterval(intervalRef.current);
  }, [task.running, task.done, task.elapsed, task.startedAt]);

  const hasTime = displayElapsed > 0;

  return (
    <div className={`task-item task-item-enhanced ${task.done ? "done" : ""} ${visible ? "show" : ""}`}>
      {/* ligne principale */}
      <div className="task-main-row">
        <button
          className={`task-check ${task.done ? "task-check-done" : ""}`}
          onClick={() => onToggle(task.id)}
          title={task.done ? "Remettre en cours" : "Marquer terminée"}
        >{task.done ? "✓" : ""}</button>

        <span className="task-text" onClick={() => onToggle(task.id)}>{task.text}</span>

        {!task.done && (
          <div className="timer-controls">
            {task.running
              ? <button className="timer-btn timer-pause" onClick={() => onPause(task.id)} title="Pause">⏸</button>
              : <button className="timer-btn timer-start" onClick={() => onStart(task.id)} title="Démarrer">▶</button>
            }
          </div>
        )}

        <button className="task-delete-btn" onClick={() => onDelete(task.id)} title="Supprimer">🗑</button>
      </div>

      {/* temps */}
      {(hasTime || task.running) && (
        <div className="task-time-row">
          <span className={`task-time-badge ${task.running ? "task-time-running" : task.done ? "task-time-done" : ""}`}>
            {task.done ? "⏱ Réalisé en" : task.running ? "⏱ En cours" : "⏱ Pausé"} : {formatTime(displayElapsed)}
          </span>
        </div>
      )}
    </div>
  );
}
