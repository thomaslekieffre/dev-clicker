import { state } from "./state.js";

export function saveGame() {
  localStorage.setItem("saveData", JSON.stringify(state));
}

export function loadGame() {
  const save = JSON.parse(localStorage.getItem("saveData"));
  if (save) {
    Object.assign(state, save);
    state.prestigeBonus = 1 + state.prestigeCount * 0.5;
    if (state.upgrades.click) state.clickMultiplier = 1.2;
    if (state.upgrades.passive) state.passiveMultiplier = 1.2;
    state.bugs = state.bugs || [];
  }
}
