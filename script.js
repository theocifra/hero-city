// ================= CONSTANTES =================

function saveGame() {
    const saveData = {
        gameState: gameState,
    };

    localStorage.setItem("idleSave", JSON.stringify(saveData));
}

function loadGame() {
    const saved = localStorage.getItem("idleSave");
    if (!saved) return;

    const data = JSON.parse(saved);

    Object.assign(gameState, data.gameState);

    calculateGoldPerSecond();
}



const gameState = {
    gold: 0,
    goldPerSecond: 0,
    goldPerClick: 1,
    totalGoldEarned: 0,
    totalUnits: 0,
    units: {
        swordsman: 0,
        archer: 0,
        axeman: 0,
        gladiator: 0,
        paladin: 0
    },
    equipments: {
        woodSword: false,
        martialArts: false,
        ironBow: false,
        shield: false
    },
    equipmentMultipliers: {
        swordsman: 1,
        archer: 1,
        axeman: 1,
        gladiator: 1,
        paladin: 1,
        click: 1
    }
}

const heroes = {
    swordsman: { 
        baseCost: 10, 
        goldPerSecond: 1, 
        unlockedAt: 5, 
        showed: false,
        costMultiplier: 1.20
    },
    archer: { 
        baseCost: 200, 
        goldPerSecond: 3, 
        unlockedAt: 100, 
        showed: false,
        costMultiplier: 1.25
    },
    axeman: { 
        baseCost: 600, 
        goldPerSecond: 10, 
        unlockedAt: 300, 
        showed: false,
        costMultiplier: 1.30
    },
    gladiator: {
        baseCost: 2000, 
        goldPerSecond: 25, 
        unlockedAt: 1000, 
        showed: false,
        costMultiplier: 1.30
    },
    paladin: {
        baseCost: 10000, 
        goldPerSecond: 50, 
        unlockedAt: 5000, 
        showed: false,
        costMultiplier: 1.30
    }
}

const equipments = {
    // swordsman
    woodSword: {
        name: "wood sword",
        description: "a simple wood sword",
        effect:"multiply swordsman gains by 2x",
        price: 150,
        affect: "swordsman",
        multiplier: 2,
    }, 
    // click
    martialArts: {
        name: "martial arts",
        description: "learn the kung fu!",
        effect: "Multiply click efficiency by 2x",
        price: 30,
        affect: "click",
        multiplier: 2,
    },
    // archer
    ironBow: {
        name: "iron bow",
        description: "a better bow",
        effect: "Multiply the archer efficiency by 2x",
        price: 500,
        affect: "archer",
        multiplier: 2,
    },
    // gladiator
    shield: {
        name: "shield",
        description: "a shield for defense",
        effect: "Multiply the gladiator efficiency by 2x",
        price: 10000,
        affect: "gladiator",
        multiplier: 2,
    }
}

// ================= HEROES =================

function showUpgrade() {
    Object.keys(heroes).forEach(key => {
        if (gameState.gold >= heroes[key].unlockedAt && !heroes[key].showed) {
            const hireButton = document.createElement("button");
            hireButton.className = "unit-button upgrade";
            hireButton.id = `${key}-button`
            hireButton.dataset.name = key;
            document.getElementById("heroes-section").appendChild(hireButton);
            heroes[key].showed = true;
            hireButton.addEventListener("click", () => buyUpgrade(hireButton));
        }
        const el = document.getElementById(`${key}-button`)
        if (el) {
            el.innerHTML = `Hire ${key} - Cost: ${getUpgradeCost(key)}`;
            el.dataset.tooltip = `give ${heroes[key].goldPerSecond} gold/sec - total: ${heroes[key].goldPerSecond * gameState.units[key]} gold/sec`
            turnRed(el);
        }
    })
}


function getUpgradeCost(upgradeName) {
    const upgrade = heroes[upgradeName];
    const owned = gameState.units[upgradeName];
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, owned));
}

function buyUpgrade(element) {
    const upgradeName = element.dataset.name;
    const cost = getUpgradeCost(upgradeName);

    if (gameState.gold >= cost) {
        gameState.gold -= cost;
        gameState.units[upgradeName]++;
        calculateGoldPerSecond();
        console.log(`Comprou 1 ${upgradeName}`);
        gameState.totalUnits++;
    }
}

// ================= GOLD / PRODUÇÃO =================

function calculateGoldPerSecond() {
    let total = 0;

    Object.keys(heroes).forEach(key => {
        const baseProduction = gameState.units[key] * heroes[key].goldPerSecond;
        const multiplier = gameState.equipmentMultipliers[key];
        total += baseProduction * multiplier;
    });

    gameState.goldPerSecond = total;
}
function stats() {
    const totalGoldElement = document.getElementById("total-gold-earned");
    totalGoldElement.textContent = gameState.totalGoldEarned.toFixed(1);
    const totalUnitsElement = document.getElementById("total-units");
    totalUnitsElement.textContent = gameState.totalUnits;
    const golPerCllickElement = document.getElementById("gold-per-click");
    golPerCllickElement.textContent = gameState.goldPerClick;
}


// ================= BOTÃO =================

const slayButton = document.getElementById("slay-button");
slayButton.addEventListener("click", () => {
    gameState.gold += gameState.goldPerClick;
    gameState.totalGoldEarned += gameState.goldPerClick;
}); 

slayButton.addEventListener("click", (e) => {
    const value = gameState.goldPerClick
    const span = document.createElement("span");
    span.className = "floating-text";
    span.textContent = "+" + value;

    span.style.left = `${e.pageX + (Math.random()*30 -10)}px`;
    span.style.top = `${e.pageY - 15}px`;

    document.body.appendChild(span);

    setTimeout(() => {
        span.remove();
    }, 1000);
});

// ================= UI HEROES =================

function showHeroes() {
    Object.keys(heroes).forEach(key => {
        if (!heroes[key].showed) return;

        const heroP = document.getElementById(`${key}-name`);
        const heroSpan = document.getElementById(`${key}-count`);

        if (!heroP) {
            const newP = document.createElement("p");
            const newSpan = document.createElement("span");

            newP.id = `${key}-name`;
            newP.textContent = `${key}: `;

    
    if (equipments[equipmentName].affect === "click") {
        gameState.goldPerClick = gameState.goldPerClick * equipments[equipmentName].multiplier
    }
    else {
        const affectedHero = equipments[equipmentName].affect;
        gameState.equipmentMultipliers[affectedHero] *= equipments[equipmentName].multiplier;
    }
    
    calculateGoldPerSecond()   }
    });
}
// ================= UI DOS EQUIPMENTS=================

function buyEquipment(element) {
    const equipmentName = element.dataset.name;
    const price = equipments[equipmentName].price;
    if (gameState.gold < price) return;
    gameState.gold -= price;
    gameState.equipments[equipmentName] = true;
    gameState[equipmentName] = true;
    element.remove();
    console.log(`Comprou ${equipmentName}`);
    calculateGoldPerSecond()
    if (equipments[equipmentName].affect === "click") {
        gameState.goldPerClick = gameState.goldPerClick * equipments[equipmentName].multiplier
    }
    else {
        const heroAffected = heroes[equipments[equipmentName].affect]
        heroAffected.goldPerSecond = heroAffected.goldPerSecond * equipments[equipmentName].multiplier
    }
}



function showEquipments() {
    Object.keys(equipments).forEach((key) => {
        const up = equipments[key];
        let upgradeButton = document.getElementById(`${key}-upgrade-button`);
        
        // Se o equipamento já foi comprado, remover botão
        if (gameState.equipments[key]) {
            if (upgradeButton) upgradeButton.remove();
            return;
        }
        
        // Criar botão apenas uma vez
        if (!upgradeButton && gameState.gold >= up.price / 2) {
            upgradeButton = document.createElement("button");
            upgradeButton.id = `${key}-upgrade-button`;
            upgradeButton.className = "upgrade equipment-button";
            upgradeButton.textContent = up.name;
            upgradeButton.dataset.name = `${key}`;
            upgradeButton.dataset.tooltip = `${up.description} \n Effect: ${up.effect} \nPrice: ${up.price} gold`;
            document.getElementById("equipments-section").appendChild(upgradeButton);
            upgradeButton.addEventListener("click", () => buyEquipment(upgradeButton));
        }
        
        // Atualizar cor baseado no gold atual
        if (upgradeButton) {
            turnRed(upgradeButton);
        }   
    });
}
    
function turnRed(element) {
    if (!element) return;
    
    if (element.classList.contains("equipment-button")) {
        const equipmentName = element.dataset.name;
        const price = equipments[equipmentName].price;
        if (gameState.gold < price) {
            element.style.setProperty("background-color", "var(--light-red)", "important");
        }
        else {
            element.style.setProperty("background-color", "lightgreen", "important");
        }
    }
    else if (element.classList.contains("unit-button")) {
        const upgradeName = element.dataset.name;
        const cost = getUpgradeCost(upgradeName);
        if (gameState.gold < cost) {
            element.style.setProperty("background-color", "var(--light-red)", "important");
        }
        else {
            element.style.setProperty("background-color", "lightgreen", "important");
        }
    }
}


function getGold (amount) {
    gameState.gold += amount;
}

// ================= LOOP DO JOGO =================

function refreshUI() {
    showUpgrade();
    showHeroes();
    showEquipments();
    stats();
    gameState.gold += gameState.goldPerSecond * 0.1;
    gameState.totalGoldEarned += gameState.goldPerSecond * 0.1;
    document.getElementById('gold').innerText = gameState.gold.toFixed(1);
    document.getElementById('gold-per-second').innerText = gameState.goldPerSecond;

    setTimeout(refreshUI, 100);
}
loadGame();
refreshUI();
setInterval(saveGame, 10000); // salva a cada 5s
window.addEventListener("beforeunload", saveGame);
