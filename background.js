/** Copyright (c) 2012 Ryan Rickard */

/** 
This script causes balls to bounces around the screen and collide into eachother
*/

/*Script for project.html*/

/*Global variables*/
var canvas;
var balls = [75];
var number = 0;
var color = "white";
var massMax = 25;
var massMin = 10; //mass is also radius

/*initialize ball objects and get canvas size*/
function start(){
  for (i = 0; i <= 75; i++){
    balls[i] = new ball;    
  }
  canvas = document.getElementById("bgcanvas");
  //set canvas size to the whole window 
  canvas.width=document.body.scrollWidth;
  canvas.height=document.body.scrollHeight;
  canvas.addEventListener("mousedown", mouseDown, false);
  context = canvas.getContext("2d");
  setInterval(animate, 25);
}

/*When the window is resized canvas size changes,
  new ball position based on percent*/
window.onresize = function(){
  oldWidth = canvas.width;
  oldHeight = canvas.height;
  canvas.width= 1;
  canvas.height = 1;
  canvas.width=document.body.scrollWidth;
  canvas.height=document.body.scrollHeight;
  percentX = canvas.width/oldWidth;
  percentY = canvas.height/oldHeight;
  /*Get new ball position after resize*/
  for (i = 0; i < 75; i++){
    balls[i].x *= percentX;
    balls[i].y *= percentY;
  }  
}

/*Add a ball where mouse pointer is on click*/
function mouseDown(e){
  x = e.pageX;
  y = e.pageY;
  add(x, y);
}

/*A ball object constructor*/
function ball(){
  this.started = false;
  this.x = 0;
  this.y = 0;
  this.hor = 0;
  this.vert = 0;
  this.mass = massMax;
  this.collision = -1;
}

/*Adds a ball based on mouseDown*/
function add(x, y){
  /*Check to make sure the ball is not placed on top of another*/
  for (i = 0; i < 75; i++){
    if (balls[i].started){
      dist_x = Math.abs(balls[i].x - x);
      dist_y = Math.abs(balls[i].y - y);
      distance = Math.sqrt(Math.pow(dist_x,2)+Math.pow(dist_y,2));
      if(distance <= balls[i].mass + massMax){
        return;
      }
    }
  }
  balls[number].started = true;
  balls[number].x = x;
  balls[number].y = y;
  /*get random mass/radius*/
  balls[number].mass = Math.floor((Math.random()*massMax)+massMin);
  
  /*Get random horizontal speed*/
  while(balls[number].hor <= 1 && balls[number].hor >= -1){ 
    balls[number].hor = Math.floor((Math.random()*10)-5)
  }
  
  /*Get random vertical speed*/
  while(balls[number].vert <= 1 && balls[number].vert >= -1){
    balls[number].vert = Math.floor((Math.random()*10)-5)
  }
  
  /*Only 75 balls on screen*/
  if(number<75){
    number++;
  }
  else{
    number = 0;
  }
}

/*Draw the balls*/
function animate(){
  getNewPositions();
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (i = 0; i < 75; i++){
    if (balls[i].started){
      context.beginPath();
      context.arc(balls[i].x, balls[i].y, balls[i].mass, 0, Math.PI * 2);
      context.fillStyle = color;
      context.closePath();
      context.fill();  
    }
    else{
      return;
    }
  }
}

/*Find the new position for ball*/
function getNewPositions(){
  for (i = 0; i < 75; i++){
    if (balls[i].started){
      wallCollision(i);
      /*Loop to check if ball is colliding with another*/
      for (j = i+1; j < 75; j++){ 
        if (!balls[j].started){
          break;
        }
        else{
          x = Math.abs(balls[i].x - balls[j].x);
          y = Math.abs(balls[i].y - balls[j].y);
          distance = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
          if (distance <= (balls[i].mass+balls[j].mass) && (balls[i].collision != j || balls[j].collision != i)){
            collision(i, j);
            balls[i].collision = j;
            balls[j].collision = i;
            balls[i].x += balls[i].hor;
            balls[i].y += balls[i].vert;
            balls[j].x += balls[j].hor;
            balls[j].y += balls[j].vert;
          }
        }
      }
    }
    else{
      return;
    }
  }
}

/*calculates the velocity of the colliding balls
  by turning 2d collision into a 1d collision and calculates magnitude*/
function collision(one, two) {
	dx = balls[one].x-balls[two].x;
	dy = balls[one].y-balls[two].y;
	collisionAngle = Math.atan2(dy, dx);
	magnitudeOne = Math.sqrt(Math.pow(balls[one].hor, 2) + Math.pow(balls[one].vert, 2));
	magnitudeTwo = Math.sqrt(Math.pow(balls[two].hor, 2) + Math.pow(balls[two].vert, 2));
	directionOne = Math.atan2(balls[one].vert, balls[one].hor);
	directionTwo = Math.atan2(balls[two].vert, balls[two].hor);
	newHorOne = magnitudeOne*Math.cos(directionOne-collisionAngle);
	finalVertOne = magnitudeOne*Math.sin(directionOne-collisionAngle);
	newHorTwo = magnitudeTwo*Math.cos(directionTwo-collisionAngle);
	finalVertTwo = magnitudeTwo*Math.sin(directionTwo-collisionAngle);
	finalHorOne = ((balls[one].mass-balls[two].mass)*newHorOne+2*(balls[two].mass)*newHorTwo)/(balls[one].mass+balls[two].mass);
	finalHorTwo = ((balls[two].mass-balls[one].mass)*newHorTwo+2*(balls[one].mass)*newHorOne)/(balls[one].mass+balls[two].mass);
	balls[one].hor = Math.cos(collisionAngle)*finalHorOne+Math.cos(collisionAngle+Math.PI/2)*finalVertOne;
	balls[one].vert = Math.sin(collisionAngle)*finalHorOne+Math.sin(collisionAngle+Math.PI/2)*finalVertOne;
	balls[two].hor = Math.cos(collisionAngle)*finalHorTwo+Math.cos(collisionAngle+Math.PI/2)*finalVertTwo;
	balls[two].vert = Math.sin(collisionAngle)*finalHorTwo+Math.sin(collisionAngle+Math.PI/2)*finalVertTwo;
}

/*checks if ball collides with a wall and calculates new velocity if it does*/
function wallCollision(i){
  if(balls[i].x + balls[i].hor >= (0 + balls[i].mass) && balls[i].x + balls[i].hor <= (canvas.width - balls[i].mass)){
    balls[i].x += balls[i].hor;
  }
  
  else{
    balls[i].hor = -balls[i].hor;
    balls[i].x += balls[i].hor;
    balls[i].collision = -1;
    if (balls[i].x < 0+balls[i].mass || balls[i].x > canvas.width - balls[i].mass){
      balls[i].x += balls[i].hor/2;
    }
    
  }
  if(balls[i].y + balls[i].vert >= (0+balls[i].mass) && balls[i].y + balls[i].vert <= (canvas.height-balls[i].mass)){
    balls[i].y += balls[i].vert;
  }
  
  else{
    balls[i].vert = -balls[i].vert;
    balls[i].y += balls[i].vert;
    balls[i].collision = -1;
    if (balls[i].y < 0+balls[i].mass || balls[i].y > canvas.width - balls[i].mass){
      balls[i].y += balls[i].vert/2;
    }
  }
}

window.addEventListener("load", start, false);
