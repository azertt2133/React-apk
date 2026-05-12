// ── CONTACTS ────────────────────────────────────────────────────────────────
export const loadContacts = () => {
  const saved = localStorage.getItem("lxco_contacts");
  if (saved) return JSON.parse(saved);
  // migration depuis l'ancienne clé
  const old = localStorage.getItem("contacts");
  if (old) { localStorage.setItem("lxco_contacts", old); return JSON.parse(old); }
  return [];
};
export const saveContacts = (contacts) =>
  localStorage.setItem("lxco_contacts", JSON.stringify(contacts));

// ── DOSSIERS ────────────────────────────────────────────────────────────────
export const loadFolders = () => {
  const saved = localStorage.getItem("lxco_folders");
  if (saved) return JSON.parse(saved);
  // dossiers par défaut au premier lancement
  return [
    { id: "default", name: "Général", icon: "📋", color: "#b300ff" },
    { id: "sport",   name: "Sport",   icon: "🏋️", color: "#00d9ff" },
    { id: "travail", name: "Travail", icon: "💼", color: "#ff006e" },
  ];
};
export const saveFolders = (folders) =>
  localStorage.setItem("lxco_folders", JSON.stringify(folders));

// ── TÂCHES ──────────────────────────────────────────────────────────────────
export const loadTasks = () => {
  const saved = localStorage.getItem("lxco_tasks");
  if (saved) return JSON.parse(saved);
  // migration depuis l'ancienne clé
  const old = localStorage.getItem("tasks");
  if (old) { localStorage.setItem("lxco_tasks", old); return JSON.parse(old); }
  return [];
};
export const saveTasks = (tasks) =>
  localStorage.setItem("lxco_tasks", JSON.stringify(tasks));