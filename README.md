# Kanban Board

A full-stack Kanban Board web application that helps you manage tasks efficiently. The application allows you to create boards, lists, and cards, and track progress visually. Built with Node.js, MongoDB, and a front-end client.

## Features
- Create multiple boards for different projects
- Add lists and cards to organize tasks
- Drag and drop cards between lists
- Full-stack architecture with separate `client` and `server` folders
- Uses MongoDB Atlas for database storage
- Environment variables used for secure credentials

---

## Folder Structure
kanban/
├─ client/ # Frontend code
├─ server/ # Backend code
│ ├─ .env # Environment variables (not tracked in Git)
│ └─ ... # Server logic
├─ .gitignore
└─ README.md

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

---

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Nishchal-ll/Kanban-Board.git
cd Kanban-Board

2. **Setup backend**
```bash
cd server
npm install
Create a .env file in server/
MONGO_URI=mongodb+srv://<your-mongodb-user>:<your-password>@<cluster-url>/?appName=kanbanboard
PORT=5000

3. **Start backend server**
```bash
node server.js

4. **Setup the frontend**
```bash
cd ../client
npm install
npm start
