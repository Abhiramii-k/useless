const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const annoyanceScoreEl = document.getElementById('annoyance-score');
const stopBtn = document.getElementById('stopBtn');
const snoozeBtn = document.getElementById('snoozeBtn');
const bgVideo = document.getElementById('bgVideo');

let annoyanceScore = parseInt(localStorage.getItem('annoyanceScore')) || 0;
let notificationsActive = true;
let snooze = false;
let stopClickCount = 0;

// Funny messages
const messages = [
  "😈 Stop scrolling Instagram and finish a task!",
  "📢 Your fake productivity score just went up!",
  "⏰ Reminder: Procrastination level = Master!",
  "🙃 Are you *really* working, or just pretending?",
  "🔥 Your Annoyance Score is growing. Congrats?",
  "📅 Fake meetings won’t save you, finish your tasks!"
];

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

if(addTaskBtn){
  addTaskBtn.addEventListener('click', () => {
    if(taskInput.value.trim() !== ""){
      tasks.push(taskInput.value);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      taskInput.value = "";
      renderTasks();
      increaseAnnoyance();
    }
  });
}

function renderTasks() {
  if(!taskList) return;
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerText = task;
    li.onclick = () => removeTask(index);
    taskList.appendChild(li);
  });
}

function removeTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function increaseAnnoyance() {
  annoyanceScore++;
  localStorage.setItem('annoyanceScore', annoyanceScore);
  if(annoyanceScoreEl) annoyanceScoreEl.innerText = `Annoyance Score: ${annoyanceScore}`;
}

// Desktop notifications
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

function showNotification(message) {
  if (Notification.permission === "granted") {
    new Notification("😈 Fake Productivity Assistant", {
      body: message,
      icon: "https://cdn-icons-png.flaticon.com/512/685/685352.png"
    });
  } else {
    alert(message);
  }
}

// Repeat annoying popups
setInterval(() => {
  if(notificationsActive && !snooze){
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    showNotification(randomMsg);
    increaseAnnoyance();
  }
}, 10000);

// Stop button — needs 2 clicks
if(stopBtn){
  stopBtn.addEventListener('click', () => {
    stopClickCount++;
    if(stopClickCount === 1){
      alert("😏 Nice try... click Stop again if you REALLY want peace.");
    } else if(stopClickCount === 2){
      notificationsActive = false;
      alert("✅ Fine! Notifications have finally stopped.");
    }
  });
}

// Snooze button
if(snoozeBtn){
  snoozeBtn.addEventListener('click', () => {
    snooze = true;
    setTimeout(() => snooze = false, 30000);
    alert("😴 Snoozed for 30 seconds!");
  });
}

// Make background video unstoppable
if(bgVideo){
  bgVideo.addEventListener('pause', () => bgVideo.play());
  bgVideo.addEventListener('contextmenu', e => e.preventDefault());
}
