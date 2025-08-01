// -------------------------
// Phase 5: Useless Add-ons
// -------------------------

// Existing elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const annoyanceScoreDisplay = document.getElementById("annoyance-score");
const stopBtn = document.getElementById("stopBtn");
const snoozeBtn = document.getElementById("snoozeBtn");

// New elements for Phase 5
const leaderboard = document.createElement("div");
leaderboard.id = "leaderboard";
document.body.appendChild(leaderboard);

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let annoyanceScore = 0;
let notificationInterval;
let stopAttempts = 0;
let snoozeCount = 0;

// Task Moods
const moods = ["😴 Lazy", "😡 Angry", "😂 Dramatic", "🤔 Confused", "💅 Sassy"];

// Add fake users for leaderboard
const fakeUsers = [
  { name: "Alice", score: 120 },
  { name: "Bob", score: 90 },
  { name: "Charlie", score: 75 },
  { name: "You", score: 0 },
];

// Display leaderboard
function showLeaderboard() {
  fakeUsers[3].score = annoyanceScore; // update "You"
  fakeUsers.sort((a, b) => b.score - a.score);

  leaderboard.innerHTML = `
    <h3>🏆 Fake Productivity Leaderboard</h3>
    <ul>
      ${fakeUsers.map(u => `<li>${u.name}: ${u.score} pts</li>`).join("")}
    </ul>
  `;
}

// Update leaderboard every 10s
setInterval(showLeaderboard, 10000);

// Add Task
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("😒 Enter a task first!");
    return;
  }

  const mood = moods[Math.floor(Math.random() * moods.length)];
  tasks.push({ text: `${taskText} (${mood})`, done: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  displayTasks();
});

// Display Tasks
function displayTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span style="text-decoration: ${task.done ? 'line-through' : 'none'}">
        ${task.text}
      </span>
      <div>
        <button onclick="toggleDone(${index})">✔️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Toggle Done
window.toggleDone = function(index) {
  tasks[index].done = !tasks[index].done;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();

  if (tasks[index].done) {
    fakeReward(tasks[index].text);
    checkAchievements();
  }
};

// Delete Task
window.deleteTask = function(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
};

// -------------------------
// Random Popups
// -------------------------
setInterval(() => {
  const popups = [
    "💡 Pro Tip: Close this app and nothing gets done.",
    "😏 Still here? I admire your lack of productivity.",
    "🔥 Productivity Level: Potato",
    "😂 Breaking: Scientists confirm you’re procrastinating!"
  ];
  const randomPopup = document.createElement("div");
  randomPopup.className = "random-popup";
  randomPopup.innerText = popups[Math.floor(Math.random() * popups.length)];
  document.body.appendChild(randomPopup);

  setTimeout(() => randomPopup.remove(), 5000);
}, 15000); // every 15s

// -------------------------
// Fake Achievements
// -------------------------
function checkAchievements() {
  if (annoyanceScore >= 20) {
    showBadge("🏅 Procrastination Master");
  }
  if (tasks.filter(t => t.done).length >= 3) {
    showBadge("🎖️ Task Terminator");
  }
}

function showBadge(badge) {
  const badgePopup = document.createElement("div");
  badgePopup.className = "badge-popup";
  badgePopup.innerText = `Unlocked: ${badge}`;
  document.body.appendChild(badgePopup);

  setTimeout(() => badgePopup.remove(), 4000);
}

// -------------------------
// Continue Notifications
// -------------------------

// Reuse Phase 4 functions (showNotification, fakeReward, etc.)
