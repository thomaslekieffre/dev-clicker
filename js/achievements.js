import { state } from "./state.js";
import { addLog, updateUI } from "./ui.js";

export function checkAchievements() {
  state.achievements.forEach((ach) => {
    if (ach.unlocked) return;

    switch (ach.id) {
      case "firstThousand":
        if (state.balance >= 1000) unlock(ach);
        break;
      case "hire10":
        const totalEmps = Object.values(state.employees).reduce(
          (a, b) => a + b,
          0
        );
        if (totalEmps >= 10) unlock(ach);
        break;
      case "deliver5":
        if (state.deliveredProjectsCount >= 5) unlock(ach);
        break;
      case "prestige1":
        if (state.prestigeCount >= 1) unlock(ach);
        break;
      case "buyUpgrade":
        if (state.upgrades.click || state.upgrades.passive) unlock(ach);
        break;
    }
  });
}

function unlock(achievement) {
  achievement.unlocked = true;
  addLog(`🏆 Succès débloqué : ${achievement.title} - ${achievement.desc}`);
  updateUI();
}
