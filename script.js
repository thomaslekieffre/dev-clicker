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

const employeeSalaries = {
  junior: 0.05,
  senior: 0.5,
  lead: 2,
  ai: 10,
  remote: 20,
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

let selectedProject = null;

const projectsData = [
  {
    id: "site",
    name: "Site Vitrine",
    cost: 500,
    duration: 60,
    employees: { junior: 1 },
    reward: 1000,
  },
  {
    id: "app",
    name: "App Mobile",
    cost: 5000,
    duration: 120,
    employees: { senior: 2 },
    reward: 12000,
  },
  {
    id: "saas",
    name: "SaaS Complet",
    cost: 20000,
    duration: 180,
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
  paySalaries();
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

  // Projet terminé ? On le livre
  if (state && Date.now() / 1000 >= state.end) {
    // Résoudre avec échec / succès
    const roll = Math.random();
    if (state.mode === "safe") {
      balance += project.reward * 0.8;
      addLog(`✅ Livraison Safe : +${(project.reward * 0.8).toFixed(0)} €.`);
    } else if (state.mode === "normal") {
      if (roll < 0.95) {
        balance += project.reward;
        addLog(`✅ Livraison Standard : +${project.reward} €.`);
      } else {
        balance += project.reward * 0.5;
        addLog(
          `⚠️ Bug en production ! Seulement +${(project.reward * 0.5).toFixed(
            0
          )} €.`
        );
      }
    } else if (state.mode === "risky") {
      if (roll < 0.5) {
        balance += project.reward * 1.5;
        addLog(`🚀 Livraison Risky : +${(project.reward * 1.5).toFixed(0)} €.`);
      } else {
        balance += project.reward * 0.25;
        addLog(
          `💥 Échec Risky ! Seulement +${(project.reward * 0.25).toFixed(0)} €.`
        );
      }
    }
    delete activeProjects[project.id];
    updateUI();
    return;
  }

  // Projet pas encore en cours → il faut choisir une stratégie
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

    // Ouvrir la modale UI au lieu du prompt
    selectedProject = project;
    document.getElementById(
      "strategyModalTitle"
    ).textContent = `Choisir une stratégie pour ${project.name}`;
    document.getElementById(
      "strategyModalDesc"
    ).textContent = `Coût : ${project.cost} € | Gain potentiel : ${project.reward} € | Durée : ${project.duration}s`;
    document.getElementById("strategyModal").classList.remove("hidden");
  }

  balance -= project.cost;
  activeProjects[project.id] = {
    end: Math.floor(Date.now() / 1000) + project.duration,
    mode,
  };
  addLog(
    `🗂️ Projet démarré : ${project.name} en mode ${mode}. Durée ${project.duration}s.`
  );
  updateUI();
}

document
  .getElementById("strategySafe")
  .addEventListener("click", () => chooseStrategy("safe"));
document
  .getElementById("strategyNormal")
  .addEventListener("click", () => chooseStrategy("normal"));
document
  .getElementById("strategyRisky")
  .addEventListener("click", () => chooseStrategy("risky"));

function chooseStrategy(mode) {
  if (!selectedProject) return;

  if (balance < selectedProject.cost) {
    addLog(`❌ Pas assez d'argent pour ${selectedProject.name}.`);
    closeStrategyModal();
    return;
  }

  balance -= selectedProject.cost;
  activeProjects[selectedProject.id] = {
    end: Math.floor(Date.now() / 1000) + selectedProject.duration,
    mode,
  };
  addLog(
    `🗂️ Projet démarré : ${selectedProject.name} en mode ${mode}. Durée ${selectedProject.duration}s.`
  );
  updateUI();
  closeStrategyModal();
}

function closeStrategyModal() {
  document.getElementById("strategyModal").classList.add("hidden");
  selectedProject = null;
}

function paySalaries() {
  let totalSalaries = 0;
  for (let type in employees) {
    totalSalaries += employees[type] * (employeeSalaries[type] || 0);
  }
  if (balance >= totalSalaries) {
    balance -= totalSalaries;
    if (totalSalaries > 0)
      addLog(`💸 Salaires payés : -${totalSalaries.toFixed(2)} €`);
  } else {
    balance = 0;
    addLog(`⚠️ Fonds insuffisants pour les salaires ! Vous êtes à sec.`);
  }
}

// ------------------ Démarrage ------------------
if (theme === "dark") enableDarkTheme();
else enableLightTheme();

updateUI();
