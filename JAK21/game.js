let balance = parseInt(localStorage.getItem('jak_capital')) || 500;
let currentBet = 0, lossStreak = 0, deck = [], playerHand = [], jakHand = [];

const jakTalk = {
    start: ["Les jeux sont faits. Voyons ce que le destin nous réserve...", "Une mise audacieuse ! J'aime votre panache.", "Concentration... La science et le jeu demandent de la rigueur.", "C'est parti. Pour la recherche et pour le plaisir !", "Le tapis est à vous. Faites briller votre intuition."],
    win: ["21 ! Magnifique. Si seulement chaque combat finissait ainsi.", "Vous avez battu la maison ! Votre intuition est remarquable.", "Le destin a choisi son camp : le vôtre. Bravo !", "Une victoire éclatante. La science de la gagne est en vous.", "Le 21 est tombé ! Un moment de grâce à cette table."],
    lose: ["Jak l'emporte cette fois, mais le combat continue ensemble.", "Un revers mineur. L'important est de rester dans la partie.", "La chance a tourné. Mais chaque tentative nous rapproche de la solution.", "La maison gagne, mais votre soutien reste inestimable."],
    draw: ["Égalité ! La banque vous rend votre mise. On recommence ?", "Match nul. Jak et vous êtes de force égale sur cette main.", "Un 'Push' ! Récupérez vos jetons, on relance."],
    hit: ["Une carte de plus... la prise de risque est nécessaire pour avancer.", "On tente le tout pour le tout ? J'admire votre détermination.", "Prudence ou audace ? C'est là que tout se joue."],
    memory_loss: ["La route est sinueuse, mais chaque main jouée soutient une cause plus grande.", "Gardez espoir, la recherche aussi connaît des revers, mais on ne lâche rien."]
};

function typeWriter(text, i = 0) {
    const el = document.getElementById('jak-msg');
    if (i === 0) el.innerHTML = '"';
    if (i < text.length) { 
        el.innerHTML += text.charAt(i); 
        setTimeout(() => typeWriter(text, i + 1), 25); 
    } else { 
        el.innerHTML += '"'; 
    }
}

function jakSpeak(cat) {
    let phrases = (lossStreak >= 3 && (cat === 'start' || cat === 'lose')) ? jakTalk.memory_loss : jakTalk[cat];
    if (!phrases) phrases = jakTalk.draw;
    typeWriter(phrases[Math.floor(Math.random() * phrases.length)]);
}

function createDeck() {
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const symbols = ['♠', '♥', '♦', '♣'];
    deck = [];
    for (let s of symbols) for (let v of values) {
        let p = parseInt(v) || 10; if (v === 'A') p = 11;
        deck.push({ n: v, s: s, p: p });
    }
    deck.sort(() => Math.random() - 0.5);
}

function getScore(hand) {
    let s = hand.reduce((acc, c) => acc + c.p, 0), aces = hand.filter(c => c.n === 'A').length;
    while (s > 21 && aces > 0) { s -= 10; aces--; } return s;
}

function renderHand(hand, id, hide = false) {
    document.getElementById(id).innerHTML = hand.map((c, i) => 
        `<div class="card" style="color:${(c.s === '♥' || c.s === '♦') ? 'red' : 'black'}">${(hide && i === 0) ? '?' : c.n + '<br>' + c.s}</div>`
    ).join('');
}

function updateUI() {
    document.getElementById('balance-display').innerText = "$" + balance.toLocaleString();
    document.getElementById('current-bet-display').innerText = "MISE : $" + currentBet.toLocaleString();
    document.getElementById('btn-start-deal').style.display = currentBet > 0 ? 'inline-block' : 'none';
}

function createChips() {
    const values = [20, 50, 100, 500, 1000, 5000];
    const container = document.getElementById('chips-box'); container.innerHTML = '';
    values.forEach(v => {
        if (v <= balance) {
            const chip = document.createElement('div'); chip.className = `chip chip-${v}`;
            chip.style.borderColor = getChipColor(v); chip.style.color = getChipColor(v);
            chip.innerText = "$" + v; chip.onclick = () => { balance -= v; currentBet += v; updateUI(); createChips(); };
            container.appendChild(chip);
        }
    });
}

function getChipColor(v) {
    if (v === 20) return "#fff"; if (v === 100) return "#00f3ff";
    if (v === 500) return "#ff00ff"; return "#39ff14";
}

function resetBet() { balance += currentBet; currentBet = 0; updateUI(); createChips(); }

function startDeal() {
    document.getElementById('bet-area').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    document.getElementById('win-display').style.display = 'none';
    createDeck();
    playerHand = [deck.pop(), deck.pop()];
    jakHand = [deck.pop(), deck.pop()];
    jakSpeak('start');
    renderHand(playerHand, 'player-cards');
    renderHand(jakHand, 'jak-cards', true);
    document.getElementById('player-score-val').innerText = "SCORE : " + getScore(playerHand);
}

function playerHit() {
    playerHand.push(deck.pop()); renderHand(playerHand, 'player-cards');
    let s = getScore(playerHand); document.getElementById('player-score-val').innerText = "SCORE : " + s;
    if (s > 21) endGame('lose'); else jakSpeak('hit');
}

function playerStay() {
    document.getElementById('game-controls').style.display = 'none';
    renderHand(jakHand, 'jak-cards', false);
    document.getElementById('jak-score-val').style.visibility = 'visible';
    
    let js = getScore(jakHand);
    document.getElementById('jak-score-val').innerText = "SCORE JAK : " + js;

    const jakDrawInterval = setInterval(() => {
        if (js < 17) {
            jakHand.push(deck.pop());
            renderHand(jakHand, 'jak-cards', false);
            js = getScore(jakHand);
            document.getElementById('jak-score-val').innerText = "SCORE JAK : " + js;
        } else {
            clearInterval(jakDrawInterval);
            let ps = getScore(playerHand);
            if (js > 21 || ps > js) endGame('win'); 
            else if (ps === js) endGame('draw'); 
            else endGame('lose');
        }
    }, 800);
}

function endGame(res) {
    jakSpeak(res);
    const winBox = document.getElementById('win-display');
    winBox.style.display = 'block';

    if (res === 'win') { 
        let gain = currentBet * 2;
        if (getScore(playerHand) === 21 && playerHand.length === 2) gain = currentBet * 2.5;
        balance += gain; 
        winBox.innerText = "GAGNÉ ! + $" + gain.toLocaleString();
        winBox.style.color = "var(--neon-green)";
        lossStreak = 0; 
    } else if (res === 'draw') { 
        balance += currentBet;
        winBox.innerText = "PUSH : $" + currentBet.toLocaleString() + " RENDUS";
        winBox.style.color = "var(--cyan)";
    } else { 
        winBox.innerText = "PERDU...";
        winBox.style.color = "var(--neon-red)";
        lossStreak++; 
    }
    
    localStorage.setItem('jak_capital', balance);
    currentBet = 0;
    updateUI();
    setTimeout(() => { location.reload(); }, 4500);
}

window.onload = () => { updateUI(); createChips(); };
