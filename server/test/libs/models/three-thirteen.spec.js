const Assert = require('chai').assert;
const ObjectId = require('mongodb').ObjectId;
const threeThirteen = require('../../../libs/models/three-thirteen');
const Deck = require('../../../libs/models/deck');

describe.only('A game', function() {

  before(function() {
    this.shuffleCount = 2;
    this.userA = {
      _id: ObjectId(),
      name: 'User A'
    };
    this.userB = {
      _id: ObjectId(),
      name: 'User B'
    };
    this.players = [
      this.userA,
      this.userB
    ]
  });
  
  it('Create game', async function() {
    this.game = await threeThirteen.createGame(this.userA._id, this.userA.name, this.shuffleCount);
    Assert.isNotEmpty(this.game._id);
    Assert.equal(this.game.creatorId, this.userA._id);
    // players
    Assert.equal(this.game.players.length, 1);
    Assert.deepEqual(this.game.players[0], this.userA);
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
      const handCreationResult = await threeThirteen.createCurrentHand(this.game._id, this.cards);
      Assert.equal(handCreationResult.nModified, 1);
    });

    it('Deal hand to players', async function() {
      const dealHandsResult = await threeThirteen.dealHands(this.game._id);
      Assert.equal(dealHandsResult.nModified, 1);
    });
  
    // it('lock game', async function() {
    //   threeThirteen.lockGame();
    // });
  
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