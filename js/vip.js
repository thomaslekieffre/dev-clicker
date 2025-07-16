import { state } from "./state.js";
import { addLog } from "./ui.js";

export function trySpawnVIP() {
  const roll = Math.random();
  if (roll > 0.2) return;

  const available = state.vipProjects.filter(
    (p) => !state.projectsData.some((existing) => existing.id === p.id)
  );

  if (available.length === 0) return;

  const chosen = available[Math.floor(Math.random() * available.length)];
  state.projectsData.push(chosen);
  addLog(`🌟 Un client VIP vous contacte pour un projet exceptionnel !`);
}
