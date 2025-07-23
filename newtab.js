document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.getElementById("tasks");
  const newTaskInput = document.getElementById("new-task");
  const addBtn = document.getElementById("add-btn");
  const searchInput = document.getElementById("search");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const clearCompletedBtn = document.getElementById("clear-completed");
  const taskCountSpan = document.getElementById("task-count");
  const themeBtn = document.getElementById("theme-btn");

  // Background elements
  const bgSettingsBtn = document.getElementById("bg-settings-btn");
  const bgSettings = document.getElementById("bg-settings");
  const closeBgSettings = document.getElementById("close-bg-settings");
  const bgOptions = document.querySelectorAll(".bg-option");
  const bgUpload = document.getElementById("bg-upload");
  const uploadBtn = document.getElementById("upload-btn");
  const removeCustomBtn = document.getElementById("remove-custom-btn");
  const bgOpacity = document.getElementById("bg-opacity");
  const opacityValue = document.getElementById("opacity-value");
  const backgroundOverlay = document.querySelector(".background-overlay");

  let tasks = [];
  let currentFilter = "all";
  let currentBackground = "none";
  let customBackground = null;

  // Load saved data
  chrome.storage.local.get(["tasks", "background", "customBackground", "bgOpacity", "theme"], (data) => {
    tasks = data.tasks || [];
    currentBackground = data.background || "none";
    customBackground = data.customBackground || null;
    
    if (data.bgOpacity) {
      bgOpacity.value = data.bgOpacity;
      opacityValue.textContent = data.bgOpacity + "%";
      updateBackgroundOpacity(data.bgOpacity);
    }
    
    if (data.theme) {
      document.documentElement.setAttribute("data-theme", data.theme);
      themeBtn.textContent = data.theme === "light" ? "🌙" : "☀️";
    }
    
    applyBackground();
    updateActiveBackgroundOption();
    renderTasks();
  });

  // Background Settings Panel
  bgSettingsBtn.addEventListener("click", () => {
    bgSettings.style.display = bgSettings.style.display === "none" ? "block" : "none";
  });

  closeBgSettings.addEventListener("click", () => {
    bgSettings.style.display = "none";
  });

  // Click outside to close settings
  document.addEventListener("click", (e) => {
    if (!bgSettings.contains(e.target) && !bgSettingsBtn.contains(e.target)) {
      bgSettings.style.display = "none";
    }
  });

  // Background option selection
  bgOptions.forEach(option => {
    option.addEventListener("click", () => {
      const bgValue = option.dataset.bg;
      currentBackground = bgValue;
      applyBackground();
      updateActiveBackgroundOption();
      saveBackgroundSettings();
    });
  });

  // Custom background upload
  uploadBtn.addEventListener("click", () => {
    bgUpload.click();
  });

  bgUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        customBackground = e.target.result;
        currentBackground = "custom";
        applyBackground();
        updateActiveBackgroundOption();
        saveBackgroundSettings();
        removeCustomBtn.style.display = "inline-block";
      };
      reader.readAsDataURL(file);
    }
  });

  // Remove custom background
  removeCustomBtn.addEventListener("click", () => {
    customBackground = null;
    if (currentBackground === "custom") {
      currentBackground = "none";
      applyBackground();
      updateActiveBackgroundOption();
    }
    removeCustomBtn.style.display = "none";
    saveBackgroundSettings();
  });

  // Background opacity control
  bgOpacity.addEventListener("input", (e) => {
    const opacity = e.target.value;
    opacityValue.textContent = opacity + "%";
    updateBackgroundOpacity(opacity);
    saveBackgroundSettings();
  });

  // Apply background image
  function applyBackground() {
    const body = document.body;
    
    if (currentBackground === "none") {
      body.style.backgroundImage = "";
    } else if (currentBackground === "custom" && customBackground) {
      body.style.backgroundImage = `url('${customBackground}')`;
      removeCustomBtn.style.display = "inline-block";
    } else if (currentBackground !== "none") {
      body.style.backgroundImage = `url('images/${currentBackground}')`;
    }

    // Show/hide custom background remove button
    if (customBackground) {
      removeCustomBtn.style.display = "inline-block";
    }
  }

  // Update background opacity
  function updateBackgroundOpacity(opacity) {
    const normalizedOpacity = (100 - opacity) / 100;
    backgroundOverlay.style.opacity = normalizedOpacity;
  }

  // Update active background option visual
  function updateActiveBackgroundOption() {
    bgOptions.forEach(option => {
      option.classList.remove("active");
      if (option.dataset.bg === currentBackground) {
        option.classList.add("active");
      }
    });
  }

  // Save background settings
  function saveBackgroundSettings() {
    chrome.storage.local.set({
      background: currentBackground,
      customBackground: customBackground,
      bgOpacity: bgOpacity.value
    });
  }

  // Add new task
  addBtn.addEventListener("click", () => {
    const text = newTaskInput.value.trim();
    if (text) {
      tasks.push({ id: Date.now(), text, completed: false });
      saveTasks();
      newTaskInput.value = "";
    }
  });

  // Also add task on Enter key press
  newTaskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addBtn.click();
    }
  });

  // Render tasks
  function renderTasks() {
    let filteredTasks = [...tasks];

    if (currentFilter === "active") {
      filteredTasks = tasks.filter((t) => !t.completed);
    } else if (currentFilter === "completed") {
      filteredTasks = tasks.filter((t) => t.completed);
    }

    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      filteredTasks = filteredTasks.filter((t) =>
        t.text.toLowerCase().includes(searchTerm)
      );
    }

    taskList.innerHTML = "";

    if (filteredTasks.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.className = "empty-state";
      emptyMsg.textContent = "No tasks found.";
      taskList.appendChild(emptyMsg);
      updateTaskCount();
      return;
    }

    filteredTasks.forEach((task) => {
      const taskEl = document.createElement("div");
      taskEl.className = `task ${task.completed ? "completed" : ""}`;
      taskEl.draggable = true;
      taskEl.dataset.id = task.id;

      taskEl.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""}>
        <span>${task.text}</span>
        <button class="delete">×</button>
      `;

      taskList.appendChild(taskEl);

      // Toggle completion
      const checkbox = taskEl.querySelector("input");
      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks();
      });

      // Delete task
      const deleteBtn = taskEl.querySelector(".delete");
      deleteBtn.addEventListener("click", () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTasks();
      });

      // Edit task (double-click)
      const textSpan = taskEl.querySelector("span");
      textSpan.addEventListener("dblclick", () => {
        const newText = prompt("Edit task:", task.text);
        if (newText) {
          task.text = newText.trim();
          saveTasks();
        }
      });

      // Drag and drop
      taskEl.addEventListener("dragstart", () => {
        taskEl.classList.add("dragging");
      });

      taskEl.addEventListener("dragend", () => {
        taskEl.classList.remove("dragging");
        updateTaskOrder();
      });
    });

    updateTaskCount();
  }

  // Update task count display
  function updateTaskCount() {
    if (tasks.length === 0) {
      taskCountSpan.textContent = "No tasks yet";
    } else {
      const completed = tasks.filter((t) => t.completed).length;
      taskCountSpan.textContent = `${completed} / ${tasks.length} tasks done`;
    }
  }

  // Save tasks
  function saveTasks() {
    chrome.storage.local.set({ tasks }, () => renderTasks());
  }

  // Update task order after drag/drop
  function updateTaskOrder() {
    const newOrder = Array.from(taskList.children).map((el) => {
      const id = parseInt(el.dataset.id);
      return tasks.find((t) => t.id === id);
    });
    tasks = newOrder.filter(Boolean);
    saveTasks();
  }

  // Search
  searchInput.addEventListener("input", () => {
    renderTasks();
  });

  // Filters (All / Active / Completed)
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.filter;
      if (type) {
        currentFilter = type;

        // Highlight active filter
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        renderTasks();
      }
    });
  });

  // Remove all completed tasks
  clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => !t.completed);
    saveTasks();
  });

  // Drag and drop logic
  taskList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const draggingEl = document.querySelector(".dragging");
    const afterEl = getDragAfterElement(taskList, e.clientY);
    if (afterEl) {
      taskList.insertBefore(draggingEl, afterEl);
    } else {
      taskList.appendChild(draggingEl);
    }
  });

  function getDragAfterElement(container, y) {
    const elements = [...container.querySelectorAll(".task:not(.dragging)")];
    return elements.reduce(
      (closest, el) => {
        const box = el.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: el };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  // Theme toggle
  themeBtn.addEventListener("click", () => {
    const isLight =
      document.documentElement.getAttribute("data-theme") === "light";
    const newTheme = isLight ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    themeBtn.textContent = isLight ? "☀️" : "🌙";
    
    // Save theme preference
    chrome.storage.local.set({ theme: newTheme });
  });
});