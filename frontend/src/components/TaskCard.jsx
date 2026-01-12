export default function TaskCard({ task, onDelete, onToggle, selected, onSelect, onEdit }) {
  const isCompleted = task.status === "completed";

  const date = new Date(task.createdAt).toLocaleString();

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition border-l-4
        ${isCompleted ? "border-green-500" : "border-yellow-400"}
      `}
    >
      <div className="flex gap-3">
        <input type="checkbox" checked={selected} onChange={onSelect} className="mt-1" />

        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3
              className={`font-semibold text-lg ${isCompleted ? "line-through text-gray-400" : ""}`}
            >
              {task.title}
            </h3>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{date}</span>
              <button onClick={() => onEdit(task)} className="text-indigo-600">Edit</button>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-2">{task.description}</p>

          <div className="mt-3 flex items-center gap-3">
            <span className={`text-xs font-medium ${isCompleted ? "text-green-600" : "text-yellow-600"}`}>
              {isCompleted ? "Completed" : "Pending"}
            </span>

            <button onClick={() => onToggle(task)} className="text-sm text-indigo-600">{isCompleted ? "Mark Pending" : "Mark Done"}</button>

            <button onClick={() => onDelete(task._id)} className="text-sm text-red-600">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
