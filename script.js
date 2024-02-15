let tangleColour = "white"
let tangleWidth = 36;
let tangleHeight = 14;

let marginY = 10;
let marginX = 5;

let amountX;
let amountY;

let rotationSpeed = 2;
let delayMultiplier = 2;

let rectAxis = [];
let currentOrigin;

class spinRectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rotation = 0;
    this.delay = 0;
    this.rotationDone = false;
  }
  drawTurnRect(turnSpeed, curCoords){
    push();

    this.changeSizeFromRotation();

    translate(this.x, this.y);
    rotate(this.rotation);
    rect(0, 0, this.width, this.height);

    if(this.delay <= 0 && this.rotationDone === false){
      this.rotation += turnSpeed;
    }else{
      this.delay -= 1;
    }
    
    if(this.rotation === 180 || this.rotation > 180){
      this.rotation = 0;
      this.rotationDone = true;
    }

    pop();
  }
  changeSizeFromRotation(){
    // horizontal is full with, full height
    // vertical is half width, 2 height
    // when angle = 0 horizontal
    // when angle = 90 vertical

    this.width = tangleWidth - ((tangleWidth/2) * sin(this.rotation));
    this.height = tangleHeight - ((tangleHeight - 2) * sin(this.rotation));
  }
}

function calcFits() {
  amountX = Math.floor(windowWidth / (tangleWidth + (marginX)));
  amountY = Math.floor(windowHeight / (tangleHeight + (marginY)));
}

function getMouseCoordsRelative(){
  
}

function createDelays(axis) { //origin is [0, 0] format
    
  // let delayMatrix = [];

  for (let i = 0; i < axis.length; i++) {

    // delayRow = [];

    for(let c = 0; c < axis[i].length; c++){

      let curRect = rectAxis[i][c];

      let coords = [c, i];
      
      let adjustedCoords = [Math.abs(coords[0] - currentOrigin[0]), Math.abs(coords[1] - currentOrigin[1])];
      let distance = Math.max(...adjustedCoords);

      let delay = distance * delayMultiplier

      curRect.delay = delay;
      
      // delayRow.push(delay);
      
    }
    // delayMatrix.push(delayRow);
  }
  // console.log(delayMatrix)
}

function chooseOrigin(){

  function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); 
    // maximum is exclusive and the minimum is inclusive
  }

  const origin = [getRandomInt(0, amountX), getRandomInt(0, amountY)];
  currentOrigin = origin;

  return origin
}

function checkIfRotsDone(axis){

  let allRotationsDone = true;

  for (let i = 0; i < axis.length; i++) {

    for(let c = 0; c < axis[i].length; c++){

      let curRect = axis[i][c];
      if(curRect.rotationDone === false){
        allRotationsDone = false;
      }
    }
  }

  if(allRotationsDone){
    for (let i = 0; i < axis.length; i++) {

      for(let c = 0; c < axis[i].length; c++){

        let curRect = axis[i][c];
        curRect.rotationDone = false;
      }
    }
  }

  return allRotationsDone
}

function setup() {

  createCanvas(windowWidth, windowHeight);
  calcFits();
  rectMode(CENTER);
  angleMode(DEGREES);
  background(0);

  y = marginY + (tangleHeight / 2)

  for (let yIndex = 0; yIndex < amountY; yIndex++) {

    rectsRow = []

    x = marginX + (tangleWidth / 2)

    for (let xIndex = 0; xIndex < amountX; xIndex++) {

      newRect = new spinRectangle(x, y, tangleWidth, tangleHeight);

      rectsRow.push(newRect);

      x += tangleWidth + marginX;
    }

    rectAxis.push(rectsRow);

    y += tangleHeight + marginY;
  }

  console.log(rectAxis);

  currentOrigin = chooseOrigin();
  createDelays(rectAxis);
}

function draw() {
  background(0);
  noStroke();
  fill("#9e9e9e");

  if(checkIfRotsDone(rectAxis)){
    currentOrigin = chooseOrigin();
    createDelays(rectAxis);
  }

  for (let i = 0; i < rectAxis.length; i++) {

    for(let c = 0; c < rectAxis[i].length; c++){

      let curRect = rectAxis[i][c];
      curRect.drawTurnRect(rotationSpeed, [c,i])
    }
  }
}