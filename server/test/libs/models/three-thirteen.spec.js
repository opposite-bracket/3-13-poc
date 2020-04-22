const Assert = require('chai').assert;
const ObjectId = require('mongodb').ObjectId;
const threeThirteen = require('../../../libs/models/three-thirteen');
const Deck = require('../../../libs/models/deck');

describe('A game', function() {

  before(function() {
    this.shuffleCount = 2;
    this.playerA = {
      _id: ObjectId(),
      name: 'User A'
    };
    this.playerB = {
      _id: ObjectId(),
      name: 'User B'
    };
    this.players = [
      this.playerA,
      this.playerB
    ]
  });
  
  it('Create game', async function() {
    this.game = await threeThirteen.createGame(this.playerA._id, this.playerA.name, this.shuffleCount);
    Assert.isNotEmpty(this.game._id);
    Assert.equal(this.game.creatorId, this.playerA._id);
    // players
    Assert.equal(this.game.players.length, 1);
    Assert.deepEqual(this.game.players[0], this.playerA);
    // status
    Assert.equal(this.game.status, threeThirteen.GAME_STATUS.open);
    // current round index
    Assert.equal(this.game.currentRoundIndex, 0);
    // set shuffle count
    Assert.equal(this.game.shuffleCount, this.shuffleCount);
    Assert.equal(this.game.nockedPlayerId, null);
  });

  it('Have 2 players join', async function() {
    const result = await threeThirteen.joinPlayer(
      this.game._id, this.playerB._id, this.playerB.name
    );

    Assert.equal(result.nModified, 1);
  });
  
  describe('Actions in a hand', function() {

    before(function () {
      this.cards = Deck.createDeckOfcards();
      this.testCurrentRound = (
        game, currentRoundIndex, nockingPlayerId, currentTurn,
        cardLength, discardPileLength, handsLength, playerAHandLength,
        playerBHandLength
      ) => {
        Assert.equal(game.currentRoundIndex, currentRoundIndex);
        Assert.equal(game.currentRound.nockingPlayerId, nockingPlayerId);
        Assert.equal(game.currentRound.currentTurn, currentTurn);
        Assert.equal(game.currentRound.cards.length, cardLength);
        Assert.equal(game.currentRound.discardPile.length, discardPileLength);
        Assert.equal(Object.keys(game.currentRound.hands).length, handsLength);
        Assert.equal(game.currentRound.hands[this.playerA._id].length, playerAHandLength);
        Assert.equal(game.currentRound.hands[this.playerB._id].length, playerBHandLength);
      };
    });

    it('Create hand for first turn in first round in a 2 player game', async function() {
      const result = await threeThirteen.createCurrentHand(this.game._id, this.cards);

      const updatedGame = await threeThirteen.getGame(this.game._id);

      Assert.equal(
        result.nModified,
        1
      );

      Assert.equal(updatedGame.currentRoundIndex, 0);
      Assert.equal(updatedGame.currentRound.nockingPlayerId, null);
      Assert.equal(updatedGame.currentRound.currentTurn, this.playerA._id.toString());
      Assert.equal(updatedGame.currentRound.cards.length, 54);
      Assert.equal(updatedGame.currentRound.discardPile.length, 0);
      Assert.equal(Object.keys(updatedGame.currentRound.hands).length, 0);
    });

    it('Deal hand to players', async function() {
      const result = await threeThirteen.dealHands(this.game._id);
      
      const updatedGame = await threeThirteen.getGame(this.game._id);
      Assert.equal(result.nModified, 1);

      this.testCurrentRound(
        updatedGame, 0, null, this.playerA._id.toString(), 47, 1, 2, 3, 3
      );
    });
  
    it('lock game', async function() {
      const result = await threeThirteen.lockGame(this.game._id);
      Assert.equal(result.nModified, 1);
    });
  
    it('player 1 arranges cards', async function() {
      const game = await threeThirteen.getGame(this.game._id);
      const cards = game.currentRound.hands[this.playerA._id];
      const oldArrangement = Array.from(cards);

      // move first card to the middle
      const firstCard = cards.shift();
      cards.splice(1, 0, firstCard);
      
      const result = await threeThirteen.arrangeCards(
        this.game._id, this.playerA._id, cards
      );

      const updatedGame = await threeThirteen.getGame(this.game._id);

      Assert.notEqual(oldArrangement, cards);
      Assert.equal(result.nModified, 1);

      this.testCurrentRound(
        updatedGame, 0, null, this.playerA._id.toString(), 47, 1, 2, 3, 3
      );
    });
  
    it('player 1 starts turn picking up from the deck', async function() {
      const result = await threeThirteen.startTurn(this.game._id, this.playerA._id);
      
      const updatedGame = await threeThirteen.getGame(this.game._id);
      Assert.equal(result.nModified, 1);

      this.testCurrentRound(
        updatedGame, 0, null, this.playerA._id.toString(), 46, 1, 2, 4, 3
      );
    });

    it('player 1 finishes turn picking up from the deck', async function() {
      const game = await threeThirteen.getGame(this.game._id);
      const cardToDiscard = game.currentRound.hands[this.playerA._id].pop();
      const result = await threeThirteen.finishTurn(this.game._id, this.playerA._id, cardToDiscard);
      
      const updatedGame = await threeThirteen.getGame(this.game._id);
      Assert.equal(result.nModified, 1);

      this.testCurrentRound(
        updatedGame, 0, null, this.playerA._id.toString(), 46, 2, 2, 3, 3
      );
    });

    it('player 2 starts turn picking up from the discard pile and nocks', async function() {
      const result = await threeThirteen.startTurn(this.game._id, this.playerB._id, false);
      
      const updatedGame = await threeThirteen.getGame(this.game._id);
      Assert.equal(result.nModified, 1);
      this.testCurrentRound(
        updatedGame, 0, null, this.playerA._id.toString(), 46, 1, 2, 3, 4
      );
    });

    it('player 2 finishes turn picking up from the discard pile and nocks', async function() {
      const game = await threeThirteen.getGame(this.game._id);
      const cardToDiscard = game.currentRound.hands[this.playerB._id].pop();
      const result = await threeThirteen.finishTurn(this.game._id, this.playerB._id, cardToDiscard, true);
      
      const updatedGame = await threeThirteen.getGame(this.game._id);
      this.testCurrentRound(
        updatedGame, 0, this.playerB._id.toString(), this.playerA._id.toString(), 46, 2, 2, 3, 3
      );
    });

    // it('Mark player 1 as hand winner', async function () {
    //   this.cards = Deck.createDeckOfcards();
    //   const result = await threeThirteen.finishRound(this.game._id, this.playerA._id, this.cards);

    //   const updatedGame = await threeThirteen.getGame(this.game._id);
    //   Assert.equal(result.nModified, 1);
    // });
  });

});