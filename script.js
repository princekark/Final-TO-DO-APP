
const taskForm = document.getElementById("task-form");
const taskNameInput = document.getElementById("task-name");
const dueDateInput = document.getElementById("due-date");
const taskList = document.getElementById("task-list");
const totalTasksEl = document.getElementById("total-tasks");
const completedTasksEl = document.getElementById("completed-tasks");
const overdueTasksEl = document.getElementById("overdue-tasks");
const completionSound = document.getElementById("completion-sound");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


renderTasks();


taskForm.addEventListener("submit", addTask);

function addTask(e) {
    e.preventDefault();

    const taskName = taskNameInput.value;
    const dueDate = dueDateInput.value;

    if (!taskName || !dueDate) return;

    const task = {
        id: Date.now(),
        name: taskName,
        dueDate,
        completed: false,
        color: getRandomColor(),
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    taskForm.reset();
}

function renderTasks() {
    taskList.innerHTML = "";

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let totalTasks = 0;
    let completedTasks = 0;
    let overdueTasks = 0;

    tasks.forEach((task) => {
        totalTasks++;
        if (task.completed) completedTasks++;

        const dueDate = new Date(task.dueDate);
        let listItemClass = "";

        if (!task.completed) {
            if (dueDate < now) {
                listItemClass = "overdue";
                overdueTasks++;
            } else if (
                dueDate.getDate() === tomorrow.getDate() &&
                dueDate.getMonth() === tomorrow.getMonth() &&
                dueDate.getFullYear() === tomorrow.getFullYear()
            ) {
                listItemClass = "due-tomorrow";
            }
        } else {
            listItemClass = "completed";
        }

        const taskItem = document.createElement("li");
        taskItem.className = listItemClass;

        taskItem.innerHTML = `
            <div style="display: flex; align-items: center;">
                <span class="color-dot" style="background-color: ${task.color}"></span>
                ${task.name} <em>(${task.dueDate})</em>
            </div>
            <div class="actions">
                <button onclick="toggleComplete(${task.id})">Complete</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        taskList.appendChild(taskItem);
    });

    totalTasksEl.textContent = totalTasks;
    completedTasksEl.textContent = completedTasks;
    overdueTasksEl.textContent = overdueTasks;
}

function toggleComplete(id) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
        task.completed = !task.completed;
        if (task.completed) {
            completionSound.currentTime = 0;
            completionSound.play();
        }
    }
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getRandomColor() {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FFC300", "#DAF7A6"];
    return colors[Math.floor(Math.random() * colors.length)];
}
