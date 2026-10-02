# Dev Clicker Agency

Jeu incrémental dans le navigateur : cliquez pour produire du code, recrutez une équipe de développeurs, livrez des projets clients et montez en prestige.

![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-CDN-06B6D4?logo=tailwindcss&logoColor=white)

## Gameplay

- **Clic principal** — chaque clic rapporte des €, boostés par les upgrades et le prestige
- **Employés** — Junior Dev, Senior Dev, Lead Dev, AI Assistant, Remote Team : de 0,1 à 1 000 €/s
- **Upgrades** — bonus de production par clic ou par seconde
- **Projets clients** — trois stratégies : *Safe* (80 % de la récompense, succès garanti), *Normal* (100 %, 95 % de succès), *Risky* (150 %, 50 % de succès)
- **Bugs et événements aléatoires**
- **Prestige** — +50 % de production par prestige, et une boutique d'améliorations permanentes
- **Succès et statistiques**
- **Thème clair / sombre** et fond « Matrix » personnalisable
- **Sauvegarde automatique** dans le navigateur

## Lancer le jeu

Aucune dépendance ni étape de build. Le jeu utilise des modules ES : il doit être servi par un serveur HTTP local.

```bash
git clone https://github.com/thomaslekieffre/dev-clicker.git
cd dev-clicker
npx serve .
```

## Structure

```
index.html
js/
├── main.js          # point d'entrée
├── state.js         # état du jeu
├── storage.js       # sauvegarde locale
├── click.js         # clic principal
├── employees.js     # recrutement
├── upgrades.js      # améliorations
├── projects.js      # projets clients
├── bugs.js          # bugs
├── events.js        # événements aléatoires
├── prestige.js      # prestige
├── vip.js           # boutique
├── achievements.js  # succès
├── stats.js         # statistiques
├── doc.js           # aide intégrée
└── ui.js            # interface
```

---

Projet réalisé avec l'assistance de l'IA.
