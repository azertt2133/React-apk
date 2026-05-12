import TaskItem from "./TaskItem";
import EmptyState from "./EmptyState";

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) return <EmptyState />;

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
