import axios from "axios";

export default axios.create({
  baseURL: "https://kanban-board-rlf9.onrender.com/api/tasks"
});
