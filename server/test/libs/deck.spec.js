const Assert = require('chai').assert;
const Deck = require('../../libs/deck');

describe('A deck of cards', function() {
  
  before(function() {
    this.cards = Deck.createDeckOfcards();
  });

  it('should have 54 cards including jokers', function () {
    Assert.equal(this.cards.length, 54, 'A deck should have 52 cards');
  });

  it('is initially sorted', function () {
    const suit = Deck.SUITS[Deck.SUIT_NAMES.CLUBS];
    const clubCards = this.cards.slice(0, 13)
    clubCards.forEach(clubCard => {
      Assert.include(clubCard, `-${suit}`, `${clubCard} is not a club card`);
    });
  });

  it('and can be shuffled', function () {
    const sampleCount = 10;
    const first10Cards = this.cards.slice(0, sampleCount);

    Deck.shuffleCards(this.cards, 8);

    Assert.notEqual(first10Cards, this.cards.slice(0, sampleCount));
  });
  
});