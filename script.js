// ================= CONSTANTES =================

const gameState = {
    gold: 0,
    goldPerSecond: 0,
    goldPerClick: 1,
    units: {
        swordsman: 0,
        archer: 0,
        axeman: 0
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
        baseCost: 150, 
        goldPerSecond: 3, 
        unlockedAt: 20, 
        showed: false,
        costMultiplier: 1.20
    },
    axeman: { 
        baseCost: 500, 
        goldPerSecond: 10, 
        unlockedAt: 100, 
        showed: false,
        costMultiplier: 1.20
    }
}

const equipments = {
    woodSword: {
        name: "wood sword",
        description: "a simple wood ",
        effect:"multiply swordsman gains by 2x",
        price: 60,
        affect: "swordsman",
        multiplier: 2,
        showed: false
    }, 
    martialArts: {
        name: "Martial Arts",
        description: "learn the kung fu!",
        effect: "Multiply click efficiency by 2x",
        price: 30,
        affect: "click",
        multiplier: 2,
        showed: false
    }
}

// ================= UPGRADES =================

function showUpgrade() {
    Object.entries(heroes).forEach(([key, up]) => {
        const el = document.querySelector(`.upgrade[data-name="${key}"]`);
        if (!el) return;

        if (gameState.gold >= up.unlockedAt && !up.showed) {
            el.style.display = 'inline-block';
            up.showed = true;
        }

        el.innerHTML = `Hire ${key} - Cost: ${getUpgradeCost(key)}`;
        el.setAttribute(
            "title",
            `give ${up.goldPerSecond} gold/sec - total: ${up.goldPerSecond * gameState.units[key]} gold/sec`
        );
    });
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
    }
}

// ================= GOLD / PRODUÇÃO =================

function calculateGoldPerSecond() {
    let total = 0;

    Object.keys(heroes).forEach(key => {
        total += gameState.units[key] * heroes[key].goldPerSecond;
    });

    gameState.goldPerSecond = total;
}

// ================= BOTÃO =================

const slayButton = document.getElementById("slay-button");
slayButton.addEventListener("click", () => {
    gameState.gold += 1;
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

            newSpan.id = `${key}-count`;
            newSpan.textContent = gameState.units[key];

            newP.appendChild(newSpan);
            document.getElementById("heroes-list").appendChild(newP);
        } else if (heroSpan) {
            heroSpan.textContent = gameState.units[key];
        }
    });
}
// ================= UI DOS EQUIPMENTS=================

// function showEquipments() {
//     Object.keys(equipments).forEach(([key, up])) => {
        
//     }
// }

// ================= LOOP DO JOGO =================

function refreshUI() {
    showUpgrade();
    showHeroes();

    gameState.gold += gameState.goldPerSecond * 0.1;

    document.getElementById('gold').innerText = gameState.gold.toFixed(1);
    document.getElementById('gold-per-second').innerText = gameState.goldPerSecond;

    setTimeout(refreshUI, 100);
}

refreshUI();
