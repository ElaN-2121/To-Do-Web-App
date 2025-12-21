const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskDesc = document.getElementById("task-desc");
const taskCategory = document.getElementById("task-category");
const taskDate = document.getElementById("task-date");
const todoList = document.getElementById("todo-list");
const searchInput = document.querySelector(".search-input");
const API_URL = "http://localhost:3000/todos";

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
  tasks.forEach((task) => {
    if (!task.completed) {
      const taskCard = document.createElement("div");
      taskCard.className = "task-card";
      taskCard.innerHTML = `
                <div class="check-circle"></div>
                <div class="task-details">
                    <div class="task-title">${task.title}</div>
                    <div class="task-desc">${task.description}</div>
                    <div class="due-date">${task.category} | Due: ${task.dueDate}</div>
                </div>
            `;
      todoList.appendChild(taskCard);
    }
  });
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
