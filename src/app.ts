
interface IUser {
  id: number;
  name: string;
  email: string;
}

interface ITask {
  id: number;
  title: string;
  description: string;
  assignedTo?: number;
}

class User implements IUser {
  constructor(public id: number, public name: string, public email: string) {}
}

class Task implements ITask {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public assignedTo?: number
  ) {}
}

class UserService {
  private users: User[] = [];
  private lastUserId: number = 0;

  createUser(name: string, email: string): User {
    const newUser = new User(++this.lastUserId, name, email);
    this.users.push(newUser);
    return newUser;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  updateUser(id: number, name: string, email: string): boolean {
    const user = this.getUserById(id);
    if (user) {
      user.name = name;
      user.email = email;
      return true;
    }
    return false;
  }

  deleteUser(id: number): void {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }
}

class TaskService {
  private tasks: Task[] = [];
  private lastTaskId: number = 0;
  constructor(private userService: UserService) {}

  createTask(title: string, description: string): Task {
    const newTask = new Task(++this.lastTaskId, title, description);
    this.tasks.push(newTask);
    return newTask;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  updateTask(id: number, title: string, description: string): boolean {
    const task = this.getTaskById(id);
    if (task) {
      task.title = title;
      task.description = description;
      return true;
    }
    return false;
  }

  assignTask(taskId: number, userId: number): boolean {
    const task = this.tasks.find(t => t.id === taskId);
    const user = this.userService.getUserById(userId);
    if (task && user) {
      task.assignedTo = userId;
      return true;
    }
    return false;
  }

  unassignTask(taskId: number): boolean {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return false;
    task.assignedTo = undefined;
    return true;
  }

  deleteTask(id: number): void {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }
}

const userService = new UserService();
const taskService = new TaskService(userService);


const userBtn = document.getElementById("user-btn") as HTMLButtonElement;
const userNameInput = document.getElementById("username") as HTMLInputElement;
const userEmailInput = document.getElementById("user-email") as HTMLInputElement;
const userList = document.querySelector(".user-list") as HTMLDivElement;

const taskBtn = document.getElementById("add-task") as HTMLButtonElement;
const taskTitleInput = document.getElementById("task-title") as HTMLInputElement;
const taskDescInput = document.getElementById("description") as HTMLTextAreaElement;
const tasksList = document.getElementById("tasksList") as HTMLDivElement;

const assignTaskBtn = document.getElementById("assignTaskBtn") as HTMLButtonElement;
const assignUserIdInput = document.getElementById("assign-task") as HTMLInputElement;
const unassignTaskBtn = document.getElementById("unassign-task") as HTMLButtonElement;


userBtn.addEventListener("click", () => {
  const name = userNameInput.value.trim();
  const email = userEmailInput.value.trim();
  if (!name || !email) return alert("Please fill in all fields.");
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
      const userId = parseInt((e.target as HTMLElement).getAttribute('data-id') || '0');
      userService.deleteUser(userId);
      showUsers(); 
    });
  });

  document.querySelectorAll(".update-user-btn").forEach(button => {
    button.addEventListener('click', (e) => {
      const userId = parseInt((e.target as HTMLElement).getAttribute('data-id') || '0');
      const user = userService.getUserById(userId);
      
      if (user) {
        const userItem = (e.target as HTMLElement).closest('.user-item');
        if (userItem) {
          userItem.innerHTML = `
            <div class="update-form">
              <input type="text" id="update-name-${user.id}" value="${user.name}">
              <input type="text" id="update-email-${user.id}" value="${user.email}">
              <button class="save-update-btn" data-id="${user.id}">Save</button>
              <button class="cancel-update-btn">Cancel</button>
            </div>
          `;
          
          userItem.querySelector('.save-update-btn')?.addEventListener('click', () => {
            const newName = (document.getElementById(`update-name-${user.id}`) as HTMLInputElement).value;
            const newEmail = (document.getElementById(`update-email-${user.id}`) as HTMLInputElement).value;
            
            if (newName && newEmail) {
              userService.updateUser(user.id, newName, newEmail);
              showUsers();
            } else {
              alert('Please fill in all fields');
            }
          });
          
          userItem.querySelector('.cancel-update-btn')?.addEventListener('click', () => {
            showUsers();
          });
        }
      }
    });
  });
}

taskBtn.addEventListener("click", () => {
  const title = taskTitleInput.value.trim();
  const description = taskDescInput.value.trim();
  if (!title || !description) return alert("Please enter title and description.");
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
      const taskId = parseInt((e.target as HTMLElement).getAttribute('data-id') || '0');
      taskService.deleteTask(taskId);
      showTasks(); 
    });
  });

  document.querySelectorAll(".update-task-btn").forEach(button => {
    button.addEventListener('click', (e) => {
      const taskId = parseInt((e.target as HTMLElement).getAttribute('data-id') || '0');
      const task = taskService.getTaskById(taskId);
      
      if (task) {
        const taskItem = (e.target as HTMLElement).closest('.task-item');
        if (taskItem) {
          taskItem.innerHTML = `
            <div class="update-form">
              <input type="text" id="update-title-${task.id}" value="${task.title}">
              <textarea id="update-desc-${task.id}">${task.description}</textarea>
              <button class="save-task-update-btn" data-id="${task.id}">Save</button>
              <button class="cancel-task-update-btn">Cancel</button>
            </div>
          `;
          
          taskItem.querySelector('.save-task-update-btn')?.addEventListener('click', () => {
            const newTitle = (document.getElementById(`update-title-${task.id}`) as HTMLInputElement).value;
            const newDesc = (document.getElementById(`update-desc-${task.id}`) as HTMLTextAreaElement).value;
            
            if (newTitle && newDesc) {
              taskService.updateTask(task.id, newTitle, newDesc);
              showTasks();
            } else {
              alert('Please fill in all fields');
            }
          });
          
          taskItem.querySelector('.cancel-task-update-btn')?.addEventListener('click', () => {
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
  if (!tasks.length) return alert("No tasks available.");
  const lastTask = tasks[tasks.length - 1];
  if (taskService.assignTask(lastTask.id, userId)) {
    showTasks();
  } else {
    alert("Failed to assign task. Check user ID.");
  }
  assignUserIdInput.value = "";
});

unassignTaskBtn.addEventListener("click", () => {
  const tasks = taskService.getAllTasks();
  if (!tasks.length) return alert("No tasks available.");
  const lastTask = tasks[tasks.length - 1];
  if (taskService.unassignTask(lastTask.id)) {
    showTasks();
  } else {
    alert("Failed to unassign task.");
  }
});

showUsers();
showTasks();