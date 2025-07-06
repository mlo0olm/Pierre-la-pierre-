// source/main.js

let clicksInLastSecond = 0;
let currentPaneau = null;
let panneauInputFocus = false;

let principale, container, scoreElement, panneauElement, contenuPanneauElement, closePaneauButton, pierreImage;
let additionalButtonsContainer, btnToggleAdditional, toggleIcon; // <-- Ajout de ces variables
const clickSounds = [];

// --- ÉCOUTEUR D'ÉVÉNEMENT DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    principale = document.getElementById("principale");
    container = document.getElementById("container");
    scoreElement = document.getElementById("score");
    panneauElement = document.getElementById("paneau");
    contenuPanneauElement = document.getElementById("contenuPanneau");
    closePaneauButton = document.getElementById("closePaneau");
    pierreImage = document.getElementById("pierre");

    // Récupération des nouveaux éléments
    additionalButtonsContainer = document.getElementById('additionalButtons'); // <-- NOUVEAU
    btnToggleAdditional = document.getElementById('btnToggleAdditional');     // <-- NOUVEAU
    toggleIcon = document.getElementById('toggleIcon');                       // <-- NOUVEAU

    for (let i = 1; i <= 7; i++) {
        const soundEl = document.getElementById(`sound${i}`);
        if (soundEl) clickSounds.push(soundEl);
    }

    principale?.addEventListener('click', onPrincipaleClick);
    closePaneauButton?.addEventListener("click", () => {
        panneauElement?.classList.remove("ouvert");
        currentPaneau = null;
        panneauInputFocus = false;
        souvenirCarouselInitialized = false;
    });

    // Écouteur pour le nouveau bouton de bascule
    btnToggleAdditional?.addEventListener('click', toggleAdditionalButtons); // <-- NOUVEAU

    setInterval(updateCPS, 1000);
});

// ... (le reste de ton main.js) ...

// onPrincipaleClick et updateCPS (s'appuient sur les variables globales)
function onPrincipaleClick(e, auto = false) {
    let gain = 1 + bonusManuel;
    let isLucky = false;
    if (!auto && upgrades[3]?.bought > 0) {
        const chance = Math.min(upgrades[3].chancePerLevel * upgrades[3].bought, 1);
        if (Math.random() < chance) {
            gain *= upgrades[3].multiplier;
            isLucky = true;
        }
    }
    afficherGain(gain, isLucky);
    if (!auto) {
        clicksTotale++;
        score += gain;
        clicksInLastSecond++;
        container?.classList.add("clicked-container");
        setTimeout(() => container?.classList.remove("clicked-container"), 100);
        if (effetEnabled) {
            for (let i = 0; i < 30; i++) createParticle(e.clientX + (Math.random() * 40 - 20), e.clientY + (Math.random() * 40 - 20));
            if (isLucky) {
                container?.classList.remove("lucky-animate");
                void container.offsetWidth;
                container?.classList.add("lucky-animate");
                createLuckyParticles(e.clientX, e.clientY);
            }
        }
        if (sonEnabled) playRandomClickSound();
    } else {
        score += gain;
    }
    updateScore();
}


function updateCPS() {
    const currentCPS = clicksInLastSecond;
    clicksInLastSecond = 0;
    // Ajoute un élément #cps dans le HTML si tu veux l'afficher
    if (typeof cpsElement !== "undefined" && cpsElement) {
        cpsElement.textContent = `CPS : ${currentCPS.toFixed(1)}`;
    }
}