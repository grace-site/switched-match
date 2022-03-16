var num = 16;
var player = 1;

var onePl = document.querySelector("#onePl");
var twoPl = document.querySelector("#twoPl");
var easy = document.querySelector("#easy");
var medium = document.querySelector("#medium");
var hard = document.querySelector("#hard");
var board = document.querySelector("#board");
var menu = document.querySelector("#menu");
var bar = document.querySelector("#bar");
var moves = document.querySelector("#moves");
var options = document.querySelector("#options");
var complete = document.querySelector("#complete");
var matchOne = document.querySelector("#matchOne");
var matchTwo = document.querySelector("#matchTwo");
var names = document.querySelector("#names");
var winner = document.querySelector("#winner");

//menu buttons
onePl.onclick = function() {
  player = 1;
  this.classList.add("clicked");
  twoPl.classList.remove("clicked");
}
twoPl.onclick = function() {
  player = 2;
  this.classList.add("clicked");
  onePl.classList.remove("clicked");
}
easy.onclick = function() {
  num = 16;
  this.classList.add("clicked");
  hard.classList.remove("clicked");
  medium.classList.remove("clicked");
}
medium.onclick = function() {
  num = 24;
  this.classList.add("clicked");
  hard.classList.remove("clicked");
  easy.classList.remove("clicked");
}
hard.onclick = function() {
  num = 32;
  this.classList.add("clicked");
  easy.classList.remove("clicked");
  medium.classList.remove("clicked");
}
document.querySelector("#play").onclick = function() {
  menu.style.zIndex = -1;
  if (player == 1) {
    bar.style.visibility = "visible";
    newBoard();
  } else {
    names.style.zIndex = 1;
  }
}
//names start button for two players
var nameOneValue;
var nameTwoValue;
var turnOne;
var matchOneNum;
var matchTwoNum;
document.querySelector("#start").onclick = function() {
  nameOneValue = document.querySelector("#nameOne").value;
  nameTwoValue = document.querySelector("#nameTwo").value;
  matchOne.innerHTML = nameOneValue + ": 0";
  matchTwo.innerHTML = nameTwoValue + ": 0";
  barTwo.style.visibility = "visible";
  names.style.zIndex = -1;
  newBoard();
  turnOne = true;
  matchOneNum = 0;
  matchTwoNum = 0;
}
//icon button
var pause = document.querySelectorAll(".pause");
for (var i = 0; i < pause.length; i++) {
  pause[i].onclick = function() {
    run = 0;
    paused = true;
    options.style.zIndex = 1;
  }
}
//options buttons
document.querySelector("#resume").onclick = function() {
  run = 1;
  runTime();
  paused = false;
  options.style.zIndex = -1;
}
var restart = document.querySelectorAll(".restart");
for (var i = 0; i < restart.length; i++) {
  restart[i].onclick = function() {
    options.style.zIndex = -1;
    complete.style.zIndex = -1;
    completeTwo.style.zIndex = -1;
    bar.style.visibility = "hidden";
    barTwo.style.visibility = "hidden";
    menu.style.zIndex = 1;
    reset();
  }
}



var memArray = [];
var memTile = [];
var memSrc = [];
var memIds = [];
var memBack = [];
var flipped = 0;
var movesNum = 0;
var run = 0;
var sec = 0;
var paused = false;

Array.prototype.shuffle = function() {
  var i = this.length,
    temp, j;
  while (i > 0) {
    j = Math.floor(Math.random() * (i));
    i--;
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
}

function reset() {
  memArray = [];
  memTile = [];
  memSrc = [];
  memIds = [];
  memBack = [];
  flipped = 0;
  movesNum = 0;
  run = 0;
  sec = 0;
  paused = false;
  board.innerHTML = "";
  moves.innerHTML = "Moves: 0";
}

function newBoard() {
  //set board size
  for (i = 0; i < num / 2; i++) {
    memArray[i * 2] = i + 1 + ".png";
    memArray[i * 2 + 1] = i + 1 + ".png";
  }
  if (num == 16) {
    board.style.width = "530px";
  }
  if (num == 24) {
    board.style.width = "790px";
  } else if (num == 32) {
    board.style.width = "1050px";
  }
  //add board content
  memArray.shuffle();
  for (var i = 0; i < memArray.length; i++) {
    var divOutput = "<div class='tile' id='tile_" + i + "' onclick='flip(this, \"" + memArray[i] + "\", \"#img_" + i + "\", \"#back_" + i + "\")'></div>";
    board.innerHTML += divOutput;

    var imgOutput = "<img id='img_" + i + "' class='front' src='../image/" + memArray[i] + "'>"
    imgOutput += "<div id='back_" + i + "' class='back'></div>"
    document.querySelector("#tile_" + i).innerHTML += imgOutput;
  }
  run = 1;
  runTime();

    if (localStorage.getItem("matchHighscore") !== null){
      document.querySelector("#highscore").innerHTML = "Highscore: " + localStorage.getItem("matchHighscore");
    }

}




function flip(tile, imgSrc, imgId, backId) {
  if (!paused && !document.querySelector(imgId).classList.contains("flip") && memSrc.length < 2) {
    document.querySelector(imgId).classList.add("flip");
    document.querySelector(backId).classList.add("flip");
    document.querySelector(imgId).style.cursor = "default";
    memTile.push(tile);
    memSrc.push(imgSrc);
    memIds.push(imgId);
    memBack.push(backId);
    if (memSrc.length == 2) {
      movesNum++;
      moves.innerHTML = "Moves: " + movesNum;
      if (memSrc[0] == memSrc[1]) {
        flipped += 2;
        memTile = [];
        memSrc = [];
        memIds = [];
        memBack = [];
        if (player == 2) {
          if (turnOne) {
            matchOneNum++;
            matchOne.innerHTML = nameOneValue + ": " + matchOneNum;
          } else {
            matchTwoNum++;
            matchTwo.innerHTML = nameTwoValue + ": " + matchTwoNum;
          }
        }
        if (flipped == memArray.length) {
          run = 0;
          setTimeout(function() {
            var score = 10;
            if (player == 1) {
              if (num == 16){
                score = (200-(movesNum*2 + sec))*20;
              } else if (num == 24){
                score = (300-(movesNum*2 + sec))*16;
              } else {
                score = (450-(movesNum*2 + sec))*14;
              }
              if (score < 10){
                score = 10;
              }
              score = Math.round((score/10))*10;
              document.querySelector("#score").innerHTML = "Score: " + score;
              complete.style.zIndex = 1;
              storeScore(score);
            } else {
              var winNum;
              if (matchOneNum > matchTwoNum){
                winner.innerHTML = "Congrats! " + nameOneValue + " wins!";
                winNum = matchOneNum;
              } else if (matchTwoNum > matchOneNum){
                winner.innerHTML = "Congrats! " + nameTwoValue + " wins!";
                winNum = matchTwoNum;
              } else {
                winner.innerHTML = "Looks like a tie!"
                winNum = matchOneNum;
              }
              if (num == 16){
                score = winNum*420;
              } else if (num == 24){
                score = winNum*300;
              } else {
                score = winNum*240;
              }
              if (score < 10){
                score = 10;
              }
              score = Math.round((score/10))*10;
              document.querySelector("#scoreTwo").innerHTML = "Score: " + score;
              completeTwo.style.zIndex = 1;
              storeScore(score);
            }
          }, 1000);
        }
      } else {
        setTimeout(swap, 1000, memTile[0], memTile[1], memIds[0], memIds[1]);
        setTimeout(flipBack, 2000);

      }
    }
  }
}

function storeScore(sc){
  if (localStorage.getItem("matchHighscore") == null){
    localStorage.setItem("matchHighscore", sc);
  }
  if (sc > localStorage.getItem("matchHighscore")){
    localStorage.setItem("matchHighscore", sc);
  }
  document.querySelector("#highscore").innerHTML = "Highscore: " + localStorage.getItem("matchHighscore");
}

function swap(a, b, aa, bb) {
  document.querySelector(aa).classList.add("shrink");
  document.querySelector(bb).classList.add("shrink");

  setTimeout(function() {
    var temp = document.createElement("div");
    board.insertBefore(temp, a);
    board.insertBefore(a, b);
    board.insertBefore(b, temp);
    board.removeChild(temp);
  }, 80);

  setTimeout(function() {
    document.querySelector(aa).classList.remove("shrink");
    document.querySelector(bb).classList.remove("shrink");
  }, 100);

}

function flipBack() {
  if (player == 2) {
    turnOne = !turnOne;
    if (turnOne) {
      matchOne.classList.add("turn");
      matchTwo.classList.remove("turn");
    } else {
      matchTwo.classList.add("turn");
      matchOne.classList.remove("turn");

    }
  }
  document.querySelector(memIds[0]).classList.remove("flip");
  document.querySelector(memBack[0]).classList.remove("flip");
  document.querySelector(memIds[1]).classList.remove("flip");
  document.querySelector(memBack[1]).classList.remove("flip");
  memTile = [];
  memSrc = [];
  memIds = [];
  memBack = [];
}

function runTime() {
  if (run == 1) {
    setTimeout(
      function() {
        sec++;
        var min = Math.floor(sec / 60);
        var s = sec % 60

        if (min < 10) {
          min = "0" + min;
        }
        if (s < 10) {
          s = "0" + s;
        }
        document.querySelector("#time").innerHTML = "Time: " + min + ":" + s;
        runTime();
      }, 1000
    )
  }
}
