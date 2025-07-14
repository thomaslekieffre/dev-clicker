import { state } from "./state.js";
import { addLog, updateUI } from "./ui.js";

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
        updateUI();
        addLog(
          `🛠️ Employé acheté : ${btn.querySelector("span").textContent.trim()}`
        );
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
