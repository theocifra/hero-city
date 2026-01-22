// constantes

const gameState = {
    gold: 0,
    goldPerSecond: 0,
    swordsman: 0,
    archer: 0,
    axeman: 0
}

const warriors = {
    swordsman: { 
        baseCost: 10, 
        goldPerSecond: 1, 
        unlockedAt: 5, 
        showed: false,
        costMultiplier: 1.15
    },
    archer: { 
        baseCost: 50, 
        goldPerSecond: 3, 
        unlockedAt: 20, 
        showed: false,
        costMultiplier: 1.20
    },
    axeman: { 
        baseCost: 200, 
        goldPerSecond: 10, 
        unlockedAt: 100, 
        showed: false,
        costMultiplier: 1.25
    }
}

// funções

function showUpgrade() {
    // percorre todos os upgrades definidos e atualiza o display, codigo so para aparecer o upgrade quando o jogador tiver gold
    Object.entries(warriors).forEach(([key, up]) => {
        const el = document.querySelector(`.upgrade[data-name="${key}"]`);
        if (!el) return;
        if (gameState.gold >= up.unlockedAt && warriors[key].showed === false) {
            el.style.display = 'inline-block';
            warriors[key].showed = true;
        }
        // update o preço do upgrade
        el.innerHTML = `Hire ${key} - Cost: ${getUpgradeCost(key)}` 
        el.setAttribute("title", `give ${warriors[key].goldPerSecond} gold/sec - total: ${warriors[key].goldPerSecond * gameState[key]} gold/sec`)
    });
}

function getUpgradeCost(upgradeName) {
    const upgrade = warriors[upgradeName];
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
        calculateGoldPerSecond()
    }
}

function calculateGoldPerSecond() {
    let total = 0;
    Object.keys(warriors).forEach(key => {
        total += gameState[key] * warriors[key].goldPerSecond;
    });
    gameState.goldPerSecond = total;
}

// configs do slay button

slayButton = document.getElementById("slay-button");
slayButton.addEventListener("click", getGold);

function getGold() {
    gameState.gold += 1;
}


// config de visualização de herois

function showHeroes() {
    Object.keys(warriors).forEach(key => {
        if (!warriors[key].showed) return;

        const heroP = document.getElementById(`${key}-name`);
        const heroSpan = document.getElementById(`${key}-count`);

        // Se ainda NÃO existe, cria
        if (!heroP) {
            const newP = document.createElement("p");
            const newSpan = document.createElement("span");

            newP.id = `${key}-name`;
            newP.textContent = `${key}: `;

            newSpan.id = `${key}-count`;
            newSpan.textContent = gameState[key];

            newP.appendChild(newSpan);
            document.getElementById("heroes-list").appendChild(newP);
        } 
        // Se já existe, só atualiza o valor
        else if (heroSpan) {
            heroSpan.textContent = gameState[key];
        }
    });
}

// função para dar refresh na ui do jogo

function refreshUI() {
    showUpgrade()
    showHeroes()
    //calculo de gold per sec
    gameState.gold += gameState.goldPerSecond * 0.1; // 0.1s tick
    document.getElementById('gold').innerText = gameState.gold.toFixed(1);
    document.getElementById('gold-per-second').innerText = gameState.goldPerSecond;   
    setTimeout(refreshUI, 100); // refresh de 100ms
}

refreshUI();

