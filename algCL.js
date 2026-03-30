
/*
Breakdown of idea:

simulate a ball colliding with walls and bouncing around
change colors every collision
uniform size ball (change size parameter potentially)
random location on grid for spawn
random direction
uniform velocity (provide range parameter potentially)

*/

class Ball {
    dx = 0;
    dy = 0;
    gradientColorOne = "";
    gradientColorTwo = "";
    peakortrough = true;
    circleColors = algCL.circleColors;

    colorstep = 0;

    constructor(x, y, radius, color, alpha, velocity, angle){
    this.x = x;
    this.y = y;
    this.circleRadius = radius;
    this.currentSingleColor = color;
    this.circleAlpha = alpha;
    this.velocity = velocity;
    this.angle = angle;

  }

}


var algCL = {};

algCL.drawCircle = function(x, y, radius, color, alpha) {
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);

  if (algCL.fillCircle){
    ctx.fillStyle = color;
    ctx.fill();
  }
  else{
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}
}

algCL.drawOneStep = function () {
  if(algCL.NumOfStepsDone >= algCL.maxNumOfSteps) {
    clearInterval(algCL.loop);
    return false;
  } else {

    if(algCL.noTrail){
      ctx.clearRect(0, 0, 600, 600);
      ctx.globalAlpha = 1;
      ctx.fillStyle = algCL.backgroundColor;
      ctx.fillRect(0, 0, 600, 600);
    }
    for (let i = 0; i<algCL.ballArray.length; i++){
      let ball = algCL.ballArray[i];
       //calculate new location based on velocity and angle.
      ball.dx = ball.velocity * Math.cos(ball.angle);
      ball.dy = ball.velocity  * Math.sin(ball.angle);


      if (algCL.sinusoidal && algCL.NumOfStepsDone % algCL.sinusoidalCycle == 0){
          if (ball.peakortrough){
            ball.angle += algCL.sinusoidalAngle;
          }
          else{
            ball.angle -= algCL.sinusoidalAngle;
          }
          ball.peakortrough = !ball.peakortrough;
      }


      if (algCL.wrapAroundWalls){
        if (ball.x + ball.dx >= 600 + ball.circleRadius || ball.x + ball.dx <= 0 - ball.circleRadius){
          if (algCL.wrapAroundStyle != "y"){
            algCL.wrapAround(ball, "x", ball.dx);
          }
        }
        else if (ball.y + ball.dy >= 600 + ball.circleRadius || ball.y + ball.dy <= 0 - ball.circleRadius) {
          // wrap around or correct position to be within bound
          if (algCL.wrapAroundStyle != "x"){
            algCL.wrapAround(ball, "y", ball.dy);
          }
        }
        else {
          if(algCL.ballsCollide){
            algCL.checkBallCollisions();
          }
          if (algCL.wrapAroundStyle != "x"){
            ball.y += ball.dy;
          }
          if (algCL.wrapAroundStyle != "y"){
            ball.x += ball.dx;
          }
        }
      }



      if (!algCL.wrapAroundWalls){
        //check for collision, see if edges of ball will hit the walls
        if (ball.x + ball.dx >= 600 - ball.circleRadius || ball.x + ball.dx <= ball.circleRadius) {
          algCL.rebound(ball, "x");
          // Correct position to be within bounds
          if (ball.x + ball.dx >= 600 - ball.circleRadius) {
            ball.x = 600 - ball.circleRadius;
          } else {
            ball.x = ball.circleRadius;
          }
          if(algCL.velocityChangesOnCollision){
            // console.log("changing velocity");
            if(algCL.speedUpOnCollision){
              ball.velocity+=algCL.velocityIncrement;
              // console.log("velocity increase");
            }
            else{
              ball.velocity-=algCL.velocityIncrement;
              // console.log("velocity decreasing");
            }
          }

        } else {
                //check for ball-ball collisions
        if(algCL.ballsCollide){
          algCL.checkBallCollisions();
        }
          ball.x += ball.dx; // Update x position only if no collision
        }

        if (ball.y + ball.dy >= 600 - ball.circleRadius || ball.y + ball.dy <= ball.circleRadius) {

          // wrap around or correct position to be within bounds
          algCL.rebound(ball, "y");
          if (ball.y + ball.dy >= 600 - ball.circleRadius) {
            ball.y = 600 - ball.circleRadius;
          } else {
            ball.y = ball.circleRadius;
          }
          if(algCL.velocityChangesOnCollision){
            // console.log("changing velocity");
            if(algCL.speedUpOnCollision){
              ball.velocity+=algCL.velocityIncrement;
              // console.log("velocity increase");
            }
            else{
              ball.velocity-=algCL.velocityIncrement;
              // console.log("velocity decreasing");
            }
          }
        }
        else {
                //check for ball-ball collisions
        if(algCL.ballsCollide){
          algCL.checkBallCollisions();
        }
          ball.y += ball.dy; // Update y position only if no collision
      }
    }

      if (algCL.gradientMethod == "setlist" || algCL.gradientMethod == "inverse"){
        algCL.colorGradient(ball);
      }

      // console.log(ball.currentSingleColor);

      ball.colorstep++;
      algCL.drawCircle(ball.x, ball.y, ball.circleRadius, ball.currentSingleColor, ball.circleAlpha);

      //randomly change direction when threshold reached
      if (algCL.randomChange){
        if (algCL.NumOfStepsDone == algCL.randomChangeSteps){
          ball.angle = 2 * Math.PI - ball.angle;
        }
      }
      // // console.log(algCL.NumOfStepsDone);
      // // console.log(algCL.velocity);
      // // console.log("dy:" + algCL.dy);

    }
    algCL.NumOfStepsDone++;
  }
}


algCL.combineOnCollision = function(ball1, ball2) {

  let momentum1 = ball1.circleRadius * ball1.velocity;
  let momentum2 = ball2.circleRadius * ball2.velocity;

  //make mass ~ radius
  //use momentum as a weight for net forces

  let totalMomentum = momentum1 + momentum2;

  //use momentum as a weighting and average the x and y velocities

  let weightAvgVelX = ((momentum1 * ball1.dx) + (momentum2 * ball2.dx)) / totalMomentum;
  let weightAvgVelY = ((momentum1 * ball1.dy) + (momentum2 * ball2.dy)) / totalMomentum;

  let combX = (ball1.x + ball2.x) / 2
  let combY = (ball1.y + ball2.y) / 2

  let combR;

  combR = ball1.circleRadius + ball2.circleRadius;
  if (combR >= 300){
    combR = Math.max(ball1.circleRadius, ball2.circleRadius)
  }



  let newVel = Math.sqrt(weightAvgVelX ** 2 + weightAvgVelY ** 2);
  let newAngle = Math.atan2(weightAvgVelY, weightAvgVelX);

  let newColor = algCL.rgbToString(
      algCL.weightedColorAvg(0.5, ball1.gradientColorOne, ball2.gradientColorTwo)
  );

  let newAlph;
  if (algCL.combineAlphaMode == "change"){
    newAlph = (ball1.circleAlpha + ball2.circleAlpha) * algCL.combineAlphaChangeFactor;
  }
  else if (algCL.combineAlphaMode == "sum"){
    newAlph = ball1.circleAlpha + ball2.circleAlpha;
  }
  else if (algCL.combineAlphaMode == "min"){
    newAlph = Math.min(ball1.circleAlpha, ball2.circleAlpha);
  }
  else{
    newAlph = Math.max(ball1.circleAlpha, ball2.circleAlpha);
  }

  let newBall = new Ball(combX, combY, combR, newColor, newAlph, newVel, newAngle);
  newBall.gradientColorOne = ball1.gradientColorOne;
  newBall.gradientColorTwo = ball2.gradientColorTwo;

  let index1 = algCL.ballArray.indexOf(ball1);
  let index2 = algCL.ballArray.indexOf(ball2);
  if (index1 !== -1) algCL.ballArray.splice(index1, 1);
  if (index2 !== -1) algCL.ballArray.splice(index2 - (index1 < index2 ? 1 : 0), 1);

  algCL.ballArray.push(newBall);

  //let ball = new Ball(x, y, radius, algCL.rgbToString(gradientColorOne), 1, velocity, angle);

}

//Ball-Ball Collisions
// Check through array for adist_jhat balls that will be colliding
//use dist to see if the distance between adist_jhat is less than their radiuses combined
//reverse angles, offset x and y.
//swap colors?

algCL.checkBallCollisions = function() {
  const overlapScaler = 0.8; // Scales how much balls get pushed away after colliding

  for (let i = algCL.ballArray.length - 1; i >= 0; i--) {
    let ball1 = algCL.ballArray[i];
    if (!ball1) continue; // Skip if ball1 is undefined

    for (let j = i - 1; j >= 0; j--) {
      let ball2 = algCL.ballArray[j];
      if (!ball2) continue; // Skip if ball2 is undefined

      // Calculate distance between balls
      let dx = ball1.x - ball2.x;
      let dy = ball1.y - ball2.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      let radiusSum = ball1.circleRadius + ball2.circleRadius;

      if (dist < radiusSum) {
        // Check if balls should combine
        if (algCL.handleCollision === "combine") {
          algCL.combineOnCollision(ball1, ball2);
          return;
        }

        // Check if balls should disappear on collision
        else if (algCL.handleCollision === "disappear") {
          // console.log("removing 2 balls!");
          algCL.ballArray.splice(i, 1);
          algCL.ballArray.splice(j, 1);
          break; // Exit inner loop
        }

        // Check if balls should change radii
        else if (algCL.handleCollision === "change radii") {
          ball1.circleRadius *= algCL.ballRadiiCollisionFactor;
          ball2.circleRadius *= algCL.ballRadiiCollisionFactor;
        }

        // Calculate overlap correction
        let overlap = radiusSum - dist;
        let dist_ihat = dx / dist;
        let dist_jhat = dy / dist;

        // Adjust positions to prevent overlap
        ball1.x += overlap * overlapScaler * dist_ihat;
        ball1.y += overlap * overlapScaler * dist_jhat;
        ball2.x -= overlap * overlapScaler * dist_ihat;
        ball2.y -= overlap * overlapScaler * dist_jhat;

        // Call ballRebound
        algCL.ballRebound(ball1, ball2, dist_ihat, dist_jhat);
      }
    }
  }
};




algCL.ballRebound = function(ball1, ball2, dist_ihat, dist_jhat){


  //use the directional unit components to get normal components of
  //the balls' velocity (normal along the collision line)
  let ball1ogv = ball1.velocity;
  let ball2ogv = ball2.velocity;
  let ball1oga = ball1.angle;
  let ball2oga = ball2.angle;

  let ball1_normvel = ball1.dx * dist_ihat + ball1.dy * dist_jhat;
  let ball2_normvel = ball2.dx * dist_ihat + ball2.dy * dist_jhat;

  //tangential components of velocity
  let ball1_tanvel = -ball1.dx * dist_jhat + ball1.dy * dist_ihat;
  let ball2_tanvel = -ball2.dx * dist_jhat + ball2.dy * dist_ihat;

  // swap the values
  [ball1_normvel, ball2_normvel] = [ball2_normvel, ball1_normvel];

  // Get actual dx and dy
  ball1.dx = ball1_normvel * dist_ihat - ball1_tanvel * dist_jhat;
  ball1.dy = ball1_normvel * dist_jhat + ball1_tanvel * dist_ihat;
  ball2.dx = ball2_normvel * dist_ihat - ball2_tanvel * dist_jhat;
  ball2.dy = ball2_normvel * dist_jhat + ball2_tanvel * dist_ihat;

  ball1.velocity = Math.sqrt(ball1.dx ** 2 + ball1.dy ** 2);
  ball2.velocity = Math.sqrt(ball2.dx ** 2 + ball2.dy ** 2);
  ball1.angle = Math.atan2(ball1.dy, ball1.dx);
  ball2.angle = Math.atan2(ball2.dy, ball2.dx);

  if (ball1.velocity == 0 && ball2.velocity == 0){
    ball1.velocity = ball1ogv;
    ball2.velocity = ball2ogv;
    ball1.angle = ball1oga;
    ball2.angle = ball2oga;
  }

}



algCL.wrapAround = function(ball, direction, vel){

  if (direction == "x"){
      if (ball.x + vel >= 600 - ball.circleRadius){
        ball.x = 1 - ball.circleRadius;
      }
      else if (ball.x + vel <= ball.circleRadius){
        ball.x = 599 + ball.circleRadius;
      }
      else{
        return;
      }
      if (algCL.wrapAroundRandom){
        ball.y = Math.floor(Math.random() * (600 - 2 * ball.circleRadius + 1)) + ball.circleRadius;
      }
    }

  else if (direction == "y"){
    if (ball.y + vel >= 600 - ball.circleRadius){
      ball.y = 1 - ball.circleRadius;
    }
    else if (ball.y + vel <= ball.circleRadius){
      ball.y = 599 + ball.circleRadius;
    }
    else{
      return;
    }
    if (ball.wrapAroundRandom){
      ball.x = Math.floor(Math.random() * (600 - 2*ball.circleRadius + 1)) + ball.circleRadius;
    }
  }

  if(algCL.gradientMethod == "inverse" || algCL.gradientMethod == "setlist"){
    algCL.collisionGradient(ball)
  }
  else{
    let newColors = ball.circleColors.filter(color => color!= ball.currentSingleColor);
    ball.currentSingleColor = algCL.rgbToString(newColors[Math.floor(Math.random() * newColors.length)]);
  }

}


algCL.rebound = function(ball, direction) {

// Introduce some randomness into angle, so it doesn't just
// repeat the same pattern

  // console.log(algCL.angle);
  if (direction == "x"){
    ball.angle = Math.PI - ball.angle;
    // algCL.dx = -algCL.dx;
    // console.log("x collision");
  }
  else if (direction == "y"){
    ball.angle = -ball.angle;
    // algCL.dy = -algCL.dy;
    // console.log("y collision");
  }
  //randomness intro:
  if(algCL.collisionAngleRandomness){
    ball.angle += (Math.random() * algCL.angleRandomnessScaler); // Increase random adjustment
    ball.angle %= 2 * Math.PI;
  }


  if(algCL.gradientMethod == "gradient" || algCL.gradientMethod == "setlist"){
    algCL.collisionGradient(ball)
  }
  else{
    // console.log("changing color!");
    // console.log(ball.currentSingleColor);
    let newColors = ball.circleColors.filter(color => color!= ball.currentSingleColor);
    ball.currentSingleColor = algCL.rgbToString(newColors[Math.floor(Math.random() * newColors.length)]);
    // console.log(ball.currentSingleColor);
  }

  if (algCL.ballsDivideOnWallCollision && ball.circleRadius > 1) {
    // console.log("Ball splitting!");
    let newRadius = ball.circleRadius / 2; // halve og radius for new balls.
    let offset = newRadius / 2;


    let ball1 = new Ball(
      ball.x + offset * Math.cos(ball.angle + Math.PI / 6),
      ball.y + offset * Math.sin(ball.angle + Math.PI / 6),
      newRadius,
      ball.currentSingleColor,
      ball.circleAlpha,
      ball.velocity,
      ball.angle + Math.PI / 6
    );
    ball1.gradientColorOne = ball.gradientColorOne;
    ball1.gradientColorTwo = ball.gradientColorTwo;

    let ball2 = new Ball(
      ball.x + offset * Math.cos(ball.angle - Math.PI / 6),
      ball.y + offset * Math.sin(ball.angle - Math.PI / 6),
      newRadius,
      ball.currentSingleColor,
      ball.circleAlpha,
      ball.velocity,
      ball.angle - Math.PI / 6
    );

    ball2.gradientColorOne = ball.gradientColorOne;
    ball2.gradientColorTwo = ball.gradientColorTwo;

    algCL.ballArray.push(ball1);
    algCL.ballArray.push(ball2);

    let index = algCL.ballArray.indexOf(ball);
    if (index !== -1) algCL.ballArray.splice(index, 1);
  }
};


algCL.collisionGradient = function(ball){

  if (algCL.gradientMethod == "setlist"){

    ball.gradientColorOne = ball.gradientColorTwo;
    // console.log("test1:", ball.gradientColorOne);
    let newColors = ball.circleColors.filter(color => color!= ball.gradientColorOne);
    ball.gradientColorTwo = algCL.rgbToString(newColors[Math.floor(Math.random() * newColors.length)]);
    ball.currentSingleColor = algCL.rgbToString(ball.gradientColorOne); // Set to gradient color one initially

  }
  if (algCL.gradientMethod == "inverse"){

    ball.gradientColorOne = (algCL.randomColor());
    ball.gradientColorTwo = algCL.invertColor(ball.gradientColorOne);
    ball.currentSingleColor = algCL.rgbToString(ball.gradientColorOne);
  }
}


algCL.randomColor = function(){
  let r = Math.floor(256 * Math.random());
  let g = Math.floor(256 * Math.random());
  let b = Math.floor(256 * Math.random());
  return [r, g, b];

}


algCL.invertColor = function([r,g,b]){
  let r2 = 255-r;
  let g2 = 255-g;
  let b2 = 255-b;
  return [r2, g2, b2];
}

algCL.rgbToString = function(rgb) {
  return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
}


algCL.colorGradient = function(ball) {
    let step = ball.colorstep % algCL.colorCycleLength;
    let weight = Math.abs(2 * step / algCL.colorCycleLength - 1);
    // console.log(weight);
    let rgb = algCL.weightedColorAvg(weight, ball.gradientColorOne, ball.gradientColorTwo);
    // console.log(rgb);
    ball.currentSingleColor = algCL.rgbToString(rgb);
}

algCL.weightedColorAvg = function(weight, color1, color2){


  if (typeof color1 === "string") {
    color1 = color1.slice(4, -1).split(",");
    color1 = [parseInt(color1[0]), parseInt(color1[1]), parseInt(color1[2])];
 }
  if (typeof color2 === "string") {
    color2 = color2.slice(4, -1).split(",");
    color2 = [parseInt(color2[0]), parseInt(color2[1]), parseInt(color2[2])];
}

  // console.log("gradc1:", color1);
  // console.log("gradc2:", color2);

  let r1 = color1[0];
  let g1 = color1[1];
  let b1 = color1[2];

  let r2 = color2[0];
  let g2 = color2[1];
  let b2 = color2[2];

  let r = weight * r1 + (1 - weight) * r2;
  let g = weight * g1 + (1 - weight) * g2;
  let b = weight * b1 + (1 - weight) * b2;
  let rgb = [Math.floor(r), Math.floor(g), Math.floor(b)];
  // console.log("weighted avg: ", rgb);
  return rgb;
}

algCL.reset = function () {
  // Check if already running
  algCL.pause();
  // Initialize values

  algCL.ballArray = [];
  for (i=0; i< algCL.numBalls; i++ ){
    let x = Math.floor(Math.random() * (600 - 200)) + 100;
    let y = Math.floor(Math.random() * (600 - 200)) + 100;

    let angle = Math.random() * 2 * Math.PI;

    let velocity = algCL.minimumVelocity + Math.random() * (algCL.maximumVelocity - algCL.minimumVelocity);;
    let radius = algCL.minimumRadius + Math.random() * (algCL.maximumRadius - algCL.minimumRadius);
    let alpha = algCL.minimumAlpha + Math.random() * (algCL.maximumAlpha - algCL.minimumAlpha);

    if (algCL.paletteSelect == "default") {
      algCL.circleColors = algCL.palettes[0];
    }
    else if (algCL.paletteSelect == "pastel") {
        algCL.circleColors = algCL.palettes[1];
    }
    else if (algCL.paletteSelect == "earth") {
        algCL.circleColors = algCL.palettes[2];
    }
    else if (algCL.paletteSelect == "cool") {
        algCL.circleColors = algCL.palettes[3];
    }
    else if (algCL.paletteSelect == "warm") {
        algCL.circleColors = algCL.palettes[4];
    }
    else if (algCL.paletteSelect == "regal") {
        algCL.circleColors = algCL.palettes[5];
    }
    else if (algCL.paletteSelect == "greyscale"){
        algCL.circleColors = algCL.palettes[6];
    }

    if (algCL.gradientMethod == "setlist"){
      gradientColorOne = algCL.rgbToString(algCL.circleColors[Math.floor(Math.random() * algCL.circleColors.length)]);
      let newColors = algCL.circleColors.filter(color => color != gradientColorOne);
      gradientColorTwo = algCL.rgbToString(newColors[Math.floor(Math.random() * newColors.length)]);
      currentSingleColor = gradientColorOne;
    }
    if (algCL.gradientMethod == "inverse"){
      gradientColorOne = algCL.randomColor();
      gradientColorTwo = algCL.invertColor(gradientColorOne);
      currentSingleColor = gradientColorOne;
    }
    else {
      currentSingleColor = algCL.rgbToString(algCL.circleColors[Math.floor(Math.random() * algCL.circleColors.length)]);
      gradientColorOne = currentSingleColor;
      gradientColorTwo = currentSingleColor;
    }

    let ball = new Ball(x, y, radius, currentSingleColor, alpha, velocity, angle);
    ball.gradientColorOne = gradientColorOne;
    ball.gradientColorTwo = gradientColorTwo;
    ball.colorstep = 1;

    algCL.ballArray.push(ball);
  }

  ctx.clearRect(0,0,600,600)

  algCL.NumOfStepsDone = 0;
  algCL.collisionDampener = 0.8;
  ctx.globalAlpha = 1;
  ctx.lineWidth = 2;

}

algCL.initialize = function() {
  algCL.reset();
}

algCL.pause = function () {
  if("loop" in algCL) {
    clearInterval(algCL.loop);
  }
}

algCL.start = function () {
  //draw initial circle at starting spot, then begin the loop, calculating trajectory
  algCL.initialize();
  ctx.globalAlpha = 1;
  ctx.fillStyle = algCL.backgroundColor;
  ctx.fillRect(0, 0, 600, 600);
  algCL.loop = setInterval(algCL.drawOneStep, algCL.speed);
}
