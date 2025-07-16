import { state } from "./state.js";

export function setupStatsModal() {
  document.getElementById("openStats").addEventListener("click", showStats);
  document.getElementById("closeStats").addEventListener("click", () => {
    document.getElementById("statsModal").classList.add("hidden");
  });
}

function showStats() {
  const content = document.getElementById("statsContent");
  content.innerHTML = `
    💰 Argent total gagné : ${state.stats.totalMoneyEarned.toFixed(0)} €<br>
    📦 Projets livrés : ${state.stats.projectsDelivered}<br>
    🌟 Projets VIP livrés : ${state.stats.vipProjectsDelivered}<br>
    🕒 Temps de jeu : ${formatTime(state.stats.playTimeSeconds)}<br>
  `;
  document.getElementById("statsModal").classList.remove("hidden");
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}
