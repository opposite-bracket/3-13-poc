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
    this.userB = {
      _id: ObjectId(),
      name: 'User B'
    };
    this.players = [
      this.playerA,
      this.userB
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
    // current turn
    Assert.equal(this.game.currentTurn, 0);
    // current round index
    Assert.equal(this.game.currentRoundIndex, 0);
    // set shuffle count
    Assert.equal(this.game.shuffleCount, this.shuffleCount);
  });

  it('Have 2 players join', async function() {
    const result = await threeThirteen.joinPlayer(
      this.game._id, this.userB._id, this.userB.name
    );

    Assert.equal(result.nModified, 1);
  });
  
  describe('Start game with first hand', function() {

    before(function () {
      this.cards = Deck.createDeckOfcards();
    });

    it('Create hand for first turn in first round in a 2 player game', async function() {
      const result = await threeThirteen.createCurrentHand(this.game._id, this.cards);
      Assert.equal(result.nModified, 1);
    });

    it('Deal hand to players', async function() {
      const result = await threeThirteen.dealHands(this.game._id);
      Assert.equal(result.nModified, 1);
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

      Assert.notEqual(oldArrangement, cards);
      Assert.equal(result.nModified, 1);
    });
  
    it('player 1 starts turn picking up from the pile', async function() {
      const result = await threeThirteen.startTurn(this.game._id, this.playerA._id);
      Assert.equal(result.nModified, 1);
    });

    it('player 2 finishes turn picking up from the pile', async function() {
      const game = await threeThirteen.getGame(this.game._id);
      const cardToDiscard = game.currentRound.hands[this.playerA._id].pop();
      const result = await threeThirteen.finishTurn(this.game._id, this.playerA._id, cardToDiscard);
      Assert.equal(result.nModified, 1);
    });
  
  //   it('player 2 plays turn', function() {
  //     threeThirteen.playTurn();
  //   });
  
  //   it('player 1 plays turn and nocks', function() {
  //     threeThirteen.playTurn();
  //   });
  
  //   it('player 2 plays turn', function() {
  //     threeThirteen.playTurn();
  //   });
  
  //   it('finish hand', function() {
  //     threeThirteen.finishHand();
  //     threeThirteen.saveScore();
  //   });
  });

  describe('Fast forward to last hand', () => {
    // before(function () {
    //   this.cards = Deck.createDeckOfcards();
    // });

  //   it('Start last hand for 2 player game', function() {
  //     threeThirteen.addCards();
  //     threeThirteen.dealHands();
  //   });
  
  //   it('player 1 arrange cards', function() {
  //     threeThirteen.arrangeCards();
  //   });
  
  //   it('player 2 arranges cards', function() {
  //     threeThirteen.playTurn();
  //   });
  
  //   it('player 2 arranges cards', function() {
  //     threeThirteen.playTurn();
  //   });
  
  //   it('player 1 plays turn', function() {
  //     threeThirteen.playTurn();
  //   });
  
  //   it('player 2 plays turn', function() {
  //     threeThirteen.playTurn();
  //   });
  
  //   it('player 1 plays turn and nocks', function() {
  //     threeThirteen.playTurn();
  //   });
  
  //   it('player 2 plays turn', function() {
  //     threeThirteen.playTurn();
  //   });
  
  //   it('finish hand', function() {
  //     threeThirteen.finishHand();
  //     threeThirteen.saveScore();
  //   });

  //   it('Calculate winner', function() {
  //     threeThirteen.calculateWinner();
  //     threeThirteen.saveWinner();
  //     threeThirteen.endGame();
  //   });
  });

});