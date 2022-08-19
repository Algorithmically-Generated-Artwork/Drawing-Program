var algDots = {};

algDots.drawCircle = function(x, y, radius, color, alpha) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

algDots.drawOneStep = function () {
  if(algDots.numOfSteps > algDots.maxNumOfSteps) {
    clearInterval(algDots.loop);
    return false;
  } else {
    let x = Math.floor(width * Math.random());
    let y = Math.floor(height * Math.random());
    algDots.drawCircle(x, y, algDots.circleRadius, algDots.circleColor, algDots.circleAlpha);
    algDots.numOfSteps++;
  }
}

algDots.reset = function () {
  // Check if already running
  algDots.pause();
  // Initialize values
  algDots.numOfSteps = 0;
}

algDots.initialize = function() {
  algDots.reset();
}

algDots.pause = function () {
  if("loop" in algDots) {
    clearInterval(algDots.loop);
  }
}

algDots.start = function () {
  algDots.loop = setInterval(algDots.drawOneStep, algDots.speed);
}
