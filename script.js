let hit_El = document.getElementById("hit")
let stand_El = document.getElementById("stand")
let start_game = document.getElementById("start-game")

let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let hidden;
let deck;

let canHit = true;

// start button will populate the dealer and players cards
start_game.addEventListener('click', () => {
    buildDeck();
    shuffleDeck();
    startGame();
    hit_El.style.display = ""
    stand_El.style.display = ""
    start_game.style.display = "none"
})


// load game with a start button
window.onload = function() {
    hit_El.style.display = "none"
    stand_El.style.display = "none"
}

// function to build deck
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            // we saved card in this format 3-H(3 of hearts) so we can call the card image
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

// shuffle deck
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }

    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop()
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }


    for (let i = 0; i < 2; i++) {

        let cardImg = document.createElement("img");
        let card = deck.pop()
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);

    }

    console.log(yourSum);
    hit_El.addEventListener("click", hit)
    stand_El.addEventListener("click", stand)
}


function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop()
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
        document.getElementById("results").innerText = "Dealer wins"
    }

    document.getElementById("your-sum").innerText = yourSum;
}

function stand() {

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "You Lost!";
    } else if (dealerSum > 21) {
        message = "You Won!";
    } else if (yourSum > 21 && dealerSum > 21) {
        message = "Its A Tie"
    } else if (yourSum == dealerSum) {
        message = "It's A Tie!";
    } else if (yourSum > dealerSum) {
        message = "You Won!";
    } else if (yourSum < dealerSum) {
        message = "You Lost!";
    } else if (yourSum === 21 && yourSum > dealerSum) {
        message = "IT'S A BLACKJACK : You Won"
    } else if (dealerSum === 21 && yourSum < dealerSum) {
        message = "IT'S A BLACKJACK : You Lost"
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("results").innerText = message;
    document.getElementById("your-sum").innerText = yourSum;

}



function getValue(card) {
    let data = card.split("-");
    let value = data[0]

    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
    }

    return parseInt(value);
}


function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}