import { loadGame, saveGame } from "./storage.js";
import {
  enableDarkTheme,
  enableLightTheme,
  updateUI,
  applyThemeStyles,
  drawMatrix,
} from "./ui.js";
import { setupClick } from "./click.js";
import { setupEmployees, paySalaries, recalculateIncome } from "./employees.js";
import { setupUpgrades } from "./upgrades.js";
import { renderProjects, setupStrategyModal } from "./projects.js";
import { triggerRandomEvent } from "./events.js";
import { setupPrestige, setupPerkShop } from "./prestige.js";
import { state } from "./state.js";
import { setupDocumentation } from "./doc.js";
import { setupBugSystem, renderBugList } from "./bugs.js";
import { setupStatsModal } from "./stats.js";

document.addEventListener("DOMContentLoaded", () => {
  loadGame();
  recalculateIncome();
  setupDocumentation();
  setupBugSystem();
  setupStatsModal();

  if (state.theme === "dark") enableDarkTheme();
  else enableLightTheme();

  applyThemeStyles();

  setupClick();
  setupEmployees();
  setupUpgrades();
  setupPrestige();
  setupPerkShop();
  setupStrategyModal();

  updateUI();
  renderProjects();

  setInterval(() => {
    state.stats.playTimeSeconds += 1;
    saveGame();
  }, 1000);

  // Income tick
  setInterval(() => {
    let perkPassiveBonus = state.unlockedPerks.includes("passiveBoost")
      ? 1.1
      : 1;

    const passiveIncome =
      state.incomePerSec *
      state.passiveMultiplier *
      state.prestigeBonus *
      state.eventModifier *
      perkPassiveBonus;

    state.balance += passiveIncome;
    state.stats.totalMoneyEarned += passiveIncome;

    updateUI();
    renderProjects();
  }, 1000);

  // Salaries tick
  setInterval(() => {
    paySalaries();
  }, 3000);

  // Events tick
  setInterval(() => {
    triggerRandomEvent();
  }, 60000);

  // Canvas Matrix
  const canvas = document.getElementById("backgroundCanvas");
  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const fontSize = 16;
  const columns = Math.floor(width / fontSize);
  const drops = Array(columns).fill(1);

  setInterval(() => {
    drawMatrix(ctx, state.theme, width, height, drops, fontSize);
  }, 50);

  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });

  // Toggle buttons
  document
    .getElementById("toggleMatrixButton")
    .addEventListener("click", () => {
      state.matrixEnabled = !state.matrixEnabled;
      document.getElementById("backgroundCanvas").style.display =
        state.matrixEnabled ? "block" : "none";
      updateUI();
    });

  document.getElementById("toggleThemeButton").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    if (state.theme === "dark") enableDarkTheme();
    else enableLightTheme();
    applyThemeStyles();
    saveGame();
  });
});
