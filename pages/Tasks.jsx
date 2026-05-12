import { useState, useEffect, useRef } from "react";
import TaskForm from "../components/TaskForm";
import { loadTasks, saveTasks, loadFolders, saveFolders } from "../utils/storage";

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
  if (m > 0) return `${m}m ${String(s).padStart(2,"0")}s`;
  return `${s}s`;
}

function TaskItem({ task, onToggle, onDelete, onStart, onPause }) {
  const [display, setDisplay] = useState(task.elapsed || 0);
  const ref = useRef(null);

  useEffect(() => {
    if (task.running && !task.done) {
      ref.current = setInterval(() => {
        setDisplay(task.elapsed + Math.floor((Date.now() - task.startedAt) / 1000));
      }, 1000);
    } else {
      clearInterval(ref.current);
      setDisplay(task.elapsed || 0);
    }
    return () => clearInterval(ref.current);
  }, [task.running, task.done, task.elapsed, task.startedAt]);

  return (
    <div className={`task-item task-item-enhanced ${task.done ? "done" : ""}`}
      style={{ opacity: 1, transform: "none" }}>

      <div className="task-main-row">
        <button
          className={`task-check ${task.done ? "task-check-done" : ""}`}
          onClick={() => onToggle(task.id)}
        >{task.done ? "✓" : ""}</button>

        <span className="task-text" onClick={() => onToggle(task.id)}>{task.text}</span>

        {!task.done && (
          !task.running
            ? <button className="timer-btn timer-start" onClick={() => onStart(task.id)} title="Démarrer">▶</button>
            : <button className="timer-btn timer-pause" onClick={() => onPause(task.id)} title="Pause">⏸</button>
        )}

        <button className="task-delete-btn" onClick={() => onDelete(task.id)}>🗑</button>
      </div>

      {(display > 0 || task.running) && (
        <div className="task-time-row">
          <span className={`task-time-badge ${task.running ? "task-time-running" : task.done ? "task-time-done" : ""}`}>
            {task.done ? "⏱ Réalisé en" : task.running ? "⏱ En cours" : "⏱ Pausé"} : {formatTime(display)}
          </span>
        </div>
      )}
    </div>
  );
}

const ICONS = ["📁","🏋️","💼","🎯","📚","🎨","🚀","🏠","🎮","💡","🧘","✈️"];

export default function Tasks() {
  const [tasks,         setTasks]         = useState(null);
  const [folders,       setFolders]       = useState(null);
  const [activeFolder,  setActiveFolder]  = useState(null);
  const [filter,        setFilter]        = useState("all");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newName,       setNewName]       = useState("");
  const [newIcon,       setNewIcon]       = useState("📁");
  const [newColor,      setNewColor]      = useState("#b300ff");

  // ── chargement initial ── même pattern exact que PageContact
  useEffect(() => {
    const savedFolders = loadFolders();
    setFolders(savedFolders);
    setActiveFolder(savedFolders[0]?.id || null);
    setTasks(loadTasks());
  }, []);

  // ── sauvegarde automatique (skip avant chargement) ──
  useEffect(() => { if (tasks   !== null) saveTasks(tasks);   }, [tasks]);
  useEffect(() => { if (folders !== null) saveFolders(folders); }, [folders]);

  // ── attendre le chargement ── même pattern exact que PageContact
  if (tasks === null || folders === null) return null;

  // ── actions tâches ──
  const addTask = (text) => setTasks(prev => [...prev, {
    id: Date.now(), text, done: false, folderId: activeFolder,
    createdAt: Date.now(), startedAt: null, completedAt: null,
    elapsed: 0, running: false,
  }]);

  const toggleTask = (id) => setTasks(prev => prev.map(t => {
    if (t.id !== id) return t;
    if (!t.done) {
      const elapsed = t.running
        ? t.elapsed + Math.floor((Date.now() - t.startedAt) / 1000)
        : t.elapsed;
      return { ...t, done: true, completedAt: Date.now(), running: false, elapsed };
    }
    return { ...t, done: false, completedAt: null };
  }));

  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const startTimer = (id) => setTasks(prev => prev.map(t =>
    t.id === id && !t.done ? { ...t, running: true, startedAt: Date.now() } : t
  ));

  const pauseTimer = (id) => setTasks(prev => prev.map(t => {
    if (t.id !== id || !t.running) return t;
    return { ...t, running: false, elapsed: t.elapsed + Math.floor((Date.now() - t.startedAt) / 1000) };
  }));

  // ── actions dossiers ──
  const createFolder = () => {
    if (!newName.trim()) return;
    const f = { id: Date.now().toString(), name: newName.trim(), icon: newIcon, color: newColor };
    setFolders(prev => [...prev, f]);
    setActiveFolder(f.id);
    setNewName(""); setNewIcon("📁"); setNewColor("#b300ff"); setShowNewFolder(false);
  };

  const deleteFolder = (folderId) => {
    const remaining = folders.filter(f => f.id !== folderId);
    setFolders(remaining);
    setTasks(prev => prev.filter(t => t.folderId !== folderId));
    setActiveFolder(remaining[0]?.id || null);
  };

  // ── calculs ──
  const folderTasks   = tasks.filter(t => t.folderId === activeFolder);
  const filteredTasks = folderTasks.filter(t =>
    filter === "done" ? t.done : filter === "active" ? !t.done : true
  );
  const doneCount   = folderTasks.filter(t => t.done).length;
  const totalCount  = folderTasks.length;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const activeF     = folders.find(f => f.id === activeFolder);

  return (
    <div className="page">
      <h1 style={{
        fontSize: "32px", marginBottom: "30px",
        background: "linear-gradient(135deg, var(--primary-neon), var(--secondary-neon))",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text", textTransform: "uppercase", letterSpacing: "2px"
      }}>Mes Tâches</h1>

      {/* ── Onglets dossiers ── */}
      <div className="folders-bar">
        {folders.map(f => (
          <div key={f.id}
            className={`folder-tab ${activeFolder === f.id ? "folder-tab-active" : ""}`}
            style={{ "--folder-color": f.color }}
            onClick={() => setActiveFolder(f.id)}
          >
            <span>{f.icon}</span>
            <span>{f.name}</span>
            {activeFolder === f.id && folders.length > 1 && (
              <button className="folder-delete-btn" onClick={e => {
                e.stopPropagation();
                if (window.confirm(`Supprimer "${f.name}" et toutes ses tâches ?`)) deleteFolder(f.id);
              }}>✕</button>
            )}
          </div>
        ))}
        <button className="folder-add-btn" onClick={() => setShowNewFolder(v => !v)}>
          ＋ Nouveau dossier
        </button>
      </div>

      {/* ── Formulaire nouveau dossier ── */}
      {showNewFolder && (
        <div className="new-folder-form">
          <div className="icon-picker">
            {ICONS.map(ic => (
              <button key={ic}
                className={`icon-btn ${newIcon === ic ? "icon-btn-active" : ""}`}
                onClick={() => setNewIcon(ic)}>{ic}</button>
            ))}
          </div>
          <div className="folder-form-row">
            <input className="folder-name-input" type="text"
              placeholder="Nom du dossier..."
              value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && createFolder()} />
            <input className="folder-color-input" type="color"
              value={newColor} onChange={e => setNewColor(e.target.value)} />
            <button className="folder-create-btn" onClick={createFolder}>Créer</button>
            <button className="folder-cancel-btn" onClick={() => setShowNewFolder(false)}>Annuler</button>
          </div>
        </div>
      )}

      {/* ── Barre de progression ── */}
      {totalCount > 0 && (
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">
              {activeF?.icon} {activeF?.name} — {doneCount}/{totalCount} tâches
            </span>
            <span className="progress-percent"
              style={{ color: activeF?.color || "var(--primary-neon)" }}>
              {progressPct}%
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{
              width: `${progressPct}%`,
              background: `linear-gradient(90deg, ${activeF?.color || "var(--primary-neon)"}, var(--secondary-neon))`,
            }}/>
          </div>
        </div>
      )}

      {/* ── Formulaire ajout tâche ── */}
      <TaskForm onAdd={addTask} />

      {/* ── Filtres ── */}
      <div className="filters">
        {["all","active","done"].map(f => (
          <button key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}>
            {f === "all" ? "Toutes" : f === "active" ? "En cours" : "Terminées"}
          </button>
        ))}
      </div>

      <p className="counter">{filteredTasks.length} tâche(s) / {totalCount} dans ce dossier</p>

      {/* ── Liste ── */}
      {filteredTasks.length === 0
        ? <p className="empty">Aucune tâche ici.</p>
        : <div className="task-list">
            {filteredTasks.map(task => (
              <TaskItem key={task.id} task={task}
                onToggle={toggleTask} onDelete={deleteTask}
                onStart={startTimer}  onPause={pauseTimer} />
            ))}
          </div>
      }
    </div>
  );
}