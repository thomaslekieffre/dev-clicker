import { state } from "./state.js";
import { addLog, updateUI } from "./ui.js";

export function triggerRandomEvent() {
  if (state.eventActive) return;

  let eventChance = 0.5;
  if (state.unlockedPerks.includes("eventLuck")) {
    eventChance += 0.1;
  }

  const roll = Math.random();
  if (roll < eventChance) return;

  state.eventActive = true;

  if (roll < 0.75) {
    if (state.unlockedPerks.includes("bugImmunity")) {
      state.eventActive = false;
      return;
    }
    state.eventModifier = 0.5;
    showEventBanner("⚠️ Bug Critique ! Production divisée par 2 pendant 30s.");
    addLog("⚠️ Bug Critique déclenché !");
  } else {
    state.eventModifier = 2;
    showEventBanner("🚀 Hackathon ! Production x2 pendant 30s.");
    addLog("🚀 Hackathon déclenché !");
  }

  setTimeout(() => {
    state.eventModifier = 1;
    state.eventActive = false;
    hideEventBanner();
    addLog("🟢 L'événement est terminé.");
  }, 30000);
}

function showEventBanner(text) {
  const banner = document.getElementById("eventBanner");
  banner.textContent = text;
  banner.classList.remove("hidden");
}

function hideEventBanner() {
  const banner = document.getElementById("eventBanner");
  banner.classList.add("hidden");
}
