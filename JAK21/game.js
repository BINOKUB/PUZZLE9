let balance = parseInt(localStorage.getItem('jak_capital')) || 500;
let currentBet = 0, lossStreak = 0, deck = [], playerHand = [], jakHand = [];

const jakTalk = {
    start: ["Les jeux sont faits. Voyons ce que le destin nous réserve...", "Une mise audacieuse ! J'aime votre panache.", "Concentration... La science et le jeu demandent de la rigueur.", "C'est parti. Pour la recherche et pour le plaisir !", "Le tapis est à vous. Faites briller votre intuition.", "Une mise de connaisseur. Voyons la donne.", "Le silence, les cartes, l'espoir... La partie commence.", "Chaque jeton posé est un pas vers l'inconnu.", "La table est chaude aujourd'hui, profitez-en.", "Une stratégie se dessine... je le sens.", "Bienvenue au cœur de l'action. Je distribue.", "Votre confiance m'impressionne. Jouons.", "La chance n'est qu'une probabilité qui attend son heure.", "Un duel d'esprit, c'est ce qu'il nous fallait.", "Rien ne vaut l'adrénaline d'une belle donne.", "Vos jetons sont en place, mon jeu aussi.", "La rigueur du hasard... fascinant, n'est-ce pas ?", "Installez-vous confortablement, le duel commence.", "Une mise solide. Le respect est mutuel à cette table.", "Que les cartes parlent pour nous ce soir."],
    win: ["21 ! Magnifique. Si seulement chaque combat finissait ainsi.", "Vous avez battu la maison ! Votre intuition est remarquable.", "Le destin a choisi son camp : le vôtre. Bravo !", "Une victoire éclatante. La science de la gagne est en vous.", "C'est ce qu'on appelle un coup de maître.", "Splendide ! Vos gains s'envolent, tout comme nos espoirs.", "La chance vous accompagne... et c'est une excellente nouvelle.", "Vous lisez dans mon jeu comme dans un livre ouvert.", "Une main parfaite. Rien à ajouter, sinon mes félicitations.", "Le 21 est tombé ! Un moment de grâce à cette table.", "Vous dominez le tapis. Jak s'incline avec respect.", "C'est ainsi qu'on gagne les grandes batailles.", "Quelle audace récompensée ! C'est rafraîchissant.", "Votre portefeuille se porte à merveille, tout comme votre moral.", "Un gain mérité. Votre patience a payé.", "Le son de la victoire... savourez ce moment.", "Vous avez le fluide aujourd'hui. Ne changez rien.", "Même Jak ne peut rien face à une telle main.", "C'est une leçon de Blackjack que vous me donnez là.", "Bravo ! Pourquoi ne pas célébrer cela avec un petit geste ?"],
    lose: ["Jak l'emporte cette fois, mais le combat continue ensemble.", "Un revers mineur. L'important est de rester dans la partie.", "La chance a tourné. Mais chaque tentative nous rapproche de la solution.", "La maison gagne, mais votre soutien reste inestimable.", "Ce n'était pas votre donne, mais la prochaine sera différente.", "Gardez la tête haute, le jeu est une roue qui tourne.", "Un coup du sort... comme il en existe tant en recherche.", "Jak a eu de la chance, mais votre stratégie était la bonne.", "La banque gagne, mais votre esprit reste conquérant.", "Une manche difficile, mais la partie est loin d'être finie.", "Le hasard est parfois cruel, mais il ne définit pas votre valeur.", "Rien n'est perdu tant que l'espoir est à la table.", "Une défaite qui prépare une plus grande victoire.", "Jak garde la main, pour le moment du moins.", "La science avance par échecs et réussites. Comme nous ici.", "Un petit pas en arrière pour mieux sauter ensuite.", "La persévérance est la clé, au casino comme dans la vie.", "Ne laissez pas Jak vous impressionner, reprenez la main.", "Le destin teste votre détermination. Prêt à relancer ?", "La manche se termine, mais l'engagement demeure."],
    hit: ["Une carte de plus... la prise de risque est nécessaire pour avancer.", "On tente le tout pour le tout ? J'admire votre détermination.", "Prudence ou audace ? C'est là que tout se joue.", "Le frisson de la carte supplémentaire... classique.", "Une décision réfléchie. Voyons ce que le sabot nous donne.", "Vous cherchez le 21 ? Une quête noble.", "La tension monte d'un cran. Voici votre carte.", "On ne gagne rien sans oser. Belle initiative.", "Un choix qui pourrait tout changer. Suspendons notre souffle.", "La prochaine carte sera peut-être celle de la victoire.", "Vous ne vous contentez pas du minimum, j'aime ça.", "Chaque carte tirée est une nouvelle chance de briller.", "La stratégie s'affine. Une décision de pro.", "On demande ? On reçoit. Voici pour vous.", "L'adrénaline à l'état pur. C'est ça, le Blackjack.", "Vous avez l'oeil du tigre. Voyons le résultat.", "Une carte de plus pour l'histoire. À vous de jouer.", "Le risque est calculé, la tension est palpable.", "Vous jouez avec le feu... ou avec le génie ?", "La carte arrive. Le destin est en marche."],
    memory_loss: ["La route est sinueuse, mais chaque main jouée soutient une cause plus grande.", "Gardez espoir, la recherche aussi connaît des revers, mais on ne lâche rien.", "Ne vous découragez pas, votre présence ici est déjà une victoire.", "Même dans la tempête, votre soutien brille comme un phare.", "La persévérance finit toujours par payer, j'en suis convaincu."]
};

function typeWriter(text, i = 0) {
    const el = document.getElementById('jak-msg');
    if (i === 0) el.innerHTML = '"';
    if (i < text.length) { el.innerHTML += text.charAt(i); setTimeout(() => typeWriter(text, i + 1), 25); }
    else { el.innerHTML += '"'; }
}

function jakSpeak(cat) {
    let phrases = (lossStreak >= 3 && (cat === 'start' || cat === 'lose')) ? jakTalk.memory_loss : jakTalk[cat];
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
            if (js > 21 || ps > js) endGame('win'); else if (ps === js) endGame('draw'); else endGame('lose');
        }
    }, 800);
}

function endGame(res) {
    jakSpeak(res);
    const winDisplay = document.getElementById('win-display');
    
    if (res === 'win') { 
        let gain = currentBet * 2; 
        
        // Bonus Blackjack (As + Figure) : rapporte 2.5x la mise
        if (getScore(playerHand) === 21 && playerHand.length === 2) {
            gain = currentBet * 2.5;
            winDisplay.innerText = "BLACKJACK ! + $" + gain.toLocaleString();
        } else {
            winDisplay.innerText = "GAGNÉ ! + $" + gain.toLocaleString();
        }
        
        balance += gain; 
        lossStreak = 0;
        
        // Affichage gratifiant du gain
        winDisplay.style.display = 'block';
        
    } else if (res === 'draw') { 
        balance += currentBet; 
        winDisplay.innerText = "PUSH : $" + currentBet.toLocaleString() + " RENDUS";
        winDisplay.style.color = "var(--cyan)";
        winDisplay.style.display = 'block';
    } else if (res === 'lose') { 
        lossStreak++; 
    }
    
    localStorage.setItem('jak_capital', balance);
    currentBet = 0;
    
    // On met à jour le portefeuille immédiatement pour que le joueur voie le chiffre monter
    document.getElementById('balance-display').innerText = "$" + balance.toLocaleString();

    setTimeout(() => { 
        location.reload(); 
    }, 4500);
}
window.onload = () => { updateUI(); createChips(); };
