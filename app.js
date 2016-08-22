// Game constructor which will create the objects like the hand, cards, player/dealer .
$(function () {
  var game = new Game();

});

function Game() {

  this.suits = ["spades", "diamonds", "hearts", "clubs"];
  this.names = ["ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king"];
  this.deck = [];
  this.scores = {"player" : 0, "dealer" : 0};
  this.whoPlays = {"player" : [], "dealer" : []};
  this.hand = "";
  this.count = 0;
  for (var s in this.suits) {
    for (var n in this.names) {
      this.deck.push(new Card(this.suits[s], this.names[n]));
    }
  }
  this.addEventListeners();
  console.log(this.deck);

}

function Card(suit, name) {
  this.suits = suit;
  this.names = name;
}

Game.prototype.addEventListeners = function() {

  $('#new').click(function (event) {
    event.preventDefault();
    this.newGame();
  }.bind(this));

  $('#hit').click(function (event) {
    event.preventDefault();
    this.hit();
  }.bind(this));

  $('#stand').click(function (event) {
    event.preventDefault();
    this.win();
  }.bind(this));
};

// When the new game button is clicked 2 random cards are  placed in the hand of both the dealer and player. Dealer has the hole card.

Game.prototype.newGame = function(s, n) {
  this.count = 0;
  this.scores.player = 0;
  this.scores.dealer = 0;
  this.whoPlays.player = [];
  this.whoPlays.dealer = [];
  $('p').remove();
  this.shuffle();
  this.Deal('#pcard1');
  this.Deal('#dcard1');
  this.Deal('#pcard2');
  this.Deal('#dcard2');
  $('#dcard1 p').hide();
  this.addScore();

};

Game.prototype.Deal = function (player) {


  var getEle = this.deck.shift();
  function getValues(s, n) {
    var getS = s;
    var getN = n;
    var result = getN + " of " + getS;
    return result;
  }

    this.hand = (this.count%2===0) ? "player" : "dealer";


    if (this.count%2===0) {
      this.whoPlays[this.hand].push(getEle);
      $(player).append('<p>' + getValues(getEle.suits, getEle.names) + '<p>').addClass('player');
    } else {
      this.whoPlays[this.hand].push(getEle);
      $(player).append('<p>' + getValues(getEle.suits, getEle.names) + '<p>').addClass('dealer');
    }

    // console.log(this.whoPlays);
    this.count++;
};

Game.prototype.addScore = function() {

  var darray = [];
  var parray = [];

  for (i=0; i<this.whoPlays.player.length; i++) {
    var pScores = this.whoPlays.player[i].names;
    if (pScores === "ace") {
      pScores = 11;
    } else if (pScores === "king" || pScores === "queen" || pScores === "jack") {
      pScores = 10;
    }
    parray.push(pScores);
  }
  for (j=0; j<this.whoPlays.dealer.length; j++) {
    var dScores = this.whoPlays.dealer[j].names;
    if (dScores === "ace") {
      dScores = 11;
    } else if (dScores === "king" || dScores === "queen" || dScores === "jack") {
      dScores = 10;
    }
    darray.push(dScores);

  }

  var ptotal = parray.reduce(function (a, b) {
    return a + b;
  });

  var dtotal = darray.reduce(function (a, b) {
    return a + b;
  });

  this.scores.player = ptotal;
  this.scores.dealer = dtotal;

  console.log("Dealer Scores:" + this.scores.dealer);
  console.log("Player Scores:" + this.scores.player);
};


Game.prototype.shuffle = function() {
  var i = this.deck.length, j, temp; // This are the variables to get the array and do the random number and do some swapping

  while(i-- > 0) { //i-- will decrease the length of the array as long as it is not 0 .
    j = Math.floor(Math.random() * (i + 1)); // This will generate a random number. From 0 to i.

    temp = this.deck[j];
    this.deck[j] = this.deck[i];
    this.deck[i] = temp; // These 3 lines does the swapping of the random index position and the current index position.

  }

};


// The player will have the first turn, the player can choose to hit or stand. If stand then the dealer will show hole card. If hit than the player gets another card.

Game.prototype.hit = function() {

  if (this.count === 4) {
    this.Deal('#pcard3');
    this.addScore();
    this.win();
    this.dealer();
  } else if (this.count === 6) {
    this.Deal('#pcard4');
    this.addScore();
    this.win();
    this.dealer();
  } else if (this.count === 8) {
    this.Deal('#pcard5');
    this.addScore();
    this.win();
    this.dealer();

  }

};
Game.prototype.dealer = function() {

  if (this.scores.dealer === 21 || this.scores.dealer === 20 || this.scores.dealer === 19 || this.scores.dealer > 21 || this.scores.dealer === 18) {
    return;
  } else {
    if (this.count === 5) {
      this.Deal('#dcard3');
      this.addScore();
    } else if (this.count === 7) {
      this.Deal('#dcard4');
      this.addScore();
    } else if (this.count === 9) {
      this.Deal('#dcard5');
      this.addScore();
    }
  }

};
Game.prototype.win = function() {

  var playS = this.scores.player;
  var dealS = this.scores.dealer;

  if (dealS < 21 && playS < 21) {
    return;
  } else if (playS === 21 || dealS > 21 && playS > dealS && playS <= 21) {
    alert('You WIN!!!!!!');
    $('#dcard1 p').show();
  } else if (dealS === 21 || playS > 21 && dealS > playS && dealS <= 21) {
    alert('You Lose....');
    $('#dcard1 p').show();
  } else if (dealS === playS && playS === 21 || dealS === playS && playS === 20 || dealS === playS && playS === 19) {
    alert('Its a tie......');
    $('#dcard1 p').show();
  }

};

// The dealer will then hit if it has less than 20. If the dealer has 20 or 21 it will stand.

// If the player has the highest hand without going over 21 that player wins. If the player gets a blackjack on the first the player wins. If any player goes over 21 its a bust.
