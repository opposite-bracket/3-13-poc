const SUIT_NAMES = module.exports.SUIT_NAMES = {
  DIAMONDS: 'DIAMONDS',
  CLUBS: 'CLUBS',
  HEARTS: 'HEARTS',
  SPADES: 'SPADES',
  JOKER: 'JOKER'
};

const SUITS = module.exports.SUITS = {
  [SUIT_NAMES.CLUBS]: 'C',
  [SUIT_NAMES.DIAMONDS]: 'D',
  [SUIT_NAMES.HEARTS]: 'H',
  [SUIT_NAMES.SPADES]: 'S',
  [SUIT_NAMES.JOKER]: 'JK'
};

module.exports.createDeckOfcards = () => {
  const deck = new Array();

  Object.keys(SUITS).forEach(suitKey => {
    const value = SUITS[suitKey];

    if(value === SUITS.JOKER) {
      deck.push(`${value}`);
      deck.push(`${value}`);
      return;
    }

    for (let i = 1; i <= 13; i++) {
      switch (i) {
        case 1:
          deck.push(`A-${value}`);
          break;
        case 11:
          deck.push(`J-${value}`);
          break;
        case 12:
          deck.push(`Q-${value}`);
          break;
        case 13:
          deck.push(`K-${value}`);
          break;
        default:
          deck.push(`${i}-${value}`);
          break;
      }
    }
  });

  return deck;
}

module.exports.shuffleCards = (cards, numOfShuffles) => {
  let counter = cards.length;

  for(let i = 0; i < numOfShuffles; i++) {
    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = cards[counter];
      cards[counter] = cards[index];
      cards[index] = temp;
    }
  }

  return cards;
}
