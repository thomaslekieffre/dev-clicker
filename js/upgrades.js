import { state } from "./state.js";
import { addLog, updateUI } from "./ui.js";

export function setupUpgrades() {
  document.querySelectorAll(".upgrade-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cost = parseInt(btn.dataset.cost);
      const type = btn.dataset.type;

      if (state.balance >= cost && !state.upgrades[type]) {
        state.balance -= cost;
        state.upgrades[type] = true;
        if (type === "click") state.clickMultiplier = 1.2;
        if (type === "passive") state.passiveMultiplier = 1.2;
        btn.disabled = true;
        btn.classList.add("opacity-50");
        updateUI();
        addLog(
          `🧪 Upgrade acheté : ${
            type === "click" ? "IDE Premium" : "Serveur Cloud"
          }`
        );
      }
    });
  });
}
