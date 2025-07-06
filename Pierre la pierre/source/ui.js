// source/ui.js


let souvenirCarouselInitialized = false;

function updateScore() {
    if (scoreElement) {
        scoreElement.textContent = "Score : " + formatNumber(score);
    }
}

function afficherGain(gain, isLucky = false) {
    if (!scoreElement) return;
    const gainEl = document.createElement("span");
    gainEl.textContent = `+${formatNumber(gain)}`;
    gainEl.className = isLucky ? "gain-popup-glow" : "gain-popup";
    const rect = scoreElement.getBoundingClientRect();
    gainEl.style.left = `${(rect.left + rect.width / 2) + (Math.random() * 40 - 20)}px`;
    gainEl.style.top = `${rect.top - 20}px`;
    document.body.appendChild(gainEl);
    setTimeout(() => {
        gainEl.style.transform = "translateY(-30px)";
        gainEl.style.opacity = "0";
    }, 10);
    setTimeout(() => {
        gainEl.remove();
    }, 800);
}

function playRandomClickSound() {
    if (clickSounds.length > 0) {
        const randomIndex = Math.floor(Math.random() * clickSounds.length);
        const sound = clickSounds[randomIndex];
        const clonedSound = sound.cloneNode();
        clonedSound.volume = 0.5;
        clonedSound.play().catch(e => {});
    }
}

function createParticle(x, y) {
    const particle = document.createElement("div");
    particle.className = "particle";
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    const colors = ["#888888", "#666666", "#4f5a63", "#5e6d7e", "#3c3c3c", "#2f2f2f", "#7b8a91", "#282929", "#B5B495"];
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.position = "fixed";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.pointerEvents = "none";
    particle.style.borderRadius = "50%";
    particle.style.opacity = "1";
    particle.style.zIndex = "9999";
    document.body.appendChild(particle);

    let posX = x, posY = y, vx = (Math.random() - 0.5) * 5, vy = (Math.random() - 1.1) * 5, opacity = 1;
    function animate() {
        vx *= 0.9; vy += 0.35; posX += vx; posY += vy; opacity -= 0.03;
        particle.style.transform = `translate(${posX - x}px, ${posY - y}px)`;
        particle.style.opacity = opacity;
        if (opacity <= 0) { particle.remove(); } else { requestAnimationFrame(animate); }
    }
    animate();
}

function createLuckyParticles(x, y) {
    const luckyColors = ["#FFD700", "#FFF176", "#FDD835", "#FFEB3B"];
    for (let i = 0; i < 100; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        const size = Math.random() * 10 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = luckyColors[Math.floor(Math.random() * luckyColors.length)];
        particle.style.position = "fixed";
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.pointerEvents = "none";
        particle.style.borderRadius = "50%";
        particle.style.opacity = "1";
        particle.style.zIndex = "0";
        particle.style.boxShadow = `0 0 8px 3px rgba(255, 215, 0, 0.8)`;
        document.body.appendChild(particle);

        let posX = x, posY = y, vx = (Math.random() - 0.5) * 6, vy = (Math.random() - 1.2) * 6, opacity = 1;
        function animate() {
            vx *= 0.98; vy += 0.1; posX += vx; posY += vy; opacity -= 0.01;
            particle.style.transform = `translate(${posX - x}px, ${posY - y}px)`;
            particle.style.opacity = opacity;
            if (opacity <= 0) { particle.remove(); } else { requestAnimationFrame(animate); }
        }
        animate();
    }
}

function toggleMenu() {
  const btnMenu = document.getElementById('btnMenu');
  const menu = document.getElementById('menuSecondaire');
  btnMenu.classList.toggle('open');
  menu.classList.toggle('open');
  // Optionnel : changer le + en ×
  document.getElementById('btnMenuIcon').textContent = btnMenu.classList.contains('open') ? '×' : '＋';
}
// Fermer le menu quand on clique sur un bouton secondaire
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#menuSecondaire button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('btnMenu').classList.remove('open');
      document.getElementById('menuSecondaire').classList.remove('open');
      document.getElementById('btnMenuIcon').textContent = '＋';
    });
  });
});

function toggleAdditionalButtons() {
    if (!additionalButtonsContainer || !btnToggleAdditional || !toggleIcon) return;

    additionalButtonsContainer.classList.toggle('additional-buttons-visible');
    btnToggleAdditional.classList.toggle('expanded'); // Pour changer l'icône et le style du bouton

}

function ouvrirPanneau(type) {
    panneauInputFocus = false;
    currentPaneau = type;
    if (panneauElement) {
        panneauElement.classList.add("ouvert");
        panneauElement.classList.remove("panneau-standard", "panneau-souvenir");
        if (type === "souvenir") {
            panneauElement.classList.add("panneau-souvenir");
            souvenirCarouselInitialized = false;
        } else {
            panneauElement.classList.add("panneau-standard");
        }
    } else {
        return;
    }
    actualiserPanneau();
    if (type === 'paramètre') {
        setTimeout(updateSettingsPanelState, 50);
    }
}

function actualiserPanneau() {
    if (!currentPaneau || panneauInputFocus) return;
    if (!contenuPanneauElement) return;
    let panneauHTML = '';
    switch (currentPaneau) {
        case 'amelioration':
            panneauHTML = `
                <h2>Améliorations disponibles</h2>
                <button id="btnAutoClic" onclick="acheterAmelio(1)">${emojiAmelioration[1]} Auto-Clic (${formatNumber(getUpgradeCost(1))} 🪨)</button>
                <button id="btnClicPlus" onclick="acheterAmelio(2)">${emojiAmelioration[2]} Clic Plus (${formatNumber(getUpgradeCost(2))} 🪨)</button>
                <button id="btnChance" onclick="acheterAmelio(3)">${emojiAmelioration[3]} Pierre Chanceuse (${formatNumber(getUpgradeCost(3))} 🪨)</button>
            `;
            break;
        case 'sauvegarde':
            panneauHTML = `
                <h2>Sauvegarder / Charger</h2>
                <button onclick="sauvegarder()">💾 Sauvegarder</button>
                <input type="text" id="codeInput" placeholder="Collez votre code ici">
                <button onclick="charger()">📥 Charger</button>
            `;
            setTimeout(() => {
                const codeInput = document.getElementById("codeInput");
                if (codeInput) {
                    codeInput.addEventListener("focus", () => panneauInputFocus = true);
                    codeInput.addEventListener("blur", () => panneauInputFocus = false);
                }
            }, 0);
            break;
        case 'info':
            panneauHTML = `
                <h2>Informations</h2>
                <div class="information">
                    <p>Score actuel :</p><p>${formatNumber(score)} 🪨</p>
                    <p>Bonus par clic :</p><p>+${bonusManuel} 🪨</p>
                    <p>Clics totaux :</p><p>${formatNumber(clicksTotale)}</p>
                    <p>Auto-clic Niveau :</p><p>${upgrades[1].bought}</p>
                    <p>Clic Plus Niveau :</p><p>${upgrades[2].bought}</p>
                    <p>Pierre Chanceuse :</p><p>${upgrades[3].bought}</p>
                    <p>Coup critique :</p><p>${(upgrades[3].bought * upgrades[3].chancePerLevel * 100).toFixed(1)}%</p>
                </div>
            `;
            break;
        case 'souvenir':
            if (!souvenirCarouselInitialized) {
                panneauHTML = `
                    <h2>Vos Souvenirs</h2>
                    <div class="souvenir-carousel-container">
                        <div class="souvenir-carousel-blur left"></div>
                        <div class="souvenir-carousel-blur right"></div>
                        <div class="souvenir-carousel" id="souvenirCarousel"></div>
                        <button class="carousel-nav prev" id="carouselNavPrev">&#10094;</button>
                        <button class="carousel-nav next" id="carouselNavNext">&#10095;</button>
                    </div>
                `;
                contenuPanneauElement.innerHTML = panneauHTML;
                document.getElementById('carouselNavPrev')?.addEventListener('click', () => scrollSouvenirCarousel(-1));
                document.getElementById('carouselNavNext')?.addEventListener('click', () => scrollSouvenirCarousel(1));
                document.getElementById('souvenirCarousel')?.addEventListener('scroll', function() {
                    handleInfiniteScroll(this);
                });
                souvenirCarouselInitialized = true;
            }
            updateSouvenirCarouselItems();
            break;
        case 'paramètre':
            panneauHTML = `
                <h2>Paramètres</h2>
                <div class="paramétre">
                    <p id="etatSon"></p>
                    <label class="switch">
                        <input type="checkbox" id="sonSwitch" onchange="toggleSon()">
                        <span class="slider round"></span>
                    </label>
                </div>
                <div class="paramétre">
                    <p>✨ Effets Visuels</p>
                    <label class="switch">
                        <input type="checkbox" id="effetSwitch" onchange="toggleEffet()">
                        <span class="slider round"></span>
                    </label>
                </div>
            `;
            break;
        default:
            panneauHTML = `<p>Option de panneau inconnue</p>`;
            break;
    }
    if (currentPaneau !== 'souvenir' || !souvenirCarouselInitialized) {
        contenuPanneauElement.innerHTML = panneauHTML;
    }
    if (currentPaneau === 'paramètre') {
        updateSettingsPanelState();
    }
}

function updateSettingsPanelState() {
    const sonCheckbox = document.getElementById("sonSwitch");
    const effetCheckbox = document.getElementById("effetSwitch");
    if (sonCheckbox) sonCheckbox.checked = sonEnabled;
    if (effetCheckbox) effetCheckbox.checked = effetEnabled;
    const etatSon = document.getElementById("etatSon");
    if (etatSon) etatSon.textContent = `${icon_son()} Son`;
}

function icon_son() {
    return sonEnabled ? "🔊" : "🔇";
}

function toggleSon() {
    sonEnabled = !sonEnabled;
    updateSettingsPanelState();
}

function toggleEffet() {
    effetEnabled = !effetEnabled;
    updateSettingsPanelState();
}

function updateSouvenirCarouselItems() {
    const carousel = document.getElementById('souvenirCarousel');
    if (!carousel) return;
    carousel.innerHTML = '';
    const allSouvenirKeys = Object.keys(souvenirs);
    const numRealSouvenirs = allSouvenirKeys.length;
    const numClonedItems = Math.min(numRealSouvenirs, 2);
    let itemsToRender = [];
    for (let i = 0; i < numClonedItems; i++) {
        const key = allSouvenirKeys[numRealSouvenirs - numClonedItems + i];
        itemsToRender.push({ souvenir: souvenirs[key], originalId: key, type: 'clone-start' });
    }
    allSouvenirKeys.forEach(key => {
        itemsToRender.push({ souvenir: souvenirs[key], originalId: key, type: 'real' });
    });
    for (let i = 0; i < numClonedItems; i++) {
        const key = allSouvenirKeys[i];
        itemsToRender.push({ souvenir: souvenirs[key], originalId: key, type: 'clone-end' });
    }
    itemsToRender.forEach(itemInfo => {
        const s = itemInfo.souvenir, originalId = itemInfo.originalId;
        const item = document.createElement("div");
        item.className = `souvenir-item ${s.bought ? 'unlocked' : 'locked'}`;
        item.dataset.souvenirId = originalId;
        if (itemInfo.type !== 'real') item.classList.add('cloned-item');
        const imageSrc = s.bought ? s.imageUnlocked : s.imageLocked;
        item.innerHTML = `
            <div class="souvenir-image-wrapper">
                <img src="${imageSrc}" alt="${s.title}" class="souvenir-image">
                ${!s.bought ? `
                    <div class="lock-overlay" onclick="acheterSouvenir('${originalId}')">
                        <h3>???</h3>
                        <p class="souvenir-cost">${formatNumber(s.cost)} 🪨</p>
                    </div>
                ` : `
                    <div class="unlocked-overlay" onclick="ouvrirViewerAnimation('${originalId}')">
                        <h3>${s.title}</h3>
                    </div>
                `}
            </div>
        `;
        carousel.appendChild(item);
    });
    requestAnimationFrame(() => {
        const itemWidth = carousel.children[0] ? carousel.children[0].offsetWidth + 20 : 0;
        carousel.scrollLeft = itemWidth * numClonedItems;
    });
}

function scrollSouvenirCarousel(direction) {
    const carousel = document.getElementById('souvenirCarousel');
    if (!carousel) return;
    const itemWidth = carousel.children[0] ? carousel.children[0].offsetWidth + 20 : 0;
    carousel.scrollTo({ left: carousel.scrollLeft + (direction * itemWidth), behavior: 'smooth' });
}

function handleInfiniteScroll(carousel) {
    const allSouvenirKeys = Object.keys(souvenirs);
    const numRealSouvenirs = allSouvenirKeys.length;
    const numClonedItems = Math.min(numRealSouvenirs, 2);
    const itemWidth = carousel.children[0] ? carousel.children[0].offsetWidth + 20 : 0;
    const scrollLeft = carousel.scrollLeft;
    const scrollWidth = carousel.scrollWidth;
    const clientWidth = carousel.clientWidth;
    if (scrollLeft < itemWidth * numClonedItems && scrollLeft <= itemWidth * 0.5) {
        carousel.scrollLeft = itemWidth * numRealSouvenirs + scrollLeft;
    } else if (scrollLeft > itemWidth * numRealSouvenirs && scrollLeft >= scrollWidth - clientWidth - (itemWidth * 0.5)) {
        carousel.scrollLeft = itemWidth * numClonedItems + (scrollLeft - (itemWidth * numRealSouvenirs + itemWidth * numClonedItems));
    }
}

const animationViewer = document.getElementById('animationViewer');
const viewerMediaContainer = document.getElementById('viewerMediaContainer');
const viewerActionButton = document.getElementById('viewerActionButton');
const viewerSkipButton = document.getElementById('viewerSkipButton');
const closeViewerButton = document.getElementById('closeViewer');
let currentSouvenirId = null;

function ouvrirViewerAnimation(souvenirId) {
    const souvenir = souvenirs[souvenirId];
    if (!souvenir || !souvenir.bought) return;
    currentSouvenirId = souvenirId;
    animationViewer.classList.add('viewer-visible');
    viewerMediaContainer.innerHTML = '';
    viewerActionButton.onclick = null;
    viewerSkipButton.onclick = null;
    viewerMediaContainer.innerHTML = `
        <p>Lancement de l'animation "${souvenir.title}"...</p>
        <video id="souvenirVideo" controls autoplay style="width:100%;height:auto;display:none;"></video>
    `;
    viewerActionButton.style.display = 'none';
    viewerSkipButton.style.display = 'block';
    const dummyVideoUrl = "source/videos/animation_generique.mp4";
    const videoElement = document.getElementById('souvenirVideo');
    if (videoElement) {
        videoElement.src = dummyVideoUrl;
        videoElement.style.display = 'block';
        videoElement.load();
        videoElement.play();
        videoElement.onended = () => showMinigameButton(souvenirId);
        viewerSkipButton.onclick = () => {
            if (videoElement && !videoElement.paused) {
                videoElement.pause();
                videoElement.currentTime = 0;
            }
            showMinigameButton(souvenirId);
        };
    } else {
        setTimeout(() => showMinigameButton(souvenirId), 3000);
    }
    closeViewerButton.onclick = fermerViewerAnimation;
}

function showMinigameButton(souvenirId) {
    const souvenir = souvenirs[souvenirId];
    viewerActionButton.textContent = `Jouer à "${souvenir.title}"`;
    viewerActionButton.style.display = 'block';
    viewerActionButton.onclick = () => {
        fermerViewerAnimation();
        souvenir.launchMinigame();
    };
    viewerSkipButton.style.display = 'none';
}

function fermerViewerAnimation() {
    animationViewer.classList.remove('viewer-visible');
    viewerMediaContainer.innerHTML = '';
    viewerActionButton.style.display = 'none';
    viewerSkipButton.style.display = 'none';
    currentSouvenirId = null;
}

window.ouvrirViewerAnimation = ouvrirViewerAnimation;
window.fermerViewerAnimation = fermerViewerAnimation;
window.ouvrirPanneau = ouvrirPanneau;
window.updateScore = updateScore;
window.actualiserPanneau = actualiserPanneau;
window.toggleSon = toggleSon;
window.toggleEffet = toggleEffet;
window.updateSettingsPanelState = updateSettingsPanelState;
window.scrollSouvenirCarousel = scrollSouvenirCarousel;