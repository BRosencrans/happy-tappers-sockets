const cards = [
    { src: "/cards/budgie.png" },
    { src: "/cards/crane.png" },
    { src: "/cards/duck.png" },
    { src: "/cards/flamingo.png" },
    { src: "/cards/parrot.png" },
    { src: "/cards/penguin.png" },
    { src: "/cards/toucan.png" },
];

class memGameManagement {
    constructor(players) {
        this.timer = 60;
        this.cards = this.shuffle([...cards, ...cards].map((card) => ({ ...card })));
        this.players = players;
        this.clickedCards = [];
        this.matches = [];
        this.playerTurn = players[Math.floor(Math.random() * players.length)];
    }

    //returns an array of shuffled cards
    shuffle(cards) {
        return cards.map(({ src }) => {
            const randomOrder = Math.floor(Math.random() * cards.length);
            const card = {
                src,
                matched: false,
                order: randomOrder,
                id: (Math.random() + 1).toString(36).substring(7),
            };
            return card;
        });
    }

    // return what card was chosen
    choice(id) {
        // search for a card with the id and return that id
        const card = this.cards.find((card) => card.id == id);

        // if there's no card OR if there's no flippable card OR if clickedCards are already at two to compare then just return what the current clicked cards are.
        if (!card || !this.flippable(id) || this.clickedCards.legnth >= 2) {
            return this.clickedCards;
        }
        // add the card to clicked cards if it is a choice
        this.clickedCards.push(card);

        // return what the clicked cards are
        return this.clickedCards;
    }

    // Checks if a card can be flipped
    flippable(id) {
        // is the card flipped already?
        const checkClickedCards = this.clickedCards.some((card) => card.id == id);
        const checkMatchedCards = this.matches.some((card) => card.id == id);
        // if the card is already flipped then we want to return the opposite value to indicate true it is flippable or false it is not flippable.
        return !(checkClickedCards || checkMatchedCards);
    }

    // Checks if cards are a match
    match() {
        //get the two choices from the clicked cards array.
        const [choiceOne, choiceTwo] = this.clickedCards;
        // compare the images of the choices
        const isMatch = choiceOne.src == choiceTwo.src;
        // clear out the chosen cards after comparing
        this.clickedCards = [];
        // if there's a match, set the value of the cards matched to true from false and track them in the matches array
        if (isMatch) {
            choiceOne.matched = true;
            choiceTwo.matched = true;
            this.matches.push(choiceOne, choiceTwo);
        }

        return isMatch;
    }

    setTurn() {
        //rotates through the players in order
        const currPlayerIndex = this.players.indexOf(this.playerTurn);
        let nextPlayerIndex;
        if (currPlayerIndex + 1 > this.players.length) {
            nextPlayerIndex = 0;
        } else {
            nextPlayerIndex = currPlayerIndex + 1;
        }
        this.playerTurn = this.players[nextPlayerIndex];
    }

    //end condiditon = all cards are inside of matches. AKA when matches.length == cards.length (16).
    gameEnd() {
        return this.matches.length == this.cards.length;
    }
}

module.exports = memGameManagement;
