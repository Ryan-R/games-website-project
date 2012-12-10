/*Copyright (c) 2012 Ryan Rickard
script for reversi.html,  This script allows you to play reversi in a canvas
*/

/*Global Variables used throughout*/
var blackScore;
var whiteScore;
var EMPTY = 0;
var BLACK = 1;
var WHITE = 2;
var player2 = WHITE; //If !PVP plyer2 is computer
var player1 = BLACK; //Always a player
var playerTurn;
var canvas = [65];
var countFunction = true;
var PVP = false;
/*Load canvas on start*/
function start(){
  document.getElementById("reset").addEventListener("click", start, false);
  document.getElementById("switchColorBlack").addEventListener("click", switchColorBlack, false);
  document.getElementById("switchColorWhite").addEventListener("click", switchColorWhite, false);
  document.getElementById("switchCountFunction").addEventListener("click", switchCountFunction, false);
  document.getElementById("switchPVP").addEventListener("click", switchPVP, false);
  playerTurn = BLACK;

  /*initialize each play square*/  
  for(var i = 1; i <= 64; i++){
    canvas[i] = document.getElementById(i);
    canvas[i].locationValue = 0;
    canvas[i].fill = EMPTY;
    canvas[i].addEventListener("mouseover", mouseOver, false);
    canvas[i].addEventListener("mouseout", mouseOut, false);
    canvas[i].addEventListener("mousedown", mouseDown, false);
    context = canvas[i].getContext("2d");
    context.fillStyle = "blue";
    context.fillRect(0,0,46,46);
    if (i == 28 || i == 37){
      context.fillStyle = "white";
      context.beginPath();
      context.arc(23, 23, 18, 0, Math.PI * 2);
      context.fill();
      canvas[i].fill = WHITE;
    }
    if (i == 29 || i == 36){
      context.fillStyle = "black";
      context.beginPath();
      context.arc(23, 23, 18, 0, Math.PI * 2);
      context.fill();
      canvas[i].fill = BLACK;
    }
  }
  updateScore();
  checkValidMoves();
  if (player2 == BLACK && !PVP){  
    window.setTimeout(computerTurn, 500);
  }
}

/*Switches player1 to white*/
function switchColorWhite(){
  if (player2 == WHITE){
    player2 = BLACK;
    player1 = WHITE;
    start();
  }
}

/*Switches player1 to black*/
function switchColorBlack (){
  if (player2 == BLACK){
    player2 = WHITE;
    player1 = BLACK;
    start();
  }
}

/*Switches the game to play person against person*/
function switchPVP(){
  PVP = !PVP;
  start();
}

/*switches flip counts on or off*/
function switchCountFunction(){
  countFunction = !countFunction;
  checkValidMoves();
} 

/*When over a space that can be played on the correct color piece is displayed*/
function mouseOver(e){
  if (playerTurn != player2 || PVP){
    var i = parseInt(e.target.getAttribute("id"), 10);
    if (e.target.fill == 0 && isMoveValid(i)){
      context = e.target.getContext("2d");
      if (playerTurn == BLACK){
        context.fillStyle = "black";
      }
      else if(playerTurn == WHITE){
        context.fillStyle = "white";
      }
      context.beginPath();
      context.arc(23, 23, 18, 0, Math.PI * 2);
      context.fill();
    }
  }
}

/*When leaving a space that can be played on the piece disappears*/
function mouseOut(e){
  if (e.target.fill == 0){
    context = e.target.getContext("2d");
    context.fillStyle = "blue";
    context.fillRect(0,0,46,46);
    checkValidMoves();
  }
}

/*Making a move*/
function mouseDown(e){
  var i = parseInt(e.target.getAttribute("id"), 10);
  if (e.target.fill == 0 && isMoveValid(i)){
    context = canvas[i].getContext("2d");
    (playerTurn == BLACK)? context.fillStyle = "black" : context.fillStyle = "white";
    context.beginPath();
    context.arc(23, 23, 18, 0, Math.PI * 2);
    context.fill();
    canvas[i].fill = playerTurn;
    flipPieces(i);
    updateScore();
    switchPlayerTurn()
    if(!checkValidMoves() && blackScore + whiteScore != 64){
      switchPlayerTurn()
      if(!checkValidMoves()){
        winner();
        return;
      }
      if (!PVP){
        alert("Computer has no moves, Player's turn");
      }
      else if(playerTurn == BLACK){
        alert("White player has no moves, Black Player's turn");
      }
      else{
        alert("Black player has no moves, White Player's turn");
      }
      return;
    }
    
    if (blackScore + whiteScore == 64){
      winner();
    }
    if (!PVP){
      window.setTimeout(computerTurn, 500);
    }
  }
}

/*Updates the score*/
function updateScore(){
  blackScore = 0;
  whiteScore = 0;
  for(var i = 1; i < 65; i++){
    if (canvas[i].fill == BLACK) blackScore++;
    if (canvas[i].fill == WHITE) whiteScore++;
  }
  
  score = document.getElementById("score");
  score.innerHTML = "<p>Black's Score = " + blackScore + " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;White's Score = " + whiteScore + "</p>"; 
}
    
/*Goes through all of the pieces to be flipped starting at the played area*/
function flipPieces(i){
  if(playerTurn == BLACK){
    if (left(i) > 0){
      var j = i;
      while(canvas[--j].fill == WHITE){
        flip(j);
      }
    }
    if (right(i) > 0){
      var j = i;
      while(canvas[++j].fill == WHITE){
        flip(j);
      }
    }
    if (up(i) > 0){
      var j = i;
      j -= 8;
      while(canvas[j].fill == WHITE){
        flip(j);
        j -= 8;
      }
    }
    if (down(i) > 0){
      var j = i;
      j += 8;
      while(canvas[j].fill == WHITE){
        flip(j);
        j += 8;
      }
    }
    if(nwDiag(i) > 0){
      var j = i;
      j-=9;
      while(canvas[j].fill == WHITE){
        flip(j);
        j-=9;
      }
    }
    if(seDiag(i) > 0){
      var j = i;
      j+=9;
      while(canvas[j].fill == WHITE){
        flip(j);
        j+=9;
      }
    }
    if(neDiag(i) > 0){
      var j = i;
      j-=7;
      while(canvas[j].fill == WHITE){
        flip(j);
        j-=7;
      }
    }
    if(swDiag(i) > 0){
      var j = i;
      j+=7;
      while(canvas[j].fill == WHITE){
        flip(j);
        j+=7;
      }
    }
  }
  
  else{
    if (left(i) > 0){
      var j = i;
      while(canvas[--j].fill == BLACK){
        flip(j);
      }
    }
    if (right(i) > 0){
      var j = i;
      while(canvas[++j].fill == BLACK){
        flip(j);
      }
    }
    if (up(i) > 0){
      var j = i;
      j -= 8;
      while(canvas[j].fill == BLACK){
        flip(j);
        j -= 8;
      }
    }
    if (down(i) > 0){
      var j = i;
      j += 8;
      while(canvas[j].fill == BLACK){
        flip(j);
        j += 8;
      }
    }
    if(nwDiag(i) > 0){
      var j = i;
      j-=9;
      while(canvas[j].fill == BLACK){
        flip(j);
        j-=9;
      }
    }
    if(seDiag(i) > 0){
      var j = i;
      j+=9;
      while(canvas[j].fill == BLACK){
        flip(j);
        j+=9;
      }
    }
    if(neDiag(i) > 0){
      var j = i;
      j-=7;
      while(canvas[j].fill == BLACK){
        flip(j);
        j-=7;
      }
    }
    if(swDiag(i) > 0){
      var j = i;
      j+=7;
      while(canvas[j].fill == BLACK){
        flip(j);
        j+=7;
      }
    }
  }
}

/*Checks for valid moves and if flipCount is true displays flip counts on playable area for player turn*/
function checkValidMoves(){
  var check = false;
  for(var i = 1; i < 65; i++){
    if ((countFunction == false || (playerTurn == player2 && !PVP)) && flipCount(i) > 0  && canvas[i].fill == EMPTY){
      context = canvas[i].getContext("2d");
      context.fillStyle = "blue";
      context.fillRect(0,0,46,46);
      check = true;
    }
    else if (countFunction == true && flipCount(i) > 0 && canvas[i].fill == EMPTY){
      context = canvas[i].getContext("2d");
      context.fillStyle = "blue";
      context.fillRect(0,0,46,46);
      context.fillStyle = "white";
      context.font = "20px arial";
      context.textBaseline = "middle";
      context.textAlign = "center";
      context.fillText(flipCount(i), 23, 23);
      check = true;
    }
    else if(countFunction == true && flipCount(i) == 0  && canvas[i].fill == EMPTY){
      context = canvas[i].getContext("2d");
      context.fillStyle = "blue";
      context.fillRect(0,0,46,46);
    }
  }
  return check;
}

/*Recursively animates a flipping of a piece*/
function firstAnimateFlip(i, scale, piece){
  scale -= 0.05;
  context = canvas[i].getContext("2d");
  context.fillStyle = "blue";
  context.fillRect(0,0,46,46);
  context.save();
  context.translate(23, 23);
  context.scale(scale, 1);
  context.beginPath();
  context.arc(0, 0, 18, 0, Math.PI*2);
  (piece == BLACK)? context.fillStyle = "white" : context.fillStyle = "black";
  context.closePath();
  context.fill();
  context.restore();
  if(scale >= 0){
    setTimeout(function(){firstAnimateFlip(i,scale, piece);}, 7);
    return;
  }
  setTimeout(function(){secondAnimateFlip(i,scale, piece);}, 7);
  return;
}

/*Recursively finishes the animation of flipping a piece*/
function secondAnimateFlip(i, scale, piece){
  scale += 0.05;
  context = canvas[i].getContext("2d");
  context.fillStyle = "blue";
  context.fillRect(0,0,46,46);
  context.save();
  context.translate(23, 23);
  context.scale(scale, 1);
  context.beginPath();
  context.arc(0, 0, 18, 0, Math.PI*2);
  (piece == BLACK)? context.fillStyle = "black" : context.fillStyle = "white";
  context.closePath();
  context.fill();
  context.restore();
  if(scale <= 1.00){
    setTimeout(function(){secondAnimateFlip(i,scale, piece);}, 7);
    return;
  }
  return;
}

/*Flips the pieces*/
function flip(i){
  context = canvas[i].getContext("2d");
  context.fillStyle = "blue";
  context.fillRect(0,0,46,46);
    
  if (playerTurn == BLACK){
    firstAnimateFlip(i, 1.00, BLACK);  
    context.fillStyle = "blue";
    context.fillRect(0,0,46,46);
    context.beginPath();
    context.arc(23, 23, 18, 0, Math.PI*2);
    context.fillStyle = "black";
    context.closePath();
    context.fill();
    canvas[i].fill = BLACK;
  }

  else{
    firstAnimateFlip(i, 1.00, WHITE);  
    context.fillStyle = "blue";
    context.fillRect(0,0,46,46);
    context.beginPath();
    context.arc(23, 23, 18, 0, Math.PI*2);
    context.fillStyle = "white";
    context.closePath();
    context.fill();
    canvas[i].fill = WHITE;
  }
}

/*Checks if a move is valid*/
function isMoveValid(i){
  if(flipCount(i) > 0){
    return true;
  }
  return false;
}

/*Counts how many pieces are flipped for a move*/
function flipCount(i){  
  var count = 0;
  count += left(i);
  count += right(i);
  count += up(i);
  count += down(i);
  count += nwDiag(i);
  count += seDiag(i);
  count += neDiag(i);
  count += swDiag(i);
  return count;
}

/*Checks pieces flipped to the left*/
function left(i){
  var count = 0;
  if (playerTurn == BLACK){
    while(i%8 != 1){
      if (canvas[i-1].fill == WHITE){
        count++;
      }
      else if (canvas[i-1].fill == BLACK){
        return count;
      }
      else if (canvas[i-1].fill == EMPTY){
        return 0;
      }
      i--;
    }
    return 0;
  }    
  else{
   while(i%8 != 1){
      if (canvas[i-1].fill == BLACK){
        count++;
      }
      else if (canvas[i-1].fill == WHITE){
        return count;
      }
      else if (canvas[i-1].fill == EMPTY){
        return 0;
      }
      i--;
    }
    return 0;
  }
} 

/*Checks pieces flipped to the right*/
function right(i){
  var count = 0;
  if (playerTurn == BLACK){
    while(i%8 != 0){
      if (canvas[i+1].fill == WHITE){
        count++;
      }
      else if (canvas[i+1].fill == BLACK){
        return count;
      }
      else if (canvas[i+1].fill == EMPTY){
        return 0;
      }
      i++;
    }
    return 0;
  }    
  else{
   while(i%8 != 0){
      if (canvas[i+1].fill == BLACK){
        count++;
      }
      else if (canvas[i+1].fill == WHITE){
        return count;
      }
      else if (canvas[i+1].fill == EMPTY){
        return 0;
      }
      i++;
    }
    return 0;
  }
}

/*Checks pieces flipped to the top*/
function up(i){
  var count = 0;
  if (playerTurn == BLACK){
    while(i-8 > 0){
      if (canvas[i-8].fill == WHITE){
        count++;
      }
      else if (canvas[i-8].fill == BLACK){
        return count;
      }
      else if (canvas[i-8].fill == EMPTY){
        return 0;
      }
      i-=8;
    }
    return 0;
  }    
  else{
   while(i-8 > 0){
      if (canvas[i-8].fill == BLACK){
        count++;
      }
      else if (canvas[i-8].fill == WHITE){
        return count;
      }
      else if (canvas[i-8].fill == EMPTY){
        return 0;
      }
      i-=8;
    }
    return 0;
  }
}

/*Checks pieces flipped to the bottom*/
function down(i){
  var count = 0;
  if (playerTurn == BLACK){
    while(i+8 < 65){
      if (canvas[i+8].fill == WHITE){
        count++;
      }
      else if (canvas[i+8].fill == BLACK){
        return count;
      }
      else if (canvas[i+8].fill == EMPTY){
        return 0;
      }
      i+=8;
    }
    return 0;
  }    
  else{
   while(i+8 < 65){
      if (canvas[i+8].fill == BLACK){
        count++;
      }
      else if (canvas[i+8].fill == WHITE){
        return count;
      }
      else if (canvas[i+8].fill == EMPTY){
        return 0;
      }
      i+=8;
    }
    return 0;
  }
}

/*Checks pieces flipped to the nw corner*/
function nwDiag(i){
  var count = 0;
  if (playerTurn == BLACK){
    while(i-9 > 0 && i%8 != 1){
      if (canvas[i-9].fill == WHITE){
        count++;
      }
      else if (canvas[i-9].fill == BLACK){
        return count;
      }
      else if (canvas[i-9].fill == EMPTY){
        return 0;
      }
      i-=9;
    }
    return 0;
  }    
  else{
   while(i-9 > 0 && i%8 != 1){
      if (canvas[i-9].fill == BLACK){
        count++;
      }
      else if (canvas[i-9].fill == WHITE){
        return count;
      }
      else if (canvas[i-9].fill == EMPTY){
        return 0;
      }
      i-=9;
    }
    return 0;
  }
}

/*Checks pieces flipped to the se corner*/
function seDiag(i){
  var count = 0;
  if (playerTurn == BLACK){
    while(i+9 < 65 && i%8 != 0){
      if (canvas[i+9].fill == WHITE){
        count++;
      }
      else if (canvas[i+9].fill == BLACK){
        return count;
      }
      else if (canvas[i+9].fill == EMPTY){
        return 0;
      }
      i+=9;
    }
    return 0;
  }    
  else{
   while(i+9 < 65 && i%8 != 0){
      if (canvas[i+9].fill == BLACK){
        count++;
      }
      else if (canvas[i+9].fill == WHITE){
        return count;
      }
      else if (canvas[i+9].fill == EMPTY){
        return 0;
      }
      i+=9;
    }
    return 0;
  }
}

/*Checks pieces flipped to the ne corner*/
function neDiag(i){
  var count = 0;
  if (playerTurn == BLACK){
    while(i-7 > 0 && i%8 != 0){
      if (canvas[i-7].fill == WHITE){
        count++;
      }
      else if (canvas[i-7].fill == BLACK){
        return count;
      }
      else if (canvas[i-7].fill == EMPTY){
        return 0;
      }
      i-=7;
    }
    return 0;
  }    
  else{
   while(i-7 > 0 && i%8 != 0){
      if (canvas[i-7].fill == BLACK){
        count++;
      }
      else if (canvas[i-7].fill == WHITE){
        return count;
      }
      else if (canvas[i-7].fill == EMPTY){
        return 0;
      }
      i-=7;
    }
    return 0;
  }
}

/*Checks pieces flipped to the sw corner*/
function swDiag(i){
  var count = 0;
  if (playerTurn == BLACK){
    while(i+7 < 65 && i%8 != 1){
      if (canvas[i+7].fill == WHITE){
        count++;
      }
      else if (canvas[i+7].fill == BLACK){
        return count;
      }
      else if (canvas[i+7].fill == EMPTY){
        return 0;
      }
      i+=7;
    }
    return 0;
  }    
  else{
   while(i+7 < 65 && i%8 != 1){
      if (canvas[i+7].fill == BLACK){
        count++;
      }
      else if (canvas[i+7].fill == WHITE){
        return count;
      }
      else if (canvas[i+7].fill == EMPTY){
        return 0;
      }
      i+=7;
    }
    return 0;
  }
}

/*Plays the computer's turn*/
function computerTurn(){
  locationValue();
  i = compareLocationValues();
  context = canvas[i].getContext("2d");
  (player2 == BLACK)? context.fillStyle = "black" : context.fillStyle = "white";
  context.beginPath();
  context.arc(23, 23, 18, 0, Math.PI * 2);
  context.fill();
  canvas[i].fill = player2;
  flipPieces(i);
  updateScore();
  switchPlayerTurn()
  if(!checkValidMoves() && blackScore + whiteScore != 64){
    switchPlayerTurn()
    if(!checkValidMoves()){
      winner();
      return;
    }
    alert("Player has no moves, Computer's turn");
    setTimeout(computerTurn, 750);
  }
        
  if (blackScore + whiteScore == 64){
    winner();
  }
  checkValidMoves();
}

/*Finds the value of locations for the computer to play*/
function locationValue(){
  for(var i = 1; i < 65; i++){
    if (i == 1 || i == 8 || i == 57 || i == 64){
      canvas[i].locationValue = 100;
    }
    else if (i == 2 || i == 7 || i == 9 || i == 16 || i == 49 || i == 56 || i == 58 || i == 63){
      canvas[i].locationValue = -5 + flipCount(i);
    }
    else if (i == 10 || i == 15 || i == 50 || i == 55){
      canvas[i].locationValue = -10 + flipCount(i);
    }
    else if (i == 3 || i == 6 || i == 17 || i == 24 || i == 19 || i == 22 || i == 41 || i == 43 || i == 46 || i == 48 || i == 59 || i == 62){
      canvas[i].locationValue = 5 + flipCount(i);
    }
    else{
      canvas[i].locationValue = flipCount(i);
    }
  }
}

/*Finds the best location for the computer to play*/
function compareLocationValues(){
  var bestLocation = 0;
  bestLocationValue = -11;
  for(var i = 1; i < 65; i++){
    if(canvas[i].fill == EMPTY && isMoveValid(i)){
      if (bestLocationValue == canvas[i].locationValue){
        if (Math.random() <= 0.49){
          bestLocation = i;
          bestLocationValue = canvas[i].locationValue;
        }
      }
      else if (bestLocationValue < canvas[i].locationValue){
        bestLocation = i;
        bestLocationValue = canvas[i].locationValue;
      }
    }
  }
  return bestLocation;
}

/*Switches whos turn it is*/
function switchPlayerTurn(){
  (playerTurn == BLACK) ? playerTurn = WHITE : playerTurn = BLACK;
}

/*Declares a winner*/
function winner(){
  if (blackScore > whiteScore){
    alert("Black player wins!");
  }
  else if (blackScore < whiteScore){
    alert("White player wins!");
  }
  else if(blackScore == whiteScore){
    alert("Tie Game!");
  }
}    
window.addEventListener("load", start, false);

