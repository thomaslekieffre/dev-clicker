// ------------------ État du joueur ------------------
let balance = 0;
let incomePerSec = 0;
let prestigeCount = 0;
let prestigeBonus = 1;

let employees = {
  junior: 0,
  senior: 0,
  lead: 0,
  ai: 0,
  remote: 0,
};

let upgrades = {
  click: false,
  passive: false,
};

let clickMultiplier = 1;
let passiveMultiplier = 1;

let eventActive = false;
let eventModifier = 1;
let eventTimeout = null;

let matrixEnabled = true;
let theme = "dark";

const projectsData = [
  {
    id: "site",
    name: "Site Vitrine",
    cost: 500,
    duration: 10,
    employees: { junior: 1 },
    reward: 1000,
  },
  {
    id: "app",
    name: "App Mobile",
    cost: 5000,
    duration: 30,
    employees: { senior: 2 },
    reward: 12000,
  },
  {
    id: "saas",
    name: "SaaS Complet",
    cost: 20000,
    duration: 60,
    employees: { lead: 1 },
    reward: 60000,
  },
  {
    id: "ai",
    name: "IA sur mesure",
    cost: 50000,
    duration: 120,
    employees: { ai: 1 },
    reward: 150000,
  },
];
let activeProjects = {};

// --------- Son effet ----------
const clickSound = new Audio("click.mp3");
clickSound.volume = 0.4;

// ------------------ Chargement localStorage ------------------
if (localStorage.getItem("saveData")) {
  const save = JSON.parse(localStorage.getItem("saveData"));
  balance = save.balance || 0;
  incomePerSec = save.incomePerSec || 0;
  employees = save.employees || {
    junior: 0,
    senior: 0,
    lead: 0,
    ai: 0,
    remote: 0,
  };
  upgrades = save.upgrades || { click: false, passive: false };
  prestigeCount = save.prestigeCount || 0;
  matrixEnabled = save.matrixEnabled !== false;
  theme = save.theme || "dark";
  prestigeBonus = 1 + prestigeCount * 0.5;
  activeProjects = save.activeProjects || {};

  if (upgrades.click) clickMultiplier = 1.2;
  if (upgrades.passive) passiveMultiplier = 1.2;
}

// ------------------ Sélecteurs DOM ------------------
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const prestigeEl = document.getElementById("prestige");
const eventBanner = document.getElementById("eventBanner");
const clickButton = document.getElementById("clickButton");
const employeeButtons = document.querySelectorAll(".employee-btn");
const upgradeButtons = document.querySelectorAll(".upgrade-btn");
const resetButton = document.getElementById("resetButton");
const prestigeButton = document.getElementById("prestigeButton");
const clickEffectsContainer = document.getElementById("clickEffects");
const logConsole = document.getElementById("logConsole");
const toggleMatrixButton = document.getElementById("toggleMatrixButton");
const toggleThemeButton = document.getElementById("toggleThemeButton");
const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");

// ------------------ Journal de logs ------------------
function addLog(message) {
  const line = document.createElement("div");
  line.textContent = message;
  logConsole.appendChild(line);
  logConsole.scrollTop = logConsole.scrollHeight;
}

// ------------------ UI & Thème ------------------
function updateUI() {
  balanceEl.textContent = `💶 ${balance.toFixed(0)} €`;
  incomeEl.textContent = `Revenu passif : ${(
    incomePerSec *
    passiveMultiplier *
    prestigeBonus *
    eventModifier
  ).toFixed(1)} €/sec`;
  prestigeEl.textContent = `Prestige : ${prestigeCount} (+${(
    (prestigeBonus - 1) *
    100
  ).toFixed(0)} % bonus)`;

  document.querySelectorAll(".employee-count").forEach((span) => {
    const type = span.dataset.type;
    span.textContent = employees[type] || 0;
  });

  upgradeButtons.forEach((btn) => {
    const type = btn.dataset.type;
    if (upgrades[type]) {
      btn.disabled = true;
      btn.classList.add("opacity-50");
    }
  });

  if (balance >= 1000000) {
    prestigeButton.disabled = false;
    prestigeButton.classList.remove("opacity-50", "cursor-not-allowed");
    prestigeButton.classList.add("hover:bg-purple-700");
  } else {
    prestigeButton.disabled = true;
    prestigeButton.classList.add("opacity-50", "cursor-not-allowed");
    prestigeButton.classList.remove("hover:bg-purple-700");
  }

  canvas.style.display = matrixEnabled ? "block" : "none";
  updateToggleButtons();
  saveGame();
}

function enableDarkTheme() {
  document.body.classList.remove("bg-white", "text-black");
  document.body.classList.add("bg-black", "text-green-400");
  document.documentElement.classList.add("dark");
}

function enableLightTheme() {
  document.body.classList.remove("bg-black", "text-green-400");
  document.body.classList.add("bg-white", "text-black");
  document.documentElement.classList.remove("dark");
}

function updateToggleButtons() {
  toggleMatrixButton.textContent = matrixEnabled ? "🌌" : "❌";
  toggleThemeButton.textContent = theme === "dark" ? "🌗" : "🌑";
}

// ------------------ Sauvegarde ------------------
function saveGame() {
  const saveData = {
    balance,
    incomePerSec,
    employees,
    upgrades,
    prestigeCount,
    matrixEnabled,
    theme,
    activeProjects,
  };
  localStorage.setItem("saveData", JSON.stringify(saveData));
  showSaveNotice();
}

// ------------------ Effet +1€ animé ------------------
function showClickEffect(text) {
  const el = document.createElement("div");
  el.textContent = text;
  el.className = `
    absolute left-1/2 transform -translate-x-1/2 text-green-400 font-bold
    animate-fadeUp
  `;
  clickEffectsContainer.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

// ------------------ Clic principal ------------------
clickButton.addEventListener("click", () => {
  const gain = 1 * clickMultiplier * prestigeBonus * eventModifier;
  balance += gain;
  updateUI();
  showClickEffect(`+${gain.toFixed(0)} €`);
  clickSound.currentTime = 0;
  clickSound.play();
  addLog(`✅ Vous avez cliqué. +${gain.toFixed(0)} €`);
});

// ------------------ Achat employés ------------------
employeeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const cost = parseInt(btn.dataset.cost);
    const income = parseFloat(btn.dataset.income);
    const type = btn.dataset.type;

    if (balance >= cost) {
      balance -= cost;
      incomePerSec += income;
      employees[type] += 1;
      updateUI();
      addLog(
        `🛠️ Employé acheté : ${btn.querySelector("span").textContent.trim()}`
      );
    }
  });
});

// ------------------ Revenus passifs automatiques ------------------
setInterval(() => {
  balance += incomePerSec * passiveMultiplier * prestigeBonus * eventModifier;
  updateUI();
  renderProjects();
}, 1000);

// ------------------ Achat upgrades ------------------
upgradeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const cost = parseInt(btn.dataset.cost);
    const type = btn.dataset.type;

    if (balance >= cost && !upgrades[type]) {
      balance -= cost;
      upgrades[type] = true;
      if (type === "click") clickMultiplier = 1.2;
      if (type === "passive") passiveMultiplier = 1.2;
      btn.disabled = true;
      btn.classList.add("opacity-50");
      updateUI();
      addLog(
        `🧪 Upgrade acheté : ${
          type === "click" ? "IDE Premium" : "Serveur Cloud"
        }`
      );
    }
  });
});

// ------------------ Reset ------------------
resetButton.addEventListener("click", () => {
  if (confirm("⚠️ Tu es sûr de vouloir tout réinitialiser ?")) {
    balance = 0;
    incomePerSec = 0;
    employees = { junior: 0, senior: 0, lead: 0, ai: 0, remote: 0 };
    upgrades = { click: false, passive: false };
    clickMultiplier = 1;
    passiveMultiplier = 1;
    prestigeBonus = 1 + prestigeCount * 0.5;
    eventModifier = 1;
    eventActive = false;
    eventBanner.classList.add("hidden");
    localStorage.removeItem("saveData");
    updateUI();
    addLog("🗑️ Jeu réinitialisé.");
  }
});

// ------------------ Prestige ------------------
prestigeButton.addEventListener("click", () => {
  if (
    confirm(
      "✨ Tu vas tout réinitialiser mais gagner +50% de bonus permanent !"
    )
  ) {
    prestigeCount += 1;
    prestigeBonus = 1 + prestigeCount * 0.5;
    balance = 0;
    incomePerSec = 0;
    employees = { junior: 0, senior: 0, lead: 0, ai: 0, remote: 0 };
    upgrades = { click: false, passive: false };
    clickMultiplier = 1;
    passiveMultiplier = 1;
    eventModifier = 1;
    eventActive = false;
    eventBanner.classList.add("hidden");
    saveGame();
    updateUI();
    addLog(
      `✨ Prestige effectué ! Nouveau bonus : +${(
        (prestigeBonus - 1) *
        100
      ).toFixed(0)} %`
    );
  }
});

// ------------------ Events aléatoires ------------------
function triggerRandomEvent() {
  if (eventActive) return;
  const roll = Math.random();
  if (roll < 0.5) return;
  eventActive = true;
  if (roll < 0.75) {
    eventModifier = 2;
    eventBanner.textContent = "🚀 Hackathon ! Production x2 pendant 30s.";
    eventBanner.classList.remove("hidden");
    addLog("🚀 Hackathon déclenché !");
  } else {
    eventModifier = 0.5;
    eventBanner.textContent =
      "⚠️ Bug Critique ! Production divisée par 2 pendant 30s.";
    eventBanner.classList.remove("hidden");
    addLog("⚠️ Bug Critique déclenché !");
  }
  eventTimeout = setTimeout(() => {
    eventModifier = 1;
    eventActive = false;
    eventBanner.classList.add("hidden");
    addLog("🟢 L'événement est terminé.");
  }, 30000);
}

setInterval(() => {
  triggerRandomEvent();
}, 60000);

// ------------------ Toggle Matrix ------------------
toggleMatrixButton.addEventListener("click", () => {
  matrixEnabled = !matrixEnabled;
  canvas.style.display = matrixEnabled ? "block" : "none";
  updateToggleButtons();
  saveGame();
});

// ------------------ Toggle Theme ------------------
toggleThemeButton.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  if (theme === "dark") enableDarkTheme();
  else enableLightTheme();
  saveGame();
});

// ------------------ Background Matrix Animation ------------------
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const fontSize = 16;
const columns = Math.floor(width / fontSize);
const drops = Array(columns).fill(1);

function drawMatrix() {
  if (!matrixEnabled) return;
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#00FF00";
  ctx.font = `${fontSize}px monospace`;
  for (let i = 0; i < drops.length; i++) {
    const text = String.fromCharCode(0x30a0 + Math.random() * 96);
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(drawMatrix, 50);

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

function showSaveNotice() {
  const notice = document.getElementById("saveNotice");
  notice.classList.remove("hidden");
  clearTimeout(notice.timeoutId);
  notice.timeoutId = setTimeout(() => {
    notice.classList.add("hidden");
  }, 2000);
}

function renderProjects() {
  const container = document.getElementById("projectList");
  container.innerHTML = "";

  projectsData.forEach((project) => {
    const btn = document.createElement("button");
    btn.className =
      "w-full flex justify-between items-center px-4 py-2 bg-black border border-green-600 hover:bg-green-900 rounded shadow text-green-300 transition";
    btn.id = `project-${project.id}`;

    if (activeProjects[project.id]) {
      const remaining = Math.max(
        0,
        Math.ceil(activeProjects[project.id].end - Date.now() / 1000)
      );
      btn.textContent =
        remaining > 0
          ? `🛠️ ${project.name} en cours (${remaining}s)`
          : `✅ ${project.name} - Livrer (+${project.reward} €)`;
    } else {
      btn.textContent = `📂 ${project.name} | ${project.cost} € | Gain: ${project.reward} €`;
    }

    btn.addEventListener("click", () => handleProjectClick(project));
    container.appendChild(btn);
  });
}

function handleProjectClick(project) {
  const state = activeProjects[project.id];

  if (!state) {
    if (balance < project.cost) {
      addLog(`❌ Pas assez d'argent pour ${project.name}.`);
      return;
    }

    for (const type in project.employees) {
      if ((employees[type] || 0) < project.employees[type]) {
        addLog(`❌ Pas assez d'employés pour ${project.name}.`);
        return;
      }
    }

    balance -= project.cost;
    activeProjects[project.id] = {
      end: Math.floor(Date.now() / 1000) + project.duration,
    };
    addLog(`🗂️ Projet démarré : ${project.name}. Durée ${project.duration}s.`);
  } else if (Date.now() / 1000 >= state.end) {
    balance += project.reward;
    delete activeProjects[project.id];
    addLog(`✅ Projet livré : ${project.name}. Gain +${project.reward} €.`);
  }

  updateUI();
}

// ------------------ Démarrage ------------------
if (theme === "dark") enableDarkTheme();
else enableLightTheme();

updateUI();
