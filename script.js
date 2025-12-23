const toggleAddBtn = document.getElementById("toggle-add-task");
const taskFormContainer = document.getElementById("task-form");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskDesc = document.getElementById("task-desc");
const taskCategory = document.getElementById("task-category");
const taskDate = document.getElementById("task-date");
const todoList = document.getElementById("todo-list");
const searchInput = document.querySelector(".search-input");
const completedList = document.getElementById("completed-list");
const themeToggle = document.getElementById("theme-icon");
const API_URL = "http://localhost:3000/todos";

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️";
}

toggleAddBtn.addEventListener("click", () => {
  taskFormContainer.classList.toggle("hidden");
});

//Fetch and render tasks
async function fetchTasks(query = "") {
  try {
    const url = query ? `${API_URL}?q=${encodeURIComponent(query)}` : API_URL;
    const response = await fetch(url);
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error("Error fetching tasks: ", error);
  }
}
searchInput.addEventListener("input", (e) => {
  fetchTasks(e.target.value);
});

function renderTasks(tasks) {
  todoList.innerHTML = "";
  completedList.innerHTML = "";

  tasks.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.className = "task-card";
    taskCard.innerHTML = `
                <div class="check-circle ${
                  task.completed ? "checked" : ""
                }"></div>
                <div class="task-details">
                    <div class="task-title">${task.title}</div>
                    <div class="task-desc">${task.description}</div>
                    <div class="due-date">${task.category} | Due: ${
      task.dueDate
    }</div>
                </div>
                <button class="delete-btn">🗑️</button>
            `;
    //working check-circle with task completion
    const checkCircle = taskCard.querySelector(".check-circle");
    checkCircle.addEventListener("click", async () => {
      try {
        await fetch(`${API_URL}/${task.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !task.completed }),
        });
        fetchTasks();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    });

    //task deletion section
    const deleteBtn = taskCard.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", async () => {
      try {
        const response = await fetch(`${API_URL}/${task.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchTasks();
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    });

    if (task.completed) {
      completedList.appendChild(taskCard);
    } else {
      todoList.appendChild(taskCard);
    }
  });
  if (document.body.classList.contains("dark-mode")) {
    document.body.classList.add("dark-mode");
  }
}

//Post: Handeling new task submission
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newTask = {
    title: taskInput.value,
    description: taskDesc.value,
    category: taskCategory.value,
    dueDate: taskDate.value,
    completed: false,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      taskForm.reset();
      fetchTasks();
    }
  } catch (error) {
    console.error("Error adding task: ", error);
  }
});

fetchTasks();

//json-server --watch db.json use this to start the json file server
