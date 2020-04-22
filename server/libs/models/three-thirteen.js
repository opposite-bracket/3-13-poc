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
const LAST_HAND_COUNT = 11;

/**
 * @TODO: move to MongoDB
 */
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

/**
 * @TODO: do this in one single query
 * @TODO: add validation (when writing the service) rules:
 *    . ensure there's at least 2 players
 */
module.exports.createCurrentHand = async (gameId, cards) => {
  console.debug(`adding cards for game #${gameId}`);
  
  const collection = await getCollection();
  const game = await collection.findOne({ _id: gameId });
  const firstPlayerId = game.players[0]._id;
  const commandResult = await collection.updateOne({
    _id: gameId
  }, {
    $set: {
      currentRound: {
        nockingPlayerId: null,
        currentTurn: firstPlayerId,
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

  // top card of the discard pile for users to opt to
  game.currentRound.discardPile.push(game.currentRound.cards.pop());

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

module.exports.arrangeCards = async (gameId, playerId, cards) => {
  console.debug(`lock game #${gameId}`);
  
  const collection = await getCollection();
  const commandResult = await collection.updateOne({
    _id: gameId
  }, {
    $set: {
      [`currentRound.hands.${playerId}`]: cards,
    }
  });
  console.debug('game locked', commandResult.result);

  return commandResult.result;
};

module.exports.startTurn = async (gameId, playerId, picksFromDeck = true) => {
  console.debug(`player #${playerId} plays turn in game #${gameId}`);

  const collection = await getCollection();
  const game = await collection.findOne({ _id: gameId });
  const card = picksFromDeck
    ? game.currentRound.cards.pop()
    : game.currentRound.discardPile.pop();

  game.currentRound.hands[playerId].push(card);
  // @TODO: minor improvement could be to only update
  //        either discardPile or cards but not both
  const commandResult = await collection.updateOne({
    _id: gameId
  }, {
    $set: {
      'currentRound.discardPile': game.currentRound.discardPile,
      'currentRound.cards': game.currentRound.cards,
      [`currentRound.hands.${playerId}`]: game.currentRound.hands[playerId],
    }
  });
  console.debug(`player #${playerId} played turn in game #${gameId}`);

  return commandResult.result;
};

/**
 * @TODO: add validation (when writing the service) rules:
 *    . playerId belongs to expected player to play
 *    . card exists in expected player's hand
 */
module.exports.finishTurn = async (gameId, playerId, cardToDiscard, nocks = false) => {
  console.debug(`player #${playerId} plays turn in game #${gameId}`);

  const collection = await getCollection();
  const game = await collection.findOne({ _id: gameId });

  const cardIndex = game.currentRound.hands[playerId].indexOf(cardToDiscard);

  const [card] = game.currentRound.hands[playerId].splice(cardIndex, 1);
  game.currentRound.discardPile.push(card);

  game.currentRound.currentTurn++;

  game.currentRound.nockingPlayerId = nocks ? playerId : null;

  const commandResult = await collection.updateOne({
    _id: gameId
  }, {
    $set: {
      'currentRound.currentRoundIndex': game.currentRound.currentTurn,
      'currentRound.nockingPlayerId': game.currentRound.nockingPlayerId,
      'currentRound.discardPile': game.currentRound.discardPile,
      [`currentRound.hands.${playerId}`]: game.currentRound.hands[playerId],
    }
  });
  console.debug(`player #${playerId} played turn in game #${gameId}`);

  return commandResult.result;
};

/**
 * @TODO: this can be done with 1 query
 * @TODO: add validation (when writing the service)
 *    . nockingPlayerId must match playerId
 */
module.exports.finishRound = async (gameId, playerId, cards = []) => {
  console.debug(`marking player #${playerId} as winner of #${gameId}`);

  const collection = await getCollection();
  const game = await collection.findOne({ _id: gameId });

  if( game.currentRoundIndex === LAST_HAND_COUNT ) {
    game.status = GAME_STATUS.locked;
  }

  const commandResult = await collection.updateOne({
    _id: gameId
  }, {
    $set: {
      status: game.status,
      previousRounds: game.currentRound,
      currentRound: {
        nockingPlayerId: null,
        currentTurn: 0,
        cards,
        discardPile: [],
        hands: {}
      }
    }
  });
  console.debug('hand finished', commandResult.result);

  return commandResult.result;
};

module.exports.endGame = async () => {};