import { state } from "./state.js";
import { saveGame } from "./storage.js";
import { addLog, updateUI } from "./ui.js";
import { recalculateIncome } from "./employees.js";

export function setupPrestige() {
  document.getElementById("prestigeButton").addEventListener("click", () => {
    if (
      confirm("✨ Tu vas tout réinitialiser mais gagner 1 Prestige Point !")
    ) {
      state.prestigeCount += 1;
      state.prestigePoints += 1;
      hardReset();
      addLog(
        `✨ Prestige effectué ! Nouveau bonus : +${(
          (state.prestigeBonus - 1) *
          100
        ).toFixed(0)} %`
      );
    }
  });

  document.getElementById("resetButton").addEventListener("click", () => {
    if (confirm("⚠️ Tu es sûr de vouloir tout réinitialiser ?")) {
      hardReset(true);
      addLog("🗑️ Jeu réinitialisé.");
    }
  });
}

function hardReset(keepPrestige = false) {
  recalculateIncome();
  state.balance = 0;
  state.incomePerSec = 0;
  state.employees = { junior: 0, senior: 0, lead: 0, ai: 0, remote: 0 };
  state.upgrades = { click: false, passive: false };
  state.clickMultiplier = 1;
  state.passiveMultiplier = 1;
  state.eventModifier = 1;
  state.eventActive = false;
  state.activeProjects = {};
  state.selectedProject = null;
  document.getElementById("eventBanner").classList.add("hidden");

  if (keepPrestige) {
    state.prestigeBonus = 1 + state.prestigeCount * 0.5;
  } else {
    state.prestigeBonus = 1 + state.prestigeCount * 0.5;
  }

  saveGame();
  updateUI();
}

// Boutique Prestige
export function setupPerkShop() {
  const perkModal = document.getElementById("perkModal");
  const perkList = document.getElementById("perkList");
  const perkPoints = document.getElementById("perkPoints");

  document.getElementById("openPerkShop").addEventListener("click", () => {
    renderPerkShop();
    perkModal.classList.remove("hidden");
  });

  document.getElementById("closePerkModal").addEventListener("click", () => {
    perkModal.classList.add("hidden");
  });

  function renderPerkShop() {
    perkPoints.textContent = `Points disponibles : ${state.prestigePoints}`;
    perkList.innerHTML = "";

    state.availablePerks.forEach((perk) => {
      const btn = document.createElement("button");
      btn.className = `w-full flex justify-between items-center px-4 py-2 bg-black border border-purple-600 hover:bg-purple-900 rounded text-purple-300 transition`;
      btn.disabled =
        state.unlockedPerks.includes(perk.id) ||
        state.prestigePoints < perk.cost;
      btn.innerHTML = `<span>${perk.name}</span><span>${perk.cost} PP - ${perk.desc}</span>`;
      btn.addEventListener("click", () => buyPerk(perk));
      perkList.appendChild(btn);
    });
  }

  function buyPerk(perk) {
    if (
      state.prestigePoints >= perk.cost &&
      !state.unlockedPerks.includes(perk.id)
    ) {
      state.prestigePoints -= perk.cost;
      state.unlockedPerks.push(perk.id);
      addLog(`✨ Perk acheté : ${perk.name}`);
      saveGame();
      renderPerkShop();
      updateUI();
    }
  }
}
