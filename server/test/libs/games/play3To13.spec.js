const Play3To13 = require('../../../libs/games/play3To13');

describe('A game', function() {
  
  it('Create game', function() {
    Play3To13.create();
  });

  it('Have 2 players join', function() {
    Play3To13.joinMember();
    Play3To13.lockGame();
  });
  
  describe('Start game with first hand', () => {

    it('Start first hand for 2 player game', function() {
      Play3To13.addCards();
      Play3To13.dealHands();
    });
  
    it('player 1 arrange cards', function() {
      Play3To13.arrangeCards();
    });
  
    it('player 2 arranges cards', function() {
      Play3To13.playTurn();
    });
  
    it('player 2 arranges cards', function() {
      Play3To13.playTurn();
    });
  
    it('player 1 plays turn', function() {
      Play3To13.playTurn();
    });
  
    it('player 2 plays turn', function() {
      Play3To13.playTurn();
    });
  
    it('player 1 plays turn and nocks', function() {
      Play3To13.playTurn();
    });
  
    it('player 2 plays turn', function() {
      Play3To13.playTurn();
    });
  
    it('finish hand', function() {
      Play3To13.finishHand();
      Play3To13.saveScore();
    });
  });

  describe('Fast forward to last hand', () => {

    it('Start last hand for 2 player game', function() {
      Play3To13.addCards();
      Play3To13.dealHands();
    });
  
    it('player 1 arrange cards', function() {
      Play3To13.arrangeCards();
    });
  
    it('player 2 arranges cards', function() {
      Play3To13.playTurn();
    });
  
    it('player 2 arranges cards', function() {
      Play3To13.playTurn();
    });
  
    it('player 1 plays turn', function() {
      Play3To13.playTurn();
    });
  
    it('player 2 plays turn', function() {
      Play3To13.playTurn();
    });
  
    it('player 1 plays turn and nocks', function() {
      Play3To13.playTurn();
    });
  
    it('player 2 plays turn', function() {
      Play3To13.playTurn();
    });
  
    it('finish hand', function() {
      Play3To13.finishHand();
      Play3To13.saveScore();
    });

    it('Calculate winner', function() {
      Play3To13.calculateWinner();
      Play3To13.saveWinner();
      Play3To13.endGame();
    });
  });

});