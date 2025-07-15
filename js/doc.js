import { state } from "./state.js";

export function setupDocumentation() {
  const openBtn = document.getElementById("openDocButton");
  const closeBtn = document.getElementById("closeDocModal");
  const modal = document.getElementById("docModal");
  const content = document.getElementById("docContent");

  openBtn.addEventListener("click", () => {
    renderDoc(content);
    modal.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}

function renderDoc(container) {
  let baseHTML = `
    <p>Bienvenue sur Dev Clicker Agency.</p>
    <p>Gérez votre équipe de développeurs, produisez du code et montez en prestige !</p>
    <h4 class="font-bold mt-2">💻 Click Principal</h4>
    <p>Chaque clic vous donne des €. Les upgrades et le prestige augmentent le gain.</p>
    <h4 class="font-bold mt-2">👥 Employés</h4>
    <p>Employés achetables :</p>
    <ul class="list-disc ml-4">
      <li>Junior Dev: 0.1 €/sec</li>
      <li>Senior Dev: 1 €/sec</li>
      <li>Lead Dev: 10 €/sec</li>
      <li>AI Assistant: 100 €/sec</li>
      <li>Remote Team: 1000 €/sec</li>
    </ul>
    <h4 class="font-bold mt-2">🧪 Upgrades</h4>
    <p>Boost de production par clic ou par seconde.</p>
    <h4 class="font-bold mt-2">📂 Projets Clients</h4>
    <p>Choix de stratégie :</p>
    <ul class="list-disc ml-4">
      <li>Safe : 80% du reward, 100% succès</li>
      <li>Normal : 100% reward, 95% succès</li>
      <li>Risky : 150% reward, 50% succès</li>
    </ul>
    <h4 class="font-bold mt-2">✨ Prestige</h4>
    <p>+50% de prod par prestige. Utilise tes points pour acheter des perks uniques.</p>
    <h4 class="font-bold mt-2">🏬 Boutique Prestige</h4>
    <p>Améliorations permanentes à débloquer.</p>
    <h4 class="font-bold mt-2">🌗 Thème & Matrix</h4>
    <p>Active le mode sombre/clair et le fond Matrix personnalisable.</p>
    <p>Tout est sauvegardé automatiquement dans votre navigateur.</p>
  `;

  // Add unlocked tips
  if (state.tipsUnlocked.length > 0) {
    baseHTML += `<h4 class="font-bold mt-4 text-yellow-300">📝 Notes débloquées</h4>`;
    baseHTML += `<ul class="list-disc ml-4">`;
    state.tipsUnlocked.forEach((id) => {
      const tip = state.allTips.find((t) => t.id === id);
      if (tip) baseHTML += `<li>${tip.text}</li>`;
    });
    baseHTML += `</ul>`;
  } else {
    baseHTML += `<p class="mt-4 text-yellow-500">Aucune note débloquée pour le moment.</p>`;
  }

  container.innerHTML = baseHTML;
}

export function unlockTip(id) {
  if (!state.tipsUnlocked.includes(id)) {
    state.tipsUnlocked.push(id);
  }
}
