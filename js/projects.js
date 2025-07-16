import { state } from "./state.js";
import { addLog, updateUI } from "./ui.js";
import { checkAchievements } from "./achievements.js";
import { trySpawnVIP } from "./vip.js";

export function renderProjects() {
  const container = document.getElementById("projectList");
  container.innerHTML = "";

  state.projectsData.forEach((project) => {
    if (!project.steps || !project.steps.length) {
      console.warn("⚠️ Ignoré car steps manquant ou vide :", project);
      return;
    }

    const btn = document.createElement("button");
    btn.className =
      "w-full flex justify-between items-center px-4 py-2 bg-black border border-green-600 hover:bg-green-900 rounded shadow text-green-300 transition";
    btn.id = `project-${project.id}`;

    const stateProject = state.activeProjects[project.id];
    let label = project.isVIP ? `🌟 ${project.name}` : `📂 ${project.name}`;

    if (stateProject) {
      if (stateProject.currentStep >= project.steps.length) {
        btn.textContent = `✅ ${project.name} - Livrer (+${project.reward} €)`;
      } else {
        const remaining = Math.max(
          0,
          Math.ceil(stateProject.end - Date.now() / 1000)
        );
        const currentStep = project.steps[stateProject.currentStep];
        const stepName = currentStep ? currentStep.name : "???";
        btn.textContent = `🛠️ ${project.name} ➜ ${stepName} (${remaining}s)`;
      }
    } else {
      btn.textContent = `${label} | ${project.cost} € | Gain: ${project.reward} €`;
    }

    btn.addEventListener("click", () => handleProjectClick(project));
    container.appendChild(btn);
  });
}

function handleProjectClick(project) {
  const blockingBug = state.bugs.find((b) => b.active && b.type === "blocking");
  if (blockingBug) {
    addLog(`❌ Impossible de lancer ou avancer : ${blockingBug.description}`);
    return;
  }

  if (!project.steps || !project.steps.length) {
    addLog(
      `❌ Projet mal configuré : ${project.name} n'a pas d'étapes définies.`
    );
    return;
  }

  const stateProject = state.activeProjects[project.id];

  // ✅ Livraison finale
  if (stateProject && stateProject.currentStep >= project.steps.length) {
    let reward = project.reward;
    const mode = stateProject.mode || "normal";

    if (mode === "safe") {
      reward = Math.floor(reward * 0.9);
    } else if (mode === "risky") {
      reward = Math.floor(reward * 1.5);
    }

    state.balance += reward;
    // ✅ Si c'est un projet VIP ➜ on le retire définitivement
    if (project.isVIP) {
      state.projectsData = state.projectsData.filter(
        (p) => p.id !== project.id
      );
      addLog(
        `🌟 Le projet VIP "${project.name}" est terminé. Il pourra revenir plus tard.`
      );
    }

    delete state.activeProjects[project.id];
    state.deliveredProjectsCount += 1;
    state.stats.totalMoneyEarned += reward;
    state.stats.projectsDelivered += 1;
    if (project.isVIP) {
      state.stats.vipProjectsDelivered += 1;
    }

    checkAchievements();
    trySpawnVIP();

    addLog(
      `✅ Projet livré : ${project.name} en mode ${mode}. Gain +${reward} €.`
    );
    updateUI();
    return;
  }

  // ✅ Nouveau lancement → ouvrir la modal de stratégie
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
    document.getElementById("strategyModal").classList.remove("hidden");
    addLog(`✅ Choisissez la stratégie pour ${project.name}.`);
    return;
  }

  // ✅ Avancement des étapes
  const now = Math.floor(Date.now() / 1000);
  if (now >= stateProject.end) {
    if (stateProject.currentStep >= project.steps.length) {
      addLog(
        `✅ ${project.name} est déjà prêt à être livré. Cliquez pour finaliser !`
      );
      return;
    }

    stateProject.currentStep += 1;

    // ✅ Vérification d'échec en fonction du mode
    const mode = stateProject.mode || "normal";
    const failChance = mode === "safe" ? 0 : mode === "normal" ? 10 : 50;
    const randomRoll = Math.random() * 100;

    if (randomRoll < failChance) {
      delete state.activeProjects[project.id];
      addLog(
        `❌ Le projet ${project.name} en mode ${mode} a échoué à l'étape ${stateProject.currentStep}! Vous avez perdu l'investissement.`
      );
      updateUI();
      return;
    }

    if (stateProject.currentStep < project.steps.length) {
      const nextStep = project.steps[stateProject.currentStep];
      stateProject.end = now + nextStep.duration;
      addLog(
        `🛠️ ${project.name} ➜ Étape suivante : ${nextStep.name}. Durée ${nextStep.duration}s.`
      );
    } else {
      addLog(`✅ ${project.name} prêt à être livré. Cliquez pour finaliser !`);
    }
    updateUI();
  } else {
    addLog(`⏳ ${project.name} est encore en cours. Patientez.`);
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

  if (!project.steps || !project.steps.length) {
    addLog(
      `❌ Impossible de démarrer : ${project.name} n'a pas d'étapes définies.`
    );
    closeStrategyModal();
    return;
  }

  if (state.balance < project.cost) {
    addLog(`❌ Pas assez d'argent pour ${project.name}.`);
    closeStrategyModal();
    return;
  }

  state.balance -= project.cost;

  state.activeProjects[project.id] = {
    currentStep: 0,
    end: Math.floor(Date.now() / 1000) + project.steps[0].duration,
    mode,
  };

  addLog(
    `🗂️ Projet démarré : ${project.name} en mode ${mode}. Étape ${project.steps[0].name}. Durée ${project.steps[0].duration}s.`
  );
  updateUI();
  closeStrategyModal();
}

function closeStrategyModal() {
  document.getElementById("strategyModal").classList.add("hidden");
  state.selectedProject = null;
}
