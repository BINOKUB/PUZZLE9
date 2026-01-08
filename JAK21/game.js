let balance = parseInt(localStorage.getItem('jak_capital')) || 0;
let currentBet = 0, deck = [], playerHand = [], jakHand = [];

const jakTalk = {
    start: ["Les jeux sont faits. Voyons ce que le destin nous réserve...", "Une mise audacieuse ! J'aime votre panache."],
    win: ["21 ! Magnifique. Une victoire éclatante pour vous !", "Vous avez battu la maison ! Votre intuition est remarquable."],
    lose: ["Jak l'emporte cette fois, mais le combat continue.", "Un revers mineur. L'important est de rester dans la partie."],
    draw: ["Égalité ! La banque vous rend votre mise.", "Match nul. On recommence ?"],
    bankruptcy: ["C'est à sec... Mais Jak ne laisse jamais un partenaire au bord de la route.", "Besoin d'un coup de pouce ? La recherche n'attend pas."]
};

function typeWriter(text, i = 0) {
    const el = document.getElementById('jak-msg');
    if (i === 0) el.innerHTML = '"';
    if (i < text.length) { 
        el.innerHTML += text.charAt(i); 
        setTimeout(() => typeWriter(text, i + 1), 25); 
    } else { el.innerHTML += '"'; }
}

function jakSpeak(cat) {
    typeWriter(jakTalk[cat][Math.floor(Math.random() * jakTalk[cat].length)]);
}

function updateUI() {
    const balEl = document.getElementById('balance-display');
    balEl.innerText = "$" + balance.toLocaleString();
    
    if (localStorage.getItem('jak_loan') === 'true') {
        balEl.className = 'balance-box status-red';
    } else {
        balEl.className = 'balance-box status-green';
    }
    document.getElementById('current-bet-display').innerText = "MISE : $" + currentBet.toLocaleString();
    document.getElementById('btn-start-deal').style.display = currentBet > 0 ? 'inline-block' : 'none';
}

function createChips() {
    const values = [20, 50, 100, 500];
    const container = document.getElementById('chips-box'); container.innerHTML = '';
    values.forEach(v => {
        if (v <= balance) {
            const chip = document.createElement('div'); chip.className = `chip`;
            chip.style.borderColor = (v === 100) ? "#00f3ff" : (v === 500) ? "#ff00ff" : "#39ff14";
            chip.style.color = chip.style.borderColor; chip.innerText = "$" + v;
            chip.onclick = () => { balance -= v; currentBet += v; updateUI(); createChips(); };
            container.appendChild(chip);
        }
    });
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

function startDeal() {
    document.getElementById('bet-area').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    createDeck();
    playerHand = [deck.pop(), deck.pop()]; jakHand = [deck.pop(), deck.pop()];
    renderHand(playerHand, 'player-cards'); renderHand(jakHand, 'jak-cards', true);
    document.getElementById('player-score-val').innerText = "SCORE : " + getScore(playerHand);
    jakSpeak('start');
}

function playerHit() {
    playerHand.push(deck.pop()); renderHand(playerHand, 'player-cards');
    let s = getScore(playerHand); document.getElementById('player-score-val').innerText = "SCORE : " + s;
    if (s > 21) endGame('lose');
}

function playerStay() {
    document.getElementById('game-controls').style.display = 'none';
    renderHand(jakHand, 'jak-cards', false);
    document.getElementById('jak-score-val').style.visibility = 'visible';
    let js = getScore(jakHand);
    document.getElementById('jak-score-val').innerText = "SCORE JAK : " + js;

    const interval = setInterval(() => {
        if (js < 17) {
            jakHand.push(deck.pop()); renderHand(jakHand, 'jak-cards', false);
            js = getScore(jakHand); document.getElementById('jak-score-val').innerText = "SCORE JAK : " + js;
        } else {
            clearInterval(interval);
            let ps = getScore(playerHand);
            if (js > 21 || ps > js) endGame('win'); else if (ps === js) endGame('draw'); else endGame('lose');
        }
    }, 800);
}

function endGame(res) {
    jakSpeak(res);
    const winBox = document.getElementById('win-display');
    winBox.style.display = 'block';
    
    if (res === 'win') {
        balance += currentBet * 2; winBox.innerText = "GAGNÉ !"; winBox.style.color = "var(--neon-green)";
    } else if (res === 'draw') {
        balance += currentBet; winBox.innerText = "PUSH"; winBox.style.color = "var(--cyan)";
    } else {
        winBox.innerText = "PERDU..."; winBox.style.color = "var(--neon-red)";
    }
    
    localStorage.setItem('jak_capital', balance);
    currentBet = 0;
    updateUI();

    setTimeout(() => {
        if (balance < 20) {
            jakSpeak('bankruptcy');
            document.getElementById('loan-modal').style.display = 'flex';
        } else {
            location.reload();
        }
    }, 3000);
}

function acceptLoan() {
    balance = 500;
    localStorage.setItem('jak_capital', balance);
    localStorage.setItem('jak_loan', 'true');
    location.reload();
}

function declineLoan() {
    window.location.href = "index.html";
}

window.onload = () => { updateUI(); createChips(); };
function resetBet() { balance += currentBet; currentBet = 0; updateUI(); createChips(); }
