document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const welcomeScreen = document.getElementById("welcome-screen");
  const appScreen = document.getElementById("app-screen");

  startBtn.addEventListener("click", () => {
    welcomeScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");

    // Request notification permission immediately
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        if (permission !== "granted") {
          alert("⚠️ Please enable notifications in your browser settings!");
        }
      });
    }

    // Test notification
    setTimeout(() => {
      showNotification("🎉 Welcome! Get ready for some fake productivity fun!");
    }, 2000);
  });

  let annoyanceScore = 0;
  let notificationsEnabled = true;
  const activeIntervals = [];

  const taskInput = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const calendarList = document.getElementById("calendarList");
  const scoreDisplay = document.getElementById("score");

  // Different emoji sets for messages
  const emojiSet = ["😏", "🤔", "🎯", "🛑", "🙃", "😂", "🤡", "😜", "😴", "😅"];

  // Icon set for variety
  const iconSet = [
    "https://cdn-icons-png.flaticon.com/512/742/742751.png", 
    "https://cdn-icons-png.flaticon.com/512/742/742774.png", 
    "https://cdn-icons-png.flaticon.com/512/742/742802.png", 
    "https://cdn-icons-png.flaticon.com/512/742/742780.png", 
    "https://cdn-icons-png.flaticon.com/512/742/742776.png", 
    "https://cdn-icons-png.flaticon.com/512/742/742805.png"
  ];

  function randomIcon() {
    return iconSet[Math.floor(Math.random() * iconSet.length)];
  }

  // Add Task
  addTaskBtn.addEventListener("click", () => {
    const task = taskInput.value.trim();
    const deadline = deadlineInput.value;

    if (!task) {
      alert("Add something lazybones!");
      return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
      ${task} 
      <button class="doneBtn">✔</button>
      <button class="deleteBtn">🗑</button>
    `;
    taskList.appendChild(li);

    // Fake Calendar (wrong deadline: +2 days)
    if (deadline) {
      const fakeDate = new Date(deadline);
      fakeDate.setDate(fakeDate.getDate() + 2);

      const calItem = document.createElement("li");
      calItem.textContent = `${task} — Deadline: ${fakeDate.toLocaleString()}`;
      calendarList.appendChild(calItem);

      const realDeadlineTime = new Date(deadline).getTime();
      const delay = realDeadlineTime - Date.now();

      if (delay > 0) {
        setTimeout(() => {
          if (notificationsEnabled) {
            showNotification(
              `⏰ Oops! The REAL deadline for "${task}" just passed! Hope you enjoyed missing it 😜`
            );

            // Final wrap-up alert after 30 sec
            setTimeout(() => {
              if (notificationsEnabled) {
                showNotification(`🔥 "${task}" is officially history now. Too late to save it!`);
              }
            }, 30000);

            // Keep annoying after deadline
            const lateInterval = setInterval(() => {
              if (notificationsEnabled) {
                showNotification(
                  `${randomEmoji()} "${task}" was due already! Stop pretending you're productive 🤡`
                );
              }
            }, 15000);
            activeIntervals.push(lateInterval);
          }
        }, delay);
      }
    }

    // Mark as done
    li.querySelector(".doneBtn").addEventListener("click", () => {
      li.style.textDecoration = "line-through";
      annoyanceScore += 10;
      scoreDisplay.innerText = `Annoyance Score: ${annoyanceScore}`;
      showNotification(`👏 Wow, you actually finished "${task}"! ${randomEmoji()} Miracles happen!`);
    });

    // Delete task
    li.querySelector(".deleteBtn").addEventListener("click", () => {
      li.remove();
      showNotification(`🗑 Task "${task}" deleted. ${randomEmoji()} As if you were going to finish it anyway!`);
    });

    taskInput.value = "";
    deadlineInput.value = "";
  });

  // Random Annoying Alerts
  function randomAnnoyingAlerts() {
    const messages = [
      "👀 Still here? Thought so!",
      "😏 Your deadlines are laughing at you.",
      "🤔 Maybe tomorrow… right?",
      "🎯 Procrastination Champion Award goes to YOU!",
      "🛑 Did you just blink? That doesn’t count as work!",
      "🙃 Multitasking = scrolling + procrastinating!",
      "😂 Checking the task list doesn’t finish tasks!",
      "🤡 Calendar says 'maybe later'!",
      "😜 Your to-do list is now a wish list!",
      "😅 Guess what? Still unfinished!"
    ];
    if (notificationsEnabled) {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      showNotification(msg);
    }
  }

  const activityInterval = setInterval(randomAnnoyingAlerts, 15000);
  activeIntervals.push(activityInterval);

  // Stop Notifications
  document.getElementById("stopBtn").addEventListener("click", () => {
    notificationsEnabled = false;
    activeIntervals.forEach(interval => clearInterval(interval));
    alert("😌 Notifications stopped... finally some peace!");
  });

  // Snooze
  document.getElementById("snoozeBtn").addEventListener("click", () => {
    showNotification("😴 Snoozing... enjoy your fake peace!");
  });

  // Utility: pick random emoji
  function randomEmoji() {
    return emojiSet[Math.floor(Math.random() * emojiSet.length)];
  }

  // Notification function with random icon
  function showNotification(message) {
    if (!notificationsEnabled) return;

    if (Notification.permission === "granted") {
      new Notification("Fake Productivity Assistant", { 
        body: message, 
        icon: randomIcon() // 👈 random every time
      });
    } else {
      console.log("Notification blocked:", message);
    }
  }
});
