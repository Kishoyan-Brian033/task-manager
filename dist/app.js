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
    updateUser(id, name, email) {
        const user = this.getUserById(id);
        if (user) {
            user.name = name;
            user.email = email;
            return true;
        }
        return false;
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
    getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }
    updateTask(id, title, description) {
        const task = this.getTaskById(id);
        if (task) {
            task.title = title;
            task.description = description;
            return true;
        }
        return false;
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
// DOM Elements
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
// User Functions
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
      <button class="update-user-btn" data-id="${user.id}">Update</button>
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
    document.querySelectorAll(".update-user-btn").forEach(button => {
        button.addEventListener('click', (e) => {
            var _a, _b;
            const userId = parseInt(e.target.getAttribute('data-id') || '0');
            const user = userService.getUserById(userId);
            if (user) {
                const userItem = e.target.closest('.user-item');
                if (userItem) {
                    userItem.innerHTML = `
            <div class="update-form">
              <input type="text" id="update-name-${user.id}" value="${user.name}">
              <input type="text" id="update-email-${user.id}" value="${user.email}">
              <button class="save-update-btn" data-id="${user.id}">Save</button>
              <button class="cancel-update-btn">Cancel</button>
            </div>
          `;
                    (_a = userItem.querySelector('.save-update-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                        const newName = document.getElementById(`update-name-${user.id}`).value;
                        const newEmail = document.getElementById(`update-email-${user.id}`).value;
                        if (newName && newEmail) {
                            userService.updateUser(user.id, newName, newEmail);
                            showUsers();
                        }
                        else {
                            alert('Please fill in all fields');
                        }
                    });
                    (_b = userItem.querySelector('.cancel-update-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
                        showUsers();
                    });
                }
            }
        });
    });
}
// Task Functions
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
      <button class="delete-task-btn" data-id="${task.id}">Delete</button>
      <button class="update-task-btn" data-id="${task.id}">Update</button>
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
    document.querySelectorAll(".update-task-btn").forEach(button => {
        button.addEventListener('click', (e) => {
            var _a, _b;
            const taskId = parseInt(e.target.getAttribute('data-id') || '0');
            const task = taskService.getTaskById(taskId);
            if (task) {
                const taskItem = e.target.closest('.task-item');
                if (taskItem) {
                    taskItem.innerHTML = `
            <div class="update-form">
              <input type="text" id="update-title-${task.id}" value="${task.title}">
              <textarea id="update-desc-${task.id}">${task.description}</textarea>
              <button class="save-task-update-btn" data-id="${task.id}">Save</button>
              <button class="cancel-task-update-btn">Cancel</button>
            </div>
          `;
                    (_a = taskItem.querySelector('.save-task-update-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                        const newTitle = document.getElementById(`update-title-${task.id}`).value;
                        const newDesc = document.getElementById(`update-desc-${task.id}`).value;
                        if (newTitle && newDesc) {
                            taskService.updateTask(task.id, newTitle, newDesc);
                            showTasks();
                        }
                        else {
                            alert('Please fill in all fields');
                        }
                    });
                    (_b = taskItem.querySelector('.cancel-task-update-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
                        showTasks();
                    });
                }
            }
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
// Initialize the UI
showUsers();
showTasks();
