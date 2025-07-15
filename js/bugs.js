import { state } from "./state.js";
import { addLog, updateUI, showSaveNotice } from "./ui.js";
import { saveGame } from "./storage.js";

const BUG_FIX_COST = 100;

export function setupBugSystem() {
  // Vérifie toutes les 45 secondes si un bug apparaît
  setInterval(() => {
    tryTriggerBug();
  }, 45000);
}

function tryTriggerBug() {
  if (Math.random() < 0.35) {
    // Chance 35% d'apparition
    const bugType = Math.random() < 0.5 ? "critical" : "blocking";
    const id = `bug-${Date.now()}`;
    const description =
      bugType === "critical"
        ? "Production divisée par 2 tant que non résolu."
        : "Projet bloqué jusqu'à résolution.";

    const bug = {
      id,
      type: bugType,
      description,
      active: true,
    };

    state.bugs.push(bug);
    addLog(`🐞 Bug détecté : ${bug.description}`);

    if (bugType === "critical") {
      state.eventModifier *= 0.5;
    }

    saveGame();
    updateUI();
    showSaveNotice();
  }
}

export function resolveBug(bugId) {
  const bug = state.bugs.find((b) => b.id === bugId);
  if (!bug || !bug.active) return;

  if (state.balance < BUG_FIX_COST) {
    addLog(
      `❌ Pas assez d'argent pour résoudre le bug (coût ${BUG_FIX_COST} €).`
    );
    return;
  }

  state.balance -= BUG_FIX_COST;

  if (bug.type === "critical") {
    state.eventModifier *= 2; // rétablit la prod
  }

  bug.active = false;
  addLog(`✅ Bug résolu : ${bug.description} (-${BUG_FIX_COST} €)`);
  saveGame();
  updateUI();
}

export function renderBugList(container) {
  container.innerHTML = "";
  const activeBugs = state.bugs.filter((b) => b.active);

  if (activeBugs.length === 0) {
    container.innerHTML = "<p class='text-green-400'>Aucun bug actif 🟢</p>";
    return;
  }

  activeBugs.forEach((bug) => {
    const btn = document.createElement("button");
    btn.className =
      "w-full flex justify-between items-center px-4 py-2 bg-black border border-red-600 hover:bg-red-900 rounded shadow text-red-300 transition btn-theme";
    btn.textContent = `🐞 ${bug.description} - Résoudre (${BUG_FIX_COST} €)`;
    btn.addEventListener("click", () => resolveBug(bug.id));
    container.appendChild(btn);
  });
}
