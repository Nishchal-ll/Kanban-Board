import { useEffect, useState, memo } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import api from "./api";

// Task Card as Draggable
const TaskCard = memo(({ task, deleteTask, editTask }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ 
    id: task._id 
  });
  
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description || "");

  const saveEdit = () => {
    editTask(task._id, title, desc);
    setEditing(false);
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow">
        {editing ? (
          <div className="space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Task title"
              onClick={(e) => e.stopPropagation()}
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="3"
              placeholder="Task description"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); saveEdit(); }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Save
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setEditing(false); }}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{task.description}</p>
            )}
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button 
                onClick={(e) => { e.stopPropagation(); setEditing(true); }}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium"
              >
                Edit
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteTask(task._id); }}
                className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium"
              >
                ✕
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

// Droppable Column
const Column = memo(({ id, title, children, taskCount }) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col">
      {/* Column Header - Outside droppable */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className="px-2.5 py-0.5 text-xs font-medium bg-white rounded-full text-gray-600 shadow-sm">
          {taskCount}
        </span>
      </div>

      {/* Droppable Area */}
      <div 
        ref={setNodeRef}
        className={`bg-white rounded-xl p-4 border border-gray-200 min-h-[500px] ${
          isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
});

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const columns = ["todo", "inprogress", "done"];
  const columnTitles = {
    todo: "To Do",
    inprogress: "In Progress",
    done: "Done",
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { 
        distance: 8 
      } 
    })
  );

  useEffect(() => {
    api.get("/")
      .then(res => setTasks(res.data))
      .catch(console.error);
  }, []);

  const addTask = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await api.post("/", { 
        title: newTitle, 
        description: newDesc, 
        status: "todo" 
      });
      setTasks([...tasks, res.data]);
      setNewTitle(""); 
      setNewDesc("");
    } catch (err) { 
      console.error(err); 
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) { 
      console.error(err); 
    }
  };

  const editTask = async (id, title, description) => {
    try {
      const res = await api.put(`/${id}`, { title, description });
      setTasks(tasks.map(t => (t._id === id ? res.data : t)));
    } catch (err) { 
      console.error(err); 
    }
  };

  const handleDragEnd = async ({ active, over }) => {
    if (!over) return;
    const task = tasks.find(t => t._id === active.id);
    if (!task || task.status === over.id) return;

    try {
      const res = await api.put(`/${task._id}`, { status: over.id });
      setTasks(tasks.map(t => (t._id === task._id ? res.data : t)));
    } catch (err) { 
      console.error(err); 
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addTask();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kanban Board</h1>
          <p className="text-gray-600">Organize your tasks efficiently</p>
        </div>

        {/* Add Task Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Task title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
            <button 
              onClick={addTask}
              className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors whitespace-nowrap"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Drag-and-Drop Columns */}
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(col => (
              <Column 
                key={col} 
                id={col} 
                title={columnTitles[col]}
                taskCount={tasks.filter(t => t.status === col).length}
              >
                {tasks
                  .filter(t => t.status === col)
                  .map(task => (
                    <TaskCard 
                      key={task._id} 
                      task={task} 
                      deleteTask={deleteTask} 
                      editTask={editTask} 
                    />
                  ))}
              </Column>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}