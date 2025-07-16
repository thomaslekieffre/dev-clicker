export let state = {
  balance: 0,
  incomePerSec: 0,
  prestigeCount: 0,
  prestigePoints: 0,
  prestigeBonus: 1,

  employees: {
    junior: 0,
    senior: 0,
    lead: 0,
    ai: 0,
    remote: 0,
  },

  upgrades: {
    click: false,
    passive: false,
  },

  clickMultiplier: 1,
  passiveMultiplier: 1,
  deliveredProjectsCount: 0,
  unlockedPerks: [],
  eventActive: false,
  eventModifier: 1,
  matrixEnabled: true,
  theme: "dark",
  selectedProject: null,
  activeProjects: {},
  bugs: [],

  // ✅ Projets NORMAUX (disponibles au début)
  projectsData: [
    {
      id: "site",
      name: "Site Vitrine",
      cost: 500,
      reward: 1000,
      employees: { junior: 1 },
      steps: [
        { name: "Design", duration: 5 },
        { name: "Dev", duration: 10 },
        { name: "Test", duration: 5 },
        { name: "Deploy", duration: 3 },
      ],
      isVIP: false,
    },
    {
      id: "app",
      name: "App Mobile",
      cost: 5000,
      reward: 12000,
      employees: { senior: 2 },
      steps: [
        { name: "Design", duration: 8 },
        { name: "Dev", duration: 20 },
        { name: "Test", duration: 10 },
        { name: "Deploy", duration: 5 },
      ],
      isVIP: false,
    },
    {
      id: "saas",
      name: "SaaS Complet",
      cost: 20000,
      reward: 60000,
      employees: { lead: 1 },
      steps: [
        { name: "Design", duration: 12 },
        { name: "Dev", duration: 30 },
        { name: "Test", duration: 15 },
        { name: "Deploy", duration: 8 },
      ],
      isVIP: false,
    },
  ],

  // ✅ Projets VIP (non dispos au départ)
  vipProjects: [
    {
      id: "vipEcommerce",
      name: "🌟 E-commerce International (VIP)",
      cost: 40000,
      reward: 100000,
      employees: { lead: 2, ai: 1 },
      steps: [
        { name: "Design", duration: 20 },
        { name: "Dev", duration: 40 },
        { name: "Test", duration: 25 },
        { name: "Deploy", duration: 10 },
      ],
      isVIP: true,
    },
    {
      id: "vipAppEnterprise",
      name: "🌟 App Mobile Enterprise (VIP)",
      cost: 70000,
      reward: 250000,
      employees: { lead: 3, ai: 2, remote: 1 },
      steps: [
        { name: "Design", duration: 40 },
        { name: "Dev", duration: 60 },
        { name: "Test", duration: 40 },
        { name: "Deploy", duration: 20 },
      ],
      isVIP: true,
    },
  ],

  employeeSalaries: {
    junior: 0.05,
    senior: 0.5,
    lead: 2,
    ai: 10,
    remote: 20,
  },

  availablePerks: [
    {
      id: "clickBoost",
      name: "Boost Clic",
      cost: 1,
      desc: "+10% €/clic permanent",
    },
    {
      id: "passiveBoost",
      name: "Boost Passif",
      cost: 1,
      desc: "+10% €/sec permanent",
    },
    {
      id: "eventLuck",
      name: "Événements Positifs",
      cost: 2,
      desc: "+10% chance Hackathon",
    },
    {
      id: "salaryReduction",
      name: "Réduction Salaires",
      cost: 3,
      desc: "-10% sur salaires",
    },
    {
      id: "bugImmunity",
      name: "Production Stable",
      cost: 2,
      desc: "Immunité aux bugs critiques",
    },
  ],

  tipsUnlocked: [],
  allTips: [
    {
      id: "salary",
      text: "💸 Les salaires sont payés chaque seconde. Planifie tes coûts !",
    },
    {
      id: "risk",
      text: "⚠️ Les projets Risky peuvent te ruiner ou te rendre riche.",
    },
    {
      id: "perks",
      text: "✨ Utilise tes points de prestige pour acheter des perks stratégiques.",
    },
    {
      id: "bugs",
      text: "🐞 Les événements critiques réduisent ta production.",
    },
    {
      id: "matrix",
      text: "🌌 Le fond Matrix est purement esthétique. Mais il en impose.",
    },
    {
      id: "remote",
      text: "🌍 Les équipes Remote coûtent cher mais rapportent beaucoup.",
    },
  ],

  achievements: [
    {
      id: "firstThousand",
      title: "Premier Millier",
      desc: "Atteindre 1000 €",
      unlocked: false,
    },
    {
      id: "hire10",
      title: "Manager",
      desc: "Embaucher 10 employés",
      unlocked: false,
    },
    {
      id: "deliver5",
      title: "Livraison Express",
      desc: "Livrer 5 projets clients",
      unlocked: false,
    },
    {
      id: "prestige1",
      title: "Nouveau Départ",
      desc: "Faire un prestige",
      unlocked: false,
    },
    {
      id: "buyUpgrade",
      title: "Tech Upgrade",
      desc: "Acheter une amélioration",
      unlocked: false,
    },
  ],
};
