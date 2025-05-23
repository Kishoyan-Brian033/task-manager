"use strict";
class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
class Task {
    constructor(id, title, description, assignedTo) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.assignedTo = assignedTo;
    }
}
class UserService {
    constructor() {
        this.users = [];
        this.lastUserId = 0;
    }
    createUser(name, email) {
        const newUser = new User(++this.lastUserId, name, email);
        this.users.push(newUser);
        return newUser;
    }
    getAllUsers() {
        return this.users;
    }
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }
    deleteUser(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
        }
    }
}
class TaskService {
    constructor(userService) {
        this.userService = userService;
        this.tasks = [];
        this.lastTaskId = 0;
    }
    createTask(title, description) {
        const newTask = new Task(++this.lastTaskId, title, description);
        this.tasks.push(newTask);
        return newTask;
    }
    getAllTasks() {
        return this.tasks;
    }
    assignTask(taskId, userId) {
        const task = this.tasks.find(t => t.id === taskId);
        const user = this.userService.getUserById(userId);
        if (task && user) {
            task.assignedTo = userId;
            return true;
        }
        return false;
    }
    unassignTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task)
            return false;
        task.assignedTo = undefined;
        return true;
    }
    deleteTask(id) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
        }
    }
}
const userService = new UserService();
const taskService = new TaskService(userService);
const userBtn = document.getElementById("user-btn");
const userNameInput = document.getElementById("username");
const userEmailInput = document.getElementById("user-email");
const userList = document.querySelector(".user-list");
const taskBtn = document.getElementById("add-task");
const taskTitleInput = document.getElementById("task-title");
const taskDescInput = document.getElementById("description");
const tasksList = document.getElementById("tasksList");
const assignTaskBtn = document.getElementById("assignTaskBtn");
const assignUserIdInput = document.getElementById("assign-task");
const unassignTaskBtn = document.getElementById("unassign-task");
userBtn.addEventListener("click", () => {
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();
    if (!name || !email)
        return alert("Please fill in all fields.");
    userService.createUser(name, email);
    showUsers();
    userNameInput.value = "";
    userEmailInput.value = "";
});
function showUsers() {
    userList.innerHTML = "";
    userService.getAllUsers().forEach(user => {
        const div = document.createElement("div");
        div.className = "user-item";
        div.innerHTML = `
    <span class="user-id">ID: ${user.id}</span>
      <span class="user-name">${user.name}</span>
      <span class="user-email">${user.email}</span>
       <button class="delete-user-btn" data-id="${user.id}">Delete</button>
       <button class="update-user-btn" data-id="${user.id}">Upadate</button>
      
    `;
        userList.appendChild(div);
    });
    document.querySelectorAll('.delete-user-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const userId = parseInt(e.target.getAttribute('data-id') || '0');
            userService.deleteUser(userId);
            showUsers();
        });
    });
}
taskBtn.addEventListener("click", () => {
    const title = taskTitleInput.value.trim();
    const description = taskDescInput.value.trim();
    if (!title || !description)
        return alert("Please enter title and description.");
    taskService.createTask(title, description);
    showTasks();
    taskTitleInput.value = "";
    taskDescInput.value = "";
});
function showTasks() {
    tasksList.innerHTML = "";
    taskService.getAllTasks().forEach(task => {
        const div = document.createElement("div");
        div.className = "task-item";
        div.innerHTML = `
      <span class="task-title">${task.title}</span>
      <span class="task-desc">${task.description}</span>
      <span class="assigned-to">Assigned To: ${task.assignedTo || "None"}</span>
       <button class="delete-task-btn" data-id="${task.id}">Delete </button>
       <button class="upadate-task-btn" data-id="${task.id}">Update</button>
    `;
        tasksList.appendChild(div);
    });
    document.querySelectorAll('.delete-task-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const taskId = parseInt(e.target.getAttribute('data-id') || '0');
            taskService.deleteTask(taskId);
            showTasks();
        });
    });
}
assignTaskBtn.addEventListener("click", () => {
    const userId = parseInt(assignUserIdInput.value);
    const tasks = taskService.getAllTasks();
    if (!tasks.length)
        return alert("No tasks available.");
    const lastTask = tasks[tasks.length - 1];
    if (taskService.assignTask(lastTask.id, userId)) {
        showTasks();
    }
    else {
        alert("Failed to assign task. Check user ID.");
    }
    assignUserIdInput.value = "";
});
unassignTaskBtn.addEventListener("click", () => {
    const tasks = taskService.getAllTasks();
    if (!tasks.length)
        return alert("No tasks available.");
    const lastTask = tasks[tasks.length - 1];
    if (taskService.unassignTask(lastTask.id)) {
        showTasks();
    }
    else {
        alert("Failed to unassign task.");
    }
});
