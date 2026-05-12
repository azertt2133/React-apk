export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`task-item ${task.done ? "done" : ""}`}>
      <span onClick={() => onToggle(task.id)}>
        {task.text}
      </span>
      <button onClick={() => onDelete(task.id)}>Supprimer</button>
    </div>
  );
}
