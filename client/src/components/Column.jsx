import { useState } from "react";

export default function Column({ title, status, tasks, moveTask, deleteTask, editTask }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDesc(task.description || "");
  };

  const saveEdit = () => {
    editTask(editingId, editTitle, editDesc);
    setEditingId(null);
  };

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "10px",
        width: "250px",
        borderRadius: "5px",
        minHeight: "200px",
      }}
    >
      <h2>{title}</h2>
      {tasks.filter(task => task.status === status).map(task => (
        <div
          key={task._id}
          style={{
            marginBottom: "10px",
            border: "1px solid lightgray",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          {editingId === task._id ? (
            <div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                style={{ width: "100%", marginBottom: "5px" }}
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Description"
                style={{ width: "100%", marginBottom: "5px" }}
              />
              <button onClick={saveEdit} style={{ marginRight: "5px" }}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p><strong>{task.title}</strong></p>
              <p>{task.description}</p>
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                {status !== "todo" && <button onClick={() => moveTask(task, "left")}>←</button>}
                {status !== "done" && <button onClick={() => moveTask(task, "right")}>→</button>}
                <button onClick={() => startEdit(task)}>Edit</button>
                <button onClick={() => deleteTask(task._id)}>✕</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
