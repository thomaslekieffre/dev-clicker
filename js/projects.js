import { state } from "./state.js";
import { addLog, updateUI } from "./ui.js";

export function renderProjects() {
  const container = document.getElementById("projectList");
  container.innerHTML = "";

  state.projectsData.forEach((project) => {
    const btn = document.createElement("button");
    btn.className =
      "w-full flex justify-between items-center px-4 py-2 bg-black border border-green-600 hover:bg-green-900 rounded shadow text-green-300 transition";
    btn.id = `project-${project.id}`;

    if (state.activeProjects[project.id]) {
      const remaining = Math.max(
        0,
        Math.ceil(state.activeProjects[project.id].end - Date.now() / 1000)
      );
      btn.textContent =
        remaining > 0
          ? `🛠️ ${project.name} en cours (${remaining}s)`
          : `✅ ${project.name} - Livrer (+reward)`;
    } else {
      btn.textContent = `📂 ${project.name} | ${project.cost} € | Gain: ${project.reward} €`;
    }

    btn.addEventListener("click", () => handleProjectClick(project));
    container.appendChild(btn);
  });
}

function handleProjectClick(project) {
  const stateProject = state.activeProjects[project.id];

  if (stateProject && Date.now() / 1000 >= stateProject.end) {
    const roll = Math.random();
    if (stateProject.mode === "safe") {
      state.balance += project.reward * 0.8;
      addLog(`✅ Livraison Safe : +${(project.reward * 0.8).toFixed(0)} €.`);
    } else if (stateProject.mode === "normal") {
      if (roll < 0.95) {
        state.balance += project.reward;
        addLog(`✅ Livraison Standard : +${project.reward} €.`);
      } else {
        state.balance += project.reward * 0.5;
        addLog(
          `⚠️ Bug en production ! +${(project.reward * 0.5).toFixed(0)} €.`
        );
      }
    } else if (stateProject.mode === "risky") {
      if (roll < 0.5) {
        state.balance += project.reward * 1.5;
        addLog(`🚀 Livraison Risky : +${(project.reward * 1.5).toFixed(0)} €.`);
      } else {
        state.balance += project.reward * 0.25;
        addLog(`💥 Échec Risky ! +${(project.reward * 0.25).toFixed(0)} €.`);
      }
    }
    delete state.activeProjects[project.id];
    updateUI();
    return;
  }

  if (!stateProject) {
    if (state.balance < project.cost) {
      addLog(`❌ Pas assez d'argent pour ${project.name}.`);
      return;
    }
    for (const type in project.employees) {
      if ((state.employees[type] || 0) < project.employees[type]) {
        addLog(`❌ Pas assez d'employés pour ${project.name}.`);
        return;
      }
    }
    state.selectedProject = project;
    document.getElementById(
      "strategyModalTitle"
    ).textContent = `Choisir une stratégie pour ${project.name}`;
    document.getElementById(
      "strategyModalDesc"
    ).textContent = `Coût : ${project.cost} € | Gain : ${project.reward} € | Durée : ${project.duration}s`;
    document.getElementById("strategyModal").classList.remove("hidden");
  }
}

export function setupStrategyModal() {
  document
    .getElementById("strategySafe")
    .addEventListener("click", () => chooseStrategy("safe"));
  document
    .getElementById("strategyNormal")
    .addEventListener("click", () => chooseStrategy("normal"));
  document
    .getElementById("strategyRisky")
    .addEventListener("click", () => chooseStrategy("risky"));
}

function chooseStrategy(mode) {
  const project = state.selectedProject;
  if (!project) return;

  if (state.balance < project.cost) {
    addLog(`❌ Pas assez d'argent pour ${project.name}.`);
    closeStrategyModal();
    return;
  }

  state.balance -= project.cost;
  state.activeProjects[project.id] = {
    end: Math.floor(Date.now() / 1000) + project.duration,
    mode,
  };
  addLog(
    `🗂️ Projet démarré : ${project.name} en mode ${mode}. Durée ${project.duration}s.`
  );
  updateUI();
  closeStrategyModal();
}

function closeStrategyModal() {
  document.getElementById("strategyModal").classList.add("hidden");
  state.selectedProject = null;
}
