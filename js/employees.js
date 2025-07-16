import { state } from "./state.js";
import { addLog, updateUI } from "./ui.js";
import { unlockTip } from "./doc.js";
import { saveGame } from "./storage.js";
import { checkAchievements } from "./achievements.js";

export function setupEmployees() {
  document.querySelectorAll(".employee-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cost = parseInt(btn.dataset.cost);
      const income = parseFloat(btn.dataset.income);
      const type = btn.dataset.type;

      if (state.balance >= cost) {
        state.balance -= cost;
        state.incomePerSec += income;
        state.employees[type] += 1;
        recalculateIncome();
        updateUI();
        addLog(
          `🛠️ Employé acheté : ${btn.querySelector("span").textContent.trim()}`
        );
        if (type === "remote") unlockTip("remote");
        checkAchievements();
        saveGame();
      }
    });
  });
}

export function paySalaries() {
  let total = 0;
  for (let type in state.employees) {
    total += state.employees[type] * (state.employeeSalaries[type] || 0);
  }
  const reduction = state.unlockedPerks.includes("salaryReduction") ? 0.9 : 1;
  total *= reduction;
  state.balance -= total;
  if (total > 0) addLog(`💸 Salaires payés : -${total.toFixed(2)} €`);
}

export function recalculateIncome() {
  state.incomePerSec = 0;
  for (let type in state.employees) {
    const count = state.employees[type] || 0;
    const baseIncome = getIncomeForType(type);
    state.incomePerSec += count * baseIncome;
  }
}

function getIncomeForType(type) {
  switch (type) {
    case "junior":
      return 0.1;
    case "senior":
      return 1;
    case "lead":
      return 10;
    case "ai":
      return 100;
    case "remote":
      return 1000;
    default:
      return 0;
  }
}
