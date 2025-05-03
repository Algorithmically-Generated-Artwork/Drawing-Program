var algCS = {};
algCS.pallettes = {
  warm: [
    "#f1c40f",
    "#f39c12",
    "#e67e22",
    "#d35400",
    "#e74c3c",
    "#c0392b",
  ],
  cool: [
    "#52be80",
    "#45b39d",
    "#48c9b0",
    "#5dade2",
    "#5499c7",
    "#a569bd",
  ],
  reds: [
    "#922b21",
    "#a93226",
    "#cb4335",
    "#c0392b",
    "#cd6155",
    "#ec7063",
  ],
  oranges: [
    "#f39c12",
    "#e67e22",
    "#d35400",
    "#f5b041",
    "#eb984e",
    "#dc7633",
  ],
  yellows: [
    "#b7950b",
    "#d4ac0d",
    "#f1c40f",
    "#f4d03f",
    "#f7dc6f",
    "#f9e79f",
  ],
  greens: [
    "#1e8449",
    "#239b56",
    "#7dcea0",
    "#82e0aa",
    "#52be80",
    "#58d68d",
  ],
  blues: [
    "#039be5",
    "#4fc3f7",
    "#1e88e5",
    "#64b5f6",
    "#3949ab",
    "#5c6bc0",
  ],
  slate: [
    "#273746",
    "#2e4053",
    "#34495e",
    "#2c3e50",
    "#566573",
    "#5d6d7e",
  ],
  purples: [
    "#6c3483",
    "#7d3c98",
    "#8e44ad",
    "#a569bd",
    "#bb8fce",
    "#d2b4de",
  ],
  greyscale: [
    "#7b7d7d",
    "#979a9a",
    "#b3b6b7",
    "#f0f3f4",
    "#fdfefe",
  ],
}

algCS.backgroundColors = ["#051029", "#1E2B58", "#253569", "#353283", "#48459a"];

algCS.lightBackgroundColors = ["#cfecf7", "#a0d9ef", "#62c1e5"]

// generates random hex color
algCS.randomHexColor = function() {
  let hex = ["#"];
  for (let i = 0; i < 6; i++) {
    hex.push(Math.floor(Math.random()*16).toString(16));
  }
  return hex.join("");
}

// sets background color
algCS.setBackgroundColor = function(color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.globalAlpha = 1;
  ctx.rect(0, 0, width, height);
  ctx.fill();
  ctx.closePath();
}

// draws star node
algCS.drawStar = function(x, y, radius) {
  if (algCS.starColMode === "gradient") {
    let color1 = algCS.hexToRGB(algCS.starGradientColorOne);
    let color2 = algCS.hexToRGB(algCS.starGradientColorTwo);

    if (algCS.starGradientRandomColors) {
      color1 = algCS.randColor();
      color2 = algCS.randColor();
    }
    let initial = radius*algCS.colorCycleLengthModifier;
    while (radius > 1) {

      let step = radius % initial;
      let weight = Math.abs(2 * step / initial - 1);

      let colorArray = algCS.weightedColorAvg(weight, color1, color2);

      let alpha = algCS.randomAlpha ? Math.random() * algCS.randomAlphaMax : algCS.starAlpha;
      algCS.makePolygon(x,y,radius,colorArray, alpha, true)
      radius--;
    }
  } else if (algCS.starColMode === "random") {
    algCS.makePolygon(x, y, radius, algCS.randColor(), 1.0, true)
  } else if (algCS.starColMode === "fixed") {
    algCS.makePolygon(x, y, radius, algCS.hexToRGB(algCS.starFixedColor), 1.0, true)
  }
}

// ** Thanks to Michael Wehar (AlgStickers) for star function (modified) below and design
algCS.makePolygon = function(x, y, radius, colorArray, alpha, fillFlag) {
  ctx.globalAlpha = alpha;
  if(fillFlag) {
    ctx.fillStyle = algCS.colorFormat(colorArray);
  } else {
    ctx.strokeStyle = algCS.colorFormat(colorArray);
  }

  let numOfInBetween = algCS.starCurvePoints
  numOfPoints = (1+numOfInBetween) * algCS.numOfStarPoints;
  let angleOffset = 2 * Math.PI / numOfPoints;
  algCS.setExpFactors(numOfInBetween+2)

  ctx.beginPath();
  ctx.moveTo(x, y - radius);

  for (let i = 1; i <= numOfPoints; i++) {
    let angle =  i * angleOffset - Math.PI / 2;

    let dX = (radius * Math.pow(algCS.innerRadiusScale, algCS.getExpFactor(i, 1+numOfInBetween))) * Math.cos(angle);
    let dY = (radius * Math.pow(algCS.innerRadiusScale, algCS.getExpFactor(i, 1+numOfInBetween))) * Math.sin(angle);

    ctx.lineTo(x + dX, y + dY);
  }

  ctx.closePath();
  if(fillFlag) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}
// makePolygon helpers to define points of a star
algCS.setExpFactors = function(num) {
  algCS.curveArray = [];

  for (let i = 0; i < num; i++) {
    if (i+1 <= Math.ceil(num/2)) {
      algCS.curveArray[i] = i
    } else {
      algCS.curveArray[i] = num-i-1
    }
  }
}
algCS.getExpFactor = function(i, num) {
  return Math.sqrt(algCS.curveArray[i%num])
  // return Math.log10(algCS.curveArray[i%num]+1)
  // return algCS.curveArray[i%num]
}

// draws bullseye node
algCS.drawBullseye = function(x, y, radius) {
  if (algCS.bullseyeMode === "linearGradient") {

    let color1 = algCS.hexToRGB(algCS.linearGradientColorOne);
    let color2 = algCS.hexToRGB(algCS.linearGradientColorTwo);
    if (algCS.linearGradientRandomColors) {
      color1 = algCS.randColor();
      color2 = algCS.randColor();
    }

    let initial = radius*algCS.colorCycleLengthModifier;

    while (radius > 1) {
      let step = radius % initial;
      let weight = Math.abs(2 * step / initial - 1);

      let colorArray = algCS.weightedColorAvg(weight, color1, color2);

      let alpha = algCS.randomAlpha ? Math.random() * algCS.randomAlphaMax : algCS.bullseyeAlpha;

      algCS.drawCircle(x, y, radius, alpha, algCS.colorFormat(colorArray) );
      radius--;
    }

  } else if (algCS.bullseyeMode === "random") {
    while (radius > 1) {
      let colorArray = algCS.randColor();
      algCS.drawCircle(x, y, radius, 1, algCS.colorFormat(colorArray) );
      radius--;
    }
  }
}

// draws glow
algCS.drawGlow = function(x, y, baseRadius, alpha, color, base) {
  let radius = baseRadius*(Math.random()*(base-1.5) + 1.5);
  while (radius > 1) {
    algCS.drawCircle(x, y, radius, alpha, color);
    radius--;
  }
}

// draws a circle
algCS.drawCircle = function(x, y, radius, alpha, color) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}

// draws line
algCS.drawLine = function (p1,p2) {
  ctx.globalAlpha = 0.85;
  // ctx.strokeStyle = algCS.circleColors[Math.floor(Math.random() * algCS.circleColors.length)];
  ctx.globalAlpha = algCS.lineAlpha;
  ctx.strokeStyle = algCS.lineColor;
  ctx.lineWidth = algCS.lineWidthSizeFactor * Math.floor(algCS.calculateDistance(p1,p2)/25);
  ctx.beginPath();
  ctx.moveTo(p1[0],p1[1]);
  ctx.lineTo(p2[0],p2[1]);
  ctx.stroke();
  ctx.closePath();
}

// returns radius of large nodes using parameters
algCS.getRadius = function() {
  return Math.random() * (algCS.maxRadius  - algCS.minRadius) + algCS.minRadius
}

// helper to convert hex string color to RGB array
algCS.hexToRGB = function(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// helper that generates a random color RGB array
algCS.randColor = function() {
  return [algCS.randInt(255), algCS.randInt(255), algCS.randInt(255)]
}

// helper that finds weighted color average of two colors given a weight
algCS.weightedColorAvg = function(weight, colorOne, colorTwo) { //
  // Color One
  let r1 = colorOne[0];
  let g1 = colorOne[1];
  let b1 = colorOne[2];
  // Color Two
  let r2 = colorTwo[0];
  let g2 = colorTwo[1];
  let b2 = colorTwo[2];
  // Averaged Color
  let r = weight * r1 + (1 - weight) * r2;
  let g = weight * g1 + (1 - weight) * g2;
  let b = weight * b1 + (1 - weight) * b2;
  return [r, g, b];
}

// helper that formats a RGB color array to a string
algCS.colorFormat = function(colorArray) { //
  let r = Math.floor(colorArray[0]);
  let g = Math.floor(colorArray[1]);
  let b = Math.floor(colorArray[2]);
  return "rgb(" + r + "," + g + "," + b + ")";
}

// helper that calculates euclidean distance
algCS.calculateDistance = function (p1, p2) { //
  return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]));
}

// helper that generates a whole random number from 0 to max (inclusive)
algCS.randInt = function(max) {
  return Math.floor(Math.random() * (max + 1))
}

// function that maps value from one range to another
algCS.mapValue = function (value, range1, range2) {
  return range2[0] + (((value-range1[0])*(range2[1]-range2[0]))/(range1[1]-range1[0]))
}

// attemptStep helper function to find candidate coordinates for a node
algCS.findCoordinates = function (existingPoint) {
  let x = Math.floor(width * Math.random());
  let y = Math.floor(height * Math.random());

  if (algCS.placementMode == "grid") {
    x = Math.floor(algCS.gridDim * Math.random()) * (width / (algCS.gridDim - 1));
    y = Math.floor(algCS.gridDim * Math.random()) * (height / (algCS.gridDim - 1));

  } else if (algCS.placementMode == "discreteAngle" && algCS.positions.length > 0) {
    // choose start
    let temp = algCS.positions[Math.floor(Math.random() * algCS.positions.length)]
    existingPoint[0] = temp[0];
    existingPoint[1] = temp[1];
    // Choose base angle
    let baseAngle = Math.PI / algCS.angleDenom;
    // Choose multiple of angle
    let rangeMultiple = Math.floor((2 * Math.PI) / baseAngle);
    let angle = baseAngle * (Math.floor(Math.random() * (rangeMultiple) + 1))
    // Length
    let tempLength = Math.random() * 0.1 * Math.min(height,width) + 1;
    tempLength = Math.max(algCS.minDist, tempLength)

    x = existingPoint[0] + tempLength * Math.cos(angle)
    y = existingPoint[1] + tempLength * Math.sin(angle)

    x = Math.max(0, Math.min(width, x))
    y = Math.max(0, Math.min(height, y))
  }

  return {x: x, y: y};
}

// attemptStep helper function to validate distance constraint for a node
algCS.validateDistance = function (p) {
  if (algCS.minDist && algCS.positions.length > 0) {
    for (let i = 0; i < algCS.positions.length; i++) {
      let tempDist = algCS.calculateDistance([p.x, p.y], algCS.positions[i]);
      if (tempDist < algCS.minDist) {
        return false;
      }
    }
  }
  return true;
}

// attemptStep helper function to validate overlapping lines constraint
algCS.validateOverlappingLines = function (p, existingPoint) {
  for (let j = 0; j < algCS.edges.length; j++) {
    // Credit to Michael Wehar (algGP) for checkIntersection function
    if (algGP.checkIntersection([p.x, p.y], existingPoint, algCS.edges[j][0], algCS.edges[j][1])) {
      return false;
    }
  }

  return true;
}

// attemptStep helper function to place candidate node
algCS.placeNode = function (p, largeRadius, isSmallNode) {
  if (!isSmallNode) {

    if (algCS.largeNodeShape === "bullseye") {
      algCS.drawBullseye(p.x, p.y, largeRadius);
    } else if (algCS.largeNodeShape === "star") {
      algCS.drawStar(p.x, p.y, largeRadius)
    } else if (algCS.largeNodeShape === "both") {
      let tmp = Math.random();
      if (tmp > algCS.bothShapeModeStarProb) {
        algCS.drawBullseye(p.x, p.y, largeRadius);
      } else {
        algCS.drawStar(p.x, p.y, largeRadius);
      }
    }

    if (algCS.glow) {
      algCS.drawGlow(p.x, p.y, largeRadius, 0.01, algCS.randomGlow ? algCS.colorFormat(algCS.randColor()) : algCS.glowColor, algCS.glowLargeRadiusFactor);
    }

  } else {

    let smallRadius = Math.floor(Math.random()*3 + 1)
    if (algCS.smallCircleMode === "fixed") {
      algCS.drawCircle(p.x, p.y, smallRadius, 0.75, algCS.smallCircleColorFixed);
    } else if (algCS.smallCircleMode === "random") {
      algCS.drawCircle(p.x, p.y, smallRadius, 0.75, algCS.colorFormat(algCS.randColor()));
    }

    if (algCS.glowOnSmall) {
      algCS.drawGlow(p.x, p.y, smallRadius, 0.01, algCS.randomGlow ? algCS.colorFormat(algCS.randColor()) : algCS.glowColor,algCS.glowSmallRadiusFactor);
    }
  }
}

// attempts to place a node
algCS.attemptStep = function () {
  let largeRadius = algCS.getRadius();
  let existingPoint = [Infinity, Infinity];
  let p = algCS.findCoordinates(existingPoint);

  if (!algCS.validateDistance(p)) {
    return false;
  }

  // finds existing node to connect with candidate node
  if (algCS.placementMode != "discreteAngle") {
    existingPoint = [Infinity, Infinity];
    for (let i = 0; i < algCS.positions.length; i++) {
      if (algCS.calculateDistance(algCS.positions[i], [p.x, p.y]) < algCS.calculateDistance(existingPoint, [p.x, p.y])) {
        existingPoint = [algCS.positions[i][0], algCS.positions[i][1]];
      }
    }
  }

  if (!algCS.overlappingLines && !algCS.validateOverlappingLines(p, existingPoint)) {
    return false;
  }

  // place candidate node
  let isSmallNode = Math.floor(Math.random()*algCS.largeNodeCommonFactor);
  algCS.placeNode(p, largeRadius, isSmallNode);

  // draw line from current node to an existing node
  algCS.drawLine([p.x, p.y], existingPoint);
  if (!algCS.overlappingLines) {
    algCS.edges.push([[p.x, p.y], existingPoint])
  }

  // decide whether or not to make current node a leaf
  if (isSmallNode) {
    algCS.positions.push([p.x, p.y]);
  } else if (!isSmallNode && !algCS.forceBigNodeLeafs) {
    algCS.positions.push([p.x, p.y]);
  }

  return true;
}

algCS.drawOneStep = function () {
  if(algCS.numOfSteps > algCS.maxNumOfSteps) {
    clearInterval(algCS.loop);
    return false;
  } else {
    let validStep = false;
    let count = 0;
    while (!validStep && count < algCS.maxAttempsPerStep) {
      validStep = algCS.attemptStep();
      count++;
    }
    algCS.numOfSteps++;
  }
}

algCS.reset = function () {
  // Check if already running
  algCS.pause();
  // Initialize values
  algCS.numOfSteps = 0;
  algCS.positions = [];
  algCS.edges = [];
  algCS.curveArray = [];
}

algCS.initialize = function() {
  algCS.reset();
}

algCS.pause = function () {
  if("loop" in algCS) {
    clearInterval(algCS.loop);
  }
}

algCS.start = function () {
  if (algCS.setBackground) {
    algCS.setBackgroundColor(algCS.backgroundColor);
  }
  algCS.loop = setInterval(algCS.drawOneStep, algCS.speed);
  algCS.positions = [];
  algCS.edges = [];
  algCS.curveArray = [];
}

// helper for randomize that loads default parameters
algCS.loadDefaultParams = function () {
  algCS.speed = 0;
  algCS.maxNumOfSteps = 500;
  algCS.maxRadius = 20;
  algCS.minRadius = 10;
  algCS.bullseyeMode = "linearGradient"
  algCS.linearGradientRandomColors = false;
  algCS.linearGradientColorOne = "#FF0000"
  algCS.linearGradientColorTwo = "#FFFF00"
  algCS.colorCycleLengthModifier = 2;
  algCS.smallCircleMode = "fixed"
  algCS.smallCircleColorFixed = "yellow";
  algCS.backgroundColor = "#051029";
  algCS.lineColor = "white";
  algCS.minDist = 5;
  algCS.forceBigNodeLeafs = true;
  algCS.largeNodeCommonFactor = 10;
  algCS.lineWidthSizeFactor = 0.25;
  algCS.setBackground = true;
  algCS.maxAttempsPerStep = 15;
  algCS.glow = true;
  algCS.glowOnSmall = false;
  algCS.glowLargeRadiusFactor = 2;
  algCS.glowSmallRadiusFactor = 4;
  algCS.glowColor = "yellow";
  algCS.largeNodeShape = "star";
  algCS.starFixedColor = "#0000FF";
  algCS.starColMode = "gradient";
  algCS.starGradientColorOne = "#FF0000"
  algCS.starGradientColorTwo = "#FFFF00"
  algCS.starGradientRandomColors = false;
  algCS.numOfStarPoints = 4;
  algCS.innerRadiusScale = 0.5;
  algCS.randomGlow = false;
  algCS.overlappingLines = true;
  algCS.starAlpha = 1.0;
  algCS.lineAlpha = 1.0;
  algCS.bullseyeAlpha = 1.0;
  algCS.randomAlpha = false;
  algCS.randomAlphaMax = 0.35;
  algCS.bothShapeModeStarProb = 0.75
  algCS.placementMode = "random";
  algCS.gridDim = 25;
  algCS.starCurvePoints = 4
  algCS.angleDenom = 4;
  algCS.discreteAngleMaxLength = 50;
}

// helper for randomize that varies default parameters
algCS.varyClassicParams = function () {
  algCS.placementMode = ["random", "grid", "discreteAngle"][Math.floor(Math.random()*3)];
  if (algCS.placementMode === "discreteAngle") {
    algCS.overlappingLines = true;
    algCS.minDist += Math.floor(Math.random()*15) + 15;
    algCS.discreteAngleMaxLength += Math.random()*10 + 45;
  } else {
    algCS.overlappingLines = Math.floor(Math.random()*2);
    algCS.minDist += Math.floor(Math.random()*10);
  }
  algCS.largeNodeShape = ["star", "bullseye", "both"][Math.floor(Math.random()*3)];
  if (Math.random() < 0.2) {
    algCS.largeNodeShape = "star"
  }
  algCS.starAlpha = Math.random() * 0.5 + 0.5;
  algCS.lineAlpha = Math.random() * 0.5 + 0.5;
  if (Math.random() < 0.35) {
    algCS.maxRadius = 27
    algCS.minRadius = 3
    algCS.maxRadius += Math.floor(Math.random() * 10);
    algCS.minRadius += Math.floor(Math.random() * 9);
    if (Math.random() < 0.65) {
      algCS.maxRadius = 18 + Math.floor(Math.random()*5)
      algCS.minRadius = 8 + Math.floor(Math.random()*5)
    }
  } else if (Math.random() < 0.25) {
    algCS.maxRadius = 12
    algCS.minRadius = 3
    algCS.maxRadius += Math.floor(Math.random() * 5);
    algCS.minRadius += Math.floor(Math.random() * 5);
  } else {
    algCS.maxRadius = 35
    algCS.minRadius = 15
    algCS.maxRadius += Math.floor(Math.random() * 5);
    algCS.minRadius += Math.floor(Math.random() * 5);
    algCS.largeNodeCommonFactor--;
  }

  algCS.forceBigNodeLeafs = Math.floor(Math.random()*2);
  algCS.largeNodeCommonFactor += Math.random()*2 - 1;
  algCS.lineWidthSizeFactor = Math.round(Math.random()*1.5 * 10) / 10;
  algCS.glow = Math.floor(Math.random()*2);
  algCS.glowOnSmall = Math.floor(Math.random()*2);
  algCS.glowLargeRadiusFactor += Math.random()*2 - 1;
  algCS.glowSmallRadiusFactor += Math.random()*2 - 1;
  algCS.numOfStarPoints = Math.floor(Math.random()*7) + 2;
  if (Math.random() < 0.65) {
    algCS.innerRadiusScale = 0.35 + Math.random() * 0.3;
  } else {
    algCS.innerRadiusScale = 0.5
  }
  algCS.bullseyeAlpha = Math.random() * 0.5 + 0.5;
  algCS.randomAlpha = Math.floor(Math.random()*2);
  algCS.randomAlphaMax += Math.random()*0.1 - 0.05;
  algCS.bothShapeModeStarProb += Math.random()*0.1 - 0.05
  algCS.gridDim += Math.floor(Math.random()*11) - 5;
  algCS.starCurvePoints = Math.floor(Math.random()*7) + 1
  algCS.angleDenom = Math.floor(Math.random()*7) + 2;
}

// helper for randomize that varies color pallette parameters
algCS.varyColorPallette = function() {
  let pallette = algCS.pallettes[Object.keys(algCS.pallettes)[Math.floor(Math.random()*Object.keys(algCS.pallettes).length)]]

  algCS.bullseyeMode = "linearGradient";
  algCS.linearGradientRandomColors = Math.floor(Math.random()*2);
  algCS.linearGradientColorOne = pallette[Math.floor(Math.random()*pallette.length)]
  algCS.linearGradientColorTwo = pallette[Math.floor(Math.random()*pallette.length)]
  algCS.colorCycleLengthModifier = Math.floor(Math.random()*3) + 1;
  algCS.smallCircleMode = "fixed";
  algCS.smallCircleColorFixed = pallette[Math.floor(Math.random()*pallette.length)];
  algCS.lineColor = pallette[Math.floor(Math.random()*pallette.length)];
  algCS.glowColor = pallette[Math.floor(Math.random()*pallette.length)];
  algCS.starFixedColor = pallette[Math.floor(Math.random()*pallette.length)];
  algCS.starColMode = ["gradient", "fixed"][Math.floor(Math.random()*2)];
  algCS.starGradientColorOne = pallette[Math.floor(Math.random()*pallette.length)]
  algCS.starGradientColorTwo = pallette[Math.floor(Math.random()*pallette.length)]
  if (Math.random() < 0.05) {
    algCS.backgroundColor = pallette[Math.floor(Math.random()*pallette.length)];
  }
}

// helper to set params to randomize colors instead of using pallettes
algCS.setRandomColorParams = function () {
  algCS.bullseyeMode = ["linearGradient", "random"][Math.floor(Math.random()*2)];
  algCS.linearGradientRandomColors = true;
  algCS.smallCircleMode = ["fixed", "random"][Math.floor(Math.random()*2)];
  algCS.lineColor = algCS.colorFormat(algCS.randColor());
  algCS.glowColor = algCS.colorFormat(algCS.randColor());
  algCS.starFixedColor = algCS.colorFormat(algCS.randColor());
  algCS.starColMode = ["gradient", "random", "fixed"][Math.floor(Math.random()*3)];
  algCS.starGradientRandomColors = true;
}

// helper for randomize that drastically randomizes parameters
algCS.drasticRandomize = function() {
  algCS.placementMode = ["random", "grid", "discreteAngle"][Math.floor(Math.random()*3)];

  // general node placement constraints
  algCS.minDist = Math.floor(Math.random()*25) + 5;
  algCS.largeNodeCommonFactor = Math.floor(Math.random()*15);
  algCS.overlappingLines = Math.random() < 0.5;
  algCS.gridDim = Math.floor(Math.random()*35) + 15;
  algCS.forceBigNodeLeafs = Math.random() < 0.5;

  // for discreteAngle placement mode
  algCS.angleDenom = Math.floor(Math.random()*11) + 2; // factor used to determine angles allowed e.g. 2 = pi/2 = only 90 degrees
  algCS.discreteAngleMaxLength = Math.floor(Math.random() * 50) + 25; // max distance that a node can be from another node

  // large node properties
  if (Math.random() < 0.25) {
    algCS.maxRadius = 30
    algCS.minRadius = 3
    algCS.maxRadius += Math.floor(Math.random() * 15);
    algCS.minRadius += Math.floor(Math.random() * 15);
    if (Math.random() < 0.5) {
      algCS.maxRadius = 17 + Math.floor(Math.random()*7)
      algCS.minRadius = 6 + Math.floor(Math.random()*9)
    }
  } else if (Math.random() < 0.25) {
    algCS.maxRadius = 12
    algCS.minRadius = 3
    algCS.maxRadius += Math.floor(Math.random() * 5);
    algCS.minRadius += Math.floor(Math.random() * 5);
  } else {
    algCS.maxRadius = 35
    algCS.minRadius = 15
    algCS.maxRadius += Math.floor(Math.random() * 7);
    algCS.minRadius += Math.floor(Math.random() * 7);
  }
  algCS.largeNodeShape = ["star", "bullseye", "both"][Math.floor(Math.random()*3)];
  if (Math.random() < 0.2) {
    algCS.largeNodeShape = "star"
  }
  algCS.colorCycleLengthModifier = Math.floor(Math.random() * 3) + 1; // for gradient color modes
  algCS.randomAlpha = Math.random() < 0.5;
  algCS.randomAlphaMax = Math.random() * 0.7 + 0.1;

  // bullseye node shape specific properties
  algCS.bullseyeMode = ["linearGradient", "random"][Math.floor(Math.random()*2)];
  algCS.bullseyeAlpha = Math.random() * 0.85 + 0.15;
  algCS.linearGradientRandomColors = Math.random() < 0.5;
  algCS.linearGradientColorOne = algCS.colorFormat(algCS.randColor());
  algCS.linearGradientColorTwo = algCS.colorFormat(algCS.randColor());

  // star node shape specific properties
  algCS.starColMode = ["gradient", "random", "fixed"][Math.floor(Math.random()*3)];
  algCS.starGradientColorOne = algCS.colorFormat(algCS.randColor());
  algCS.starGradientColorTwo = algCS.colorFormat(algCS.randColor());
  algCS.starGradientRandomColors = Math.random() < 0.5;
  algCS.starAlpha = Math.random() * 0.85 + 0.15;
  algCS.starFixedColor = algCS.colorFormat(algCS.randColor());
  algCS.starCurvePoints = Math.floor(Math.random()*10) + 1;
  algCS.numOfStarPoints = Math.floor(Math.random()*10) + 2;
  if (Math.random() < 0.95) {
    algCS.innerRadiusScale = 0.25 + Math.random() * 0.5;
  }

  // both shape mode
  algCS.bothShapeModeStarProb = Math.random() // probability of drawing stars in

  // small node properties
  algCS.smallCircleMode = ["fixed", "random"][Math.floor(Math.random()*2)];
  algCS.smallCircleColorFixed = algCS.colorFormat(algCS.randColor());

  // glow properties
  algCS.glow = Math.random() < 0.5;
  algCS.glowOnSmall = Math.random() < 0.5; // on small nodes
  algCS.randomGlow = Math.random() < 0.5; // color
  algCS.glowColor = algCS.colorFormat(algCS.randColor()); // default
  algCS.glowLargeRadiusFactor = 1 + Math.floor(Math.random() * 2); // size factor for large node glow
  algCS.glowSmallRadiusFactor = 2 + Math.floor(Math.random() * 4); // size factor for small node glow

  // line properties
  algCS.lineColor = algCS.colorFormat(algCS.randColor());;
  algCS.lineWidthSizeFactor = Math.round(Math.random()*2.25 * 10) / 10;
  algCS.lineAlpha = 0.1 + Math.random() * 0.9;

  algCS.placementMode = ["random", "grid", "discreteAngle"][Math.floor(Math.random()*3)];
  if (algCS.placementMode === "discreteAngle") {
    algCS.overlappingLines = true;
    algCS.minDist += Math.floor(Math.random()*40) + 5;
    algCS.discreteAngleMaxLength += Math.random()*15 + 50;
  } else {
    algCS.overlappingLines = Math.floor(Math.random()*2);
    algCS.minDist += Math.floor(Math.random()*10);
  }
}
