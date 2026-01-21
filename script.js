// constantes

const gameState = {
    gold: 0,
    goldPerSecond: 0,
    swordsman: 0,
    archer: 0
}

const upgrades = {
    swordsman: { 
        baseCost: 10, 
        goldPerSecond: 1, 
        unlockedAt: 5, 
        showed: false,
        costMultiplier: 1.15
    },
    archer: { baseCost: 50, 
        goldPerSecond: 3, 
        unlockedAt: 20, 
        showed: false,
        costMultiplier: 1.20
    }
}

// funções

function showUpgrade() {
    // percorre todos os upgrades definidos e atualiza o display
    Object.entries(upgrades).forEach(([key, up]) => {
        const el = document.querySelector(`.upgrade[data-name="${key}"]`);
        if (!el) return;
        if (gameState.gold >= up.unlockedAt) {
            el.style.display = 'inline-block';
        } else {
            el.style.display = 'none';
        }
    });
}

function getUpgradeCost(upgradeName) {
    const upgrade = upgrades[upgradeName];
    const owned = gameState[upgradeName];
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, owned));
}

function buyUpgrade(element) {
    upgradeName = element.dataset.name;
    upgradeCost = getUpgradeCost(upgradeName);
    if (gameState.gold >= upgradeCost) {
        gameState.gold -= upgradeCost;
        gameState[upgradeName] += 1;
        console.log(`Comprou 1 ${upgradeName}`);
        gameState.goldPerSecond = ((gameState.swordsman * upgrades.swordsman.goldPerSecond) + (gameState.archer * upgrades.archer.goldPerSecond))
    }
}


function getGold() {
    gameState.gold += 1;
}

// função para dar refresh na ui do jogo

function refreshUI() {
    showUpgrade()
    showHeroes()
    // calculo de gold per sec
    //gold refresh
    gameState.gold += gameState.goldPerSecond * 0.1; // 0.1s tick
    document.getElementById('gold').innerText = gameState.gold.toFixed(1);
    document.getElementById('gold-per-second').innerText = gameState.goldPerSecond;   
    setTimeout(refreshUI, 100); // refresh de 100ms
}

refreshUI();

// config de visualização de herois

function showHeroes() {
    document.getElementById('swordsman-count').innerText = gameState.swordsman;
    document.getElementById('archer-count').innerText = gameState.archer;
}