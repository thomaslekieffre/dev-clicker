import { state } from "./state.js";
import { saveGame } from "./storage.js";
import { renderBugList } from "./bugs.js";

export function enableDarkTheme() {
  document.body.classList.remove("bg-white", "text-black");
  document.body.classList.add("bg-black", "text-green-400");
  document.documentElement.classList.add("dark");
}

export function enableLightTheme() {
  document.body.classList.remove("bg-black", "text-green-400");
  document.body.classList.add("bg-white", "text-black");
  document.documentElement.classList.remove("dark");
}

export function applyThemeStyles() {
  document.querySelectorAll(".btn-theme").forEach((btn) => {
    if (state.theme === "dark") {
      btn.classList.add("bg-black", "text-green-300", "border-green-600");
      btn.classList.remove("bg-white", "text-black", "border-black");
    } else {
      btn.classList.add("bg-white", "text-black", "border-black");
      btn.classList.remove("bg-black", "text-green-300", "border-green-600");
    }
  });
}

export function updateToggleButtons() {
  document.getElementById("toggleMatrixButton").textContent =
    state.matrixEnabled ? "🌌" : "❌";
  document.getElementById("toggleThemeButton").textContent =
    state.theme === "dark" ? "🌗" : "🌑";
}

export function updateUI() {
  const balanceEl = document.getElementById("balance");
  const incomeEl = document.getElementById("income");
  const prestigeEl = document.getElementById("prestige");

  let perkPassiveBonus = state.unlockedPerks.includes("passiveBoost") ? 1.1 : 1;
  balanceEl.textContent = `💶 ${state.balance.toFixed(0)} €`;
  incomeEl.textContent = `Revenu passif : ${(
    state.incomePerSec *
    state.passiveMultiplier *
    state.prestigeBonus *
    state.eventModifier *
    perkPassiveBonus
  ).toFixed(1)} €/sec`;
  prestigeEl.textContent = `Prestige : ${state.prestigeCount} (+${(
    (state.prestigeBonus - 1) *
    100
  ).toFixed(0)} % bonus)`;

  document.querySelectorAll(".employee-count").forEach((span) => {
    const type = span.dataset.type;
    span.textContent = state.employees[type] || 0;
  });

  document.querySelectorAll(".upgrade-btn").forEach((btn) => {
    const type = btn.dataset.type;
    if (state.upgrades[type]) {
      btn.disabled = true;
      btn.classList.add("opacity-50");
    }
  });

  if (state.balance >= 1000000) {
    const prestigeButton = document.getElementById("prestigeButton");
    prestigeButton.disabled = false;
    prestigeButton.classList.remove("opacity-50", "cursor-not-allowed");
    prestigeButton.classList.add("hover:bg-purple-700");
  } else {
    const prestigeButton = document.getElementById("prestigeButton");
    prestigeButton.disabled = true;
    prestigeButton.classList.add("opacity-50", "cursor-not-allowed");
    prestigeButton.classList.remove("hover:bg-purple-700");
  }

  document.getElementById("backgroundCanvas").style.display =
    state.matrixEnabled ? "block" : "none";

  renderBugList(document.getElementById("bugList"));

  applyThemeStyles();
  updateToggleButtons();
  renderAchievements();
  saveGame();
}

export function addLog(message) {
  const logConsole = document.getElementById("logConsole");
  const line = document.createElement("div");
  line.textContent = message;
  logConsole.appendChild(line);
  logConsole.scrollTop = logConsole.scrollHeight;
}

export function showClickEffect(text) {
  const el = document.createElement("div");
  el.textContent = text;
  el.className = `
    absolute left-1/2 transform -translate-x-1/2 font-bold animate-fadeUp
    ${state.theme === "dark" ? "text-green-400" : "text-black"}
  `;
  document.getElementById("clickEffects").appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

export function showSaveNotice() {
  const notice = document.getElementById("saveNotice");
  notice.classList.remove("hidden");
  clearTimeout(notice.timeoutId);
  notice.timeoutId = setTimeout(() => {
    notice.classList.add("hidden");
  }, 2000);
}

export function drawMatrix(ctx, theme, width, height, drops, fontSize) {
  if (!state.matrixEnabled) return;
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = theme === "dark" ? "#00FF00" : "#008800";
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

export function renderAchievements() {
  const container = document.getElementById("achievementsList");
  container.innerHTML = "";
  state.achievements.forEach((ach) => {
    const div = document.createElement("div");
    div.className = ach.unlocked
      ? "border border-green-500 px-2 py-1 rounded text-green-300"
      : "border border-green-800 px-2 py-1 rounded text-green-700 opacity-50";
    div.textContent = `🏅 ${ach.title} - ${ach.desc}`;
    container.appendChild(div);
  });
}
