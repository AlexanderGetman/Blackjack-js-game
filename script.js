let suits = ["H","S","C","D"];
let numbers = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
let cards = [];
let total = 0;
let wallet = 100;
let buttons = document.getElementsByTagName("button");

let computerTotal = 0;
let computerCards = [];

let playerCards = [];
let pcCards = [];

const gameTable = document.querySelector('.game-table');
const newGameButton = document.querySelector('.new-game-button');
const hitButton = document.querySelector('.hit-button');
const standButton = document.querySelector('.stand-button');
const pcScore = document.getElementById('pc-score');
const playerScore = document.getElementById('player-score');
const playerWallet = document.getElementById('wallet');
const bet = document.getElementById("bet");
const resultDisplay = document.querySelector('.result');
playerWallet.innerHTML = wallet;

const playerCardsDisplay = document.getElementById('cards-player');
const pcCardsDisplay = document.getElementById('cards-pc');

let card = 0;
let number = 0;
let currentBet;

let imgFolder = "./cards";
let imgExtension = ".png";

hitButton.disabled = true;
standButton.disabled = true;

function resetGame() {
    cards = [];
    total = 0;
    computerTotal = 0;
    computerCards = [];
    card = 0;
    number = 0;
    hitButton.disabled = false;
    standButton.disabled = false;
    pcCards = [];
    playerCards = [];
    pcScore.innerHTML = '';
    playerScore.innerHTML = '';
    playerCardsDisplay.innerHTML = '';
    pcCardsDisplay.innerHTML = '';
    resultDisplay.innerHTML = '';
}

function extractNumber(str) {
    return str.match(/(\d+)/);
}

function getRandomNumber(arr) {
    return Math.floor(Math.random()*arr.length);
}

function generateCard() {
    if (cards.length == 52) {
        resultDisplay.innerHTML = "Deck is empty";
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
        resultDisplay.innerHTML =  "Insufficient funds, set less bet";
        newGameButton.disabled = true;
    } else if (wallet == 0) {
        resultDisplay.innerHTML = "You are out of money";
        newGameButton.disabled = true;
    } else if (bet.value < 10) {
        resultDisplay.innerHTML =  "Bet can't be lower then 10";
        newGameButton.disabled = true;
    } else {
        resultDisplay.innerHTML =  "";
        newGameButton.disabled = false;
    }
}

bet.addEventListener('input', () => {
    checkBet();
});

function getCardValue(total) {
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
    checkBet();
    resultDisplay.innerHTML = "You win!";
}

function loose() {    
    wallet = wallet - currentBet;
    playerWallet.innerHTML = wallet;
    disableButtons();
    checkBet();
    resultDisplay.innerHTML = "You loose!";
}

function checkResults (total) {
    if (total == 21) {        
        win();        
    } else if (total > 21) {        
        loose();
    } else if (computerTotal >= 17) {
        if (computerTotal > 21 || computerTotal < total) {            
            win();
        } else {
            loose();
        }
    }
}

function hit() {
    generateCard();
    getCardValue(total);
    cardImg = imgFolder + "/" + card + imgExtension;
    playerCardsDisplay.innerHTML += '<img src="' + cardImg + '" alt="">';
    countTotal(number);
    playerCards.push(card);
    playerScore.innerHTML = total;
}

function hitPc() {
    generateCard();
    getCardValue(computerTotal);
    cardImg = imgFolder + "/" + card + imgExtension;
    pcCardsDisplay.innerHTML += '<img src="' + cardImg + '" alt="">';
    countTotalPc(number);
    pcCards.push(card);
    pcScore.innerHTML = computerTotal;
}

function natural() {
    if (total == 21) {
        currentBet = currentBet * 1.5;
        resultDisplay.innerHTML += " Natural!";
    }    
}

newGameButton.addEventListener('click', () => {
    resetGame();
    currentBet = parseInt(bet.value);
    hit();
    hit();
    hitPc();
    pcCardsDisplay.innerHTML += '<img src="./cards/back.png" alt="">';    
    newGameButton.disabled = true;
    checkResults(total);
    natural();
});

hitButton.addEventListener('click', () => {
    hit();
    checkResults(total);
});

function pcStand() {
    var backImg = document.querySelector('img[src="./cards/back.png"]');
    backImg.parentNode.removeChild(backImg);

    while (computerTotal < 17) {
        hitPc();
        checkResults(total);
    }
}

standButton.addEventListener('click', () => {
    hitPc();
    checkResults(total);
    pcStand();
});