const MongoDB = require('./db');
const Deck = require('./deck');

/**
 * @TODO: Right now i'm placing all the logic
 *        in this model which it will not perform
 *        well but it will. Later on, i should
 *        move this over into a service.
 */

const COLLECTION = 'three_thirteen_games';

const GAME_STATUS = module.exports.GAME_STATUS = {
  // open for people to join
  open: 'OPEN',
  // locked, game in progress
  locked: 'LOCKED',
  // finished
  finished: 'FINISHED'
};
const FIRST_HAND_CARD_COUNT = 3;

const getCollection = async () => {
  console.debug(`getting collection ${COLLECTION}`);
  const mongo = await MongoDB.init();

  return mongo.db.collection(COLLECTION);
};

module.exports.getGame = async (gameId) => {
  console.debug(`loading game #${gameId}`);
  const collection = await getCollection();
  return await collection.findOne({ _id: gameId });
};

module.exports.createGame = async (creatorId, creatorName, shuffleCount) => {
  console.debug(`creating new threeThirteen game for creator #${creatorId}`);
  
  const collection = await getCollection();
  const commandResult = await collection.insert({
    creatorId,
    shuffleCount,
    currentTurn: 0,
    currentRoundIndex: 0,
    status: GAME_STATUS.open,
    players: [ { _id: creatorId, name: creatorName } ]
  });
  console.debug('game created', commandResult.result);

  return commandResult.ops[0];
};

module.exports.joinPlayer = async (gameId, playerId, playerName) => {
  console.debug(`user #${playerId} joining game #${gameId}`);
  
  const collection = await getCollection();
  const commandResult = await collection.updateOne({
    _id: gameId
  }, {
    $push: {
      players: {_id: playerId, name: playerName}
    }
  });
  console.debug('player joined game', commandResult.result);

  return commandResult.result;
};

module.exports.createCurrentHand = async (gameId, cards) => {
  console.debug(`adding cards for game #${gameId}`);
  
  const collection = await getCollection();
  const commandResult = await collection.updateOne({
    _id: gameId
  }, {
    $set: {
      currentRound: {
        cards,
        discardPile: [],
        hands: {}
      }
    }
  });
  console.debug('cards added', commandResult.result);

  return commandResult.result;
};

module.exports.dealHands = async (gameId) => {
  console.debug(`dealing hand for game #${gameId}`);
  
  const collection = await getCollection();
  const game = await collection.findOne({ _id: gameId });

  Deck.shuffleCards(game.currentRound.cards, game.shuffleCount);

  // the game starts with dealing 3 cards per player
  // so we'll increase that as rounds are played
  const cardCountToHandOut = FIRST_HAND_CARD_COUNT + game.currentRoundIndex;
  
  // one card is handed to each player
  for(let i = 0; i < cardCountToHandOut; i++) {
    // get one
    game.players.forEach(player => {
      const card = game.currentRound.cards.pop();
      if ( player._id in game.currentRound.hands ) {
        game.currentRound.hands[player._id].push(card);
      } else {
        game.currentRound.hands[player._id] = [card]
      }
    });
  }

  const commandResult = await collection.updateOne({
    _id: gameId
  }, {
    $set: {
      'currentRound': game.currentRound
    }
  });
  console.debug('cards dealt', commandResult.result);

  return commandResult.result;
};

module.exports.lockGame = async (gameId) => {
  console.debug(`lock game #${gameId}`);
  
  const collection = await getCollection();
  const commandResult = await collection.updateOne({
    _id: gameId
  }, {
    $set: {
      status: GAME_STATUS.locked,
    }
  });
  console.debug('game locked', commandResult.result);

  return commandResult.result;
};

module.exports.arrangeCards = async (gameId, userId, cards) => {
  console.debug(`lock game #${gameId}`);
  
  const collection = await getCollection();
  const commandResult = await collection.updateOne({
    _id: gameId
  }, {
    $set: {
      [`currentRound.hands.${userId}`]: cards,
    }
  });
  console.debug('game locked', commandResult.result);

  return commandResult.result;
};
module.exports.playTurn = async () => {};
module.exports.finishHand = async () => {};
module.exports.saveScore = async () => {};
module.exports.calculateWinner = async () => {};
module.exports.saveWinner = async () => {};
module.exports.endGame = async () => {};