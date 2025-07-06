// source/gameLogic.js

// --- Variables globales ---
let score = 0;
let bonusManuel = 0;
let clicksTotale = 0;
let sonEnabled = true;
let effetEnabled = true;
const growthRate = 2;

const upgrades = {
    1: { baseCost: 10, bought: 0, cpsPerLevel: 0.1 },
    2: { baseCost: 50, bought: 0, bonusPerLevel: 1 },
    3: { baseCost: 100, bought: 0, chancePerLevel: 0.05, multiplier: 5 }
};

const emojiAmelioration = { 1: "🤖", 2: "⛏️", 3: "🍀" };

const souvenirs = {
    'souvenir01': { cost: 1000, bought: false, title: "Les Opérations Boulette", imageLocked: "source/images/souvenirs/souvenir_boulette_locked.jpg", imageUnlocked: "source/images/souvenirs/souvenir_boulette_unlocked.jpg", playAnimation: pas_fait, launchMinigame: pas_fait },
    'souvenir02': { cost: 2000, bought: false, title: "La Mort de Pierre", imageLocked: "source/images/souvenirs/souvenir_angry_birds_locked.jpg", imageUnlocked: "source/images/souvenirs/souvenir_angry_birds_unlocked.jpg", playAnimation: pas_fait, launchMinigame: pas_fait },
    'souvenir03': { cost: 5000, bought: false, title: "La Bourse de Pierre", imageLocked: "source/images/souvenirs/souvenir_default_locked.jpg", imageUnlocked: "source/images/souvenirs/souvenir_default_unlocked.jpg", playAnimation: pas_fait, launchMinigame: pas_fait },
    'souvenir04': { cost: 7500, bought: false, title: "Souvenir Mystère 04", imageLocked: "source/images/souvenirs/souvenir_default_locked.jpg", imageUnlocked: "source/images/souvenirs/souvenir_default_unlocked.jpg", playAnimation: pas_fait, launchMinigame: pas_fait },
    'souvenir05': { cost: 10000, bought: false, title: "Souvenir Mystère 05", imageLocked: "source/images/souvenirs/souvenir_default_locked.jpg", imageUnlocked: "source/images/souvenirs/souvenir_default_unlocked.jpg", playAnimation: pas_fait, launchMinigame: pas_fait },
    'souvenir06': { cost: 12000, bought: false, title: "Souvenir Mystère 06", imageLocked: "source/images/souvenirs/souvenir_default_locked.jpg", imageUnlocked: "source/images/souvenirs/souvenir_default_unlocked.jpg", playAnimation: pas_fait, launchMinigame: pas_fait },
    'souvenir07': { cost: 15000, bought: false, title: "Souvenir Mystère 07", imageLocked: "source/images/souvenirs/souvenir_default_locked.jpg", imageUnlocked: "source/images/souvenirs/souvenir_default_unlocked.jpg", playAnimation: pas_fait, launchMinigame: pas_fait },
    'souvenir08': { cost: 20000, bought: false, title: "Souvenir Mystère 08", imageLocked: "source/images/souvenirs/souvenir_default_locked.jpg", imageUnlocked: "source/images/souvenirs/souvenir_default_unlocked.jpg", playAnimation: pas_fait, launchMinigame: pas_fait },
    'souvenir09': { cost: 25000, bought: false, title: "Souvenir Mystère 09", imageLocked: "source/images/souvenirs/souvenir_default_locked.jpg", imageUnlocked: "source/images/souvenirs/souvenir_default_unlocked.jpg", playAnimation: pas_fait, launchMinigame: pas_fait },
    'souvenir10': { cost: 30000, bought: false, title: "Souvenir Mystère 10", imageLocked: "source/images/souvenirs/souvenir_default_locked.jpg", imageUnlocked: "source/images/souvenirs/souvenir_default_unlocked.jpg", playAnimation: pas_fait, launchMinigame: pas_fait }
};

// --- Fonctions principales ---
function getUpgradeCost(id) {
    const u = upgrades[id];
    return u ? Math.floor(u.baseCost * Math.pow(growthRate, u.bought)) : Infinity;
}

function acheterAmelio(id, silencieux = false) {
    const u = upgrades[id];
    if (!u) return !silencieux && alert("Amélioration introuvable !");
    const cost = getUpgradeCost(id);
    if (score >= cost) {
        score -= cost;
        u.bought++;
        reAppliquerAmeliorations();
        updateScore();
        actualiserPanneau();
    } else if (!silencieux) {
        alert(`Pas assez de 🪨 pour cette amélioration ! Coût : ${formatNumber(cost)}`);
    }
}

function acheterSouvenir(id, silencieux = false) {
    const s = souvenirs[id];
    if (!s) return !silencieux && alert("Souvenir introuvable !");
    if (score >= s.cost && !s.bought) {
        score -= s.cost;
        s.bought = true;
        updateScore();
        actualiserPanneau();
        if (!silencieux) alert(`Souvenir "${s.title}" débloqué !`);
    } else if (!silencieux) {
        alert(s.bought ? `Souvenir "${s.title}" déjà débloqué !` : `Pas assez de 🪨 pour débloquer "${s.title}" ! Coût : ${formatNumber(s.cost)}`);
    }
}

function sauvegarder() {
    const upgradesData = {}, souvenirsData = {};
    for (let id in upgrades) upgradesData[id] = upgrades[id].bought;
    for (let id in souvenirs) souvenirsData[id] = souvenirs[id].bought;
    const data = { score, bonusManuel, clicksTotale, upgrades: upgradesData, souvenirs: souvenirsData, sonEnabled, effetEnabled };
    const code = btoa(JSON.stringify(data));
    prompt("Voici ton code de sauvegarde (copie-le !) :", code);
}

function charger() {
    const code = document.getElementById("codeInput").value.trim();
    if (!code) return alert("Veuillez coller un code de sauvegarde.");
    try {
        const decoded = JSON.parse(atob(code));
        appliquerDonneesChargees(decoded);
        alert("✔️ Données restaurées !");
    } catch {
        alert("❌ Code invalide !");
    }
}

function appliquerDonneesChargees(data) {
    score = data.score || 0;
    clicksTotale = data.clicksTotale || 0;
    sonEnabled = typeof data.sonEnabled === 'boolean' ? data.sonEnabled : true;
    effetEnabled = typeof data.effetEnabled === 'boolean' ? data.effetEnabled : true;
    for (let id in upgrades) upgrades[id].bought = data.upgrades?.[id] || 0;
    for (let id in souvenirs) souvenirs[id].bought = data.souvenirs?.[id] || false;
    reAppliquerAmeliorations();
    updateScore();
    updateSettingsPanelState();
    actualiserPanneau();
}

let autoClickerIntervals = [];
function reAppliquerAmeliorations() {
    autoClickerIntervals.forEach(clearInterval);
    autoClickerIntervals = [];
    bonusManuel = 0;
    for (let id in upgrades) {
        const u = upgrades[id], count = u.bought;
        if (count > 0) {
            if (id == "1") {
                const cpsValue = u.cpsPerLevel * count;
                autoClickerIntervals.push(setInterval(() => {
                    onPrincipaleClick({ clientX: 0, clientY: 0 }, true);
                }, 1000 / cpsValue));
            } else if (id == "2") {
                bonusManuel += u.bonusPerLevel * count;
            }
        }
    }
}

// Fonctions globales
window.acheterAmelio = acheterAmelio;
window.acheterSouvenir = acheterSouvenir;
window.sauvegarder = sauvegarder;
window.charger = charger;