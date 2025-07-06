// source/utils.js
function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "Md";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "k";
    return num.toFixed(0);
}

// Fonction placeholder pour les actions non encore implémentées dans les souvenirs
function pas_fait() {
    alert("Cette fonctionnalité n'est pas encore implémentée !");
}