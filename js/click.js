import { state } from "./state.js";
import { addLog, showClickEffect, updateUI } from "./ui.js";
import { checkAchievements } from "./achievements.js";

export function setupClick() {
  const clickButton = document.getElementById("clickButton");
  const clickSound = new Audio("assets/click.mp3");
  clickSound.volume = 0.4;

  clickButton.addEventListener("click", () => {
    let perkClickBonus = state.unlockedPerks.includes("clickBoost") ? 1.1 : 1;
    const gain =
      1 *
      state.clickMultiplier *
      state.prestigeBonus *
      state.eventModifier *
      perkClickBonus;
    state.balance += gain;
    updateUI();
    showClickEffect(`+${gain.toFixed(0)} €`);
    clickSound.currentTime = 0;
    clickSound.play();
    addLog(`✅ Vous avez cliqué. +${gain.toFixed(0)} €`);
    checkAchievements();
  });
}
