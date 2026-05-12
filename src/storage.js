export const loadTasks = () => {
  const data = localStorage.getItem("tasks");
  return data ? JSON.parse(data) : [];
};

export const saveTasks = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};
