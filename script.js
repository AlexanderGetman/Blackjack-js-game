let suits = ["H","S","C","D"];
let numbers = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
let cards = [];
let total = 0;
let wallet = 100;
let buttons = document.getElementsByTagName("button");

let computerTotal = 0;
let computerCards = [];

const newGameButton = document.querySelector('.new-game-button');
const hitButton = document.querySelector('.hit-button');
const standButton = document.querySelector('.stand-button');
const pcCards = document.getElementById('pc-cards');
const playerCards = document.getElementById('player-cards');
const pcScore = document.getElementById('pc-score');
const playerScore = document.getElementById('player-score');
const playerWallet = document.getElementById('wallet');
const bet = document.getElementById("bet");
playerWallet.innerHTML = wallet;

const testCards = document.getElementById('cards-test');

let card = 0;
let number = 0;
let currentBet;

let imgFolder = "./cards";
let imgExtension = ".png";
let cardImg;
testCards.innerHTML = '<img src="' + cardImg + '" alt="">'

function updateCards() {
    cardImg = imgFolder + "/" + card + imgExtension;
    testCards.innerHTML += '<img src="' + cardImg + '" alt="">';
}

function resetGame() {
    cards = [];
    total = 0;
    computerTotal = 0;
    computerCards = [];
    card = 0;
    number = 0;
    hitButton.disabled = false;
    standButton.disabled = false;
    pcCards.innerHTML = '';
    playerCards.innerHTML = '';
    pcScore.innerHTML = '';
    playerScore.innerHTML = '';
    testCards.innerHTML = '';
}

function extractNumber(str) {
    return str.match(/(\d+)/);
}

function getRandomNumber(arr) {
    return Math.floor(Math.random()*arr.length);
}

function generateCard() {
    if (cards.length == 52) {
        console.log("Deck is empty");
        return;
    }

    do {
        card = numbers[getRandomNumber(numbers)].concat('', suits[getRandomNumber(suits)]);
    } while (cards.includes(card))

    cards.push(card);
    return card;
}

function containsNumbers(str) {
    return /\d/.test(str);
}

function checkBet() {
    if (bet.value > wallet) {
        console.log("Insufficient funds, set less bet");
        newGameButton.disabled = true;
    } else if (wallet == 0) {
        console.log("You are out of money");
        newGameButton.disabled = true;
    } else {
        newGameButton.disabled = false;
    }
}

bet.addEventListener('input', () => {
    checkBet();
});

function getCardValue() {
    if (containsNumbers(card) == true) {
        number = parseInt(extractNumber(card)[0]);
        return number;
    } else {
        switch(true) {
            case card.includes("A"):
                if (total > 10) {
                number = 1;
                } else {
                    number = 11;
                }
                break;
            case ["J", "K", "Q"].some(el => card.includes(el)):
                number = 10;
                break;
        }
        return number;
    }
}

function countTotal(number) {
    total += number;
}

function countTotalPc(number) {
    computerTotal += number;
}

function disableButtons() {
    hitButton.disabled = true;
    standButton.disabled = true;
}

function win() {
    wallet = wallet + currentBet;
    playerWallet.innerHTML = wallet;
    disableButtons();
    console.log("You win");
    checkBet();
}

function loose() {
    wallet = wallet - currentBet;
    playerWallet.innerHTML = wallet;
    disableButtons();
    console.log("You loose");
    checkBet();
}

function checkResults (total) {
    if (total == 21) {
        win();
    } else if (total > 21) {
        loose();
    }
}

function hit() {
    generateCard();
    getCardValue();
    updateCards();
    countTotal(number);
    playerCards.innerHTML += card + " ";
    playerScore.innerHTML = total;
}

function hitPc() {
    generateCard();
    getCardValue();
    countTotalPc(number);
    pcCards.innerHTML += card + " ";
    pcScore.innerHTML = computerTotal;
}

newGameButton.addEventListener('click', () => {
    resetGame();
    currentBet = parseInt(bet.value);
    hit();
    hit();
    hitPc();
    hitPc();
    newGameButton.disabled = true;
    checkResults(total);    
});

hitButton.addEventListener('click', () => {
    hit();
    checkResults(total);
});

function pcStand() {
    if (computerTotal > 17) {
        if (computerTotal > 21 || computerTotal < total) {            
            win();
        } else {            
            loose();
        }
    }
}

standButton.addEventListener('click', () => {
    hitPc();
    checkResults(total);
    pcStand();
});

/*Naturals.
If a player's first two cards are an ace and a "ten-card" (a picture card or 10), giving a count of 21 in two cards, this is a natural or "blackjack." 
If any player has a natural and the dealer does not, the dealer immediately pays that player one and a half times the amount of their bet.
*/