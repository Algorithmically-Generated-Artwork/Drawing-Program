var algGP = {};

/* Constants */
var pi = Math.PI;

/* Helper Functions */
algGP.distance = function (p1, p2) {
  return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]));
}

algGP.withinBoundaries = function (p) {
  return 0 <= p[0] && p[0] < width && 0 <= p[1] && p[1] < height;
}

algGP.computeLine = function (p1, p2) {
  let slope = (p1[1] - p2[1]) / (p1[0] - p2[0]);
  if(slope > 1000000) {
    slope = Infinity;
  } else if(slope < -1000000) {
    slope = -Infinity;
  } else if(algGP.isBetween(slope, -0.0000001, 0.0000001)) {
    slope = 0;
  }
  let intercept = p1[1] - slope * p1[0];
  return [slope, intercept];
}

algGP.equalPoints = function (p1, p2) {
  return p1[0] == p2[0] && p1[1] == p2[1];
}

algGP.isBetween = function (x, y, z) {
  return (y < x && x < z) || (z < x && x < y);
}

algGP.checkIntersection = function (p1, p2, q1, q2) {
  // Midpoint check
  let mid1 = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
  let mid2 = [(q1[0] + q2[0]) / 2, (q1[1] + q2[1]) / 2];
  if(algGP.distance(mid1, mid2) < algGP.midpointRadius) {
    return true;
  }
  // Duplicate points
  if(algGP.equalPoints(p1, q1) || algGP.equalPoints(p1, q2) || algGP.equalPoints(p2, q1) || algGP.equalPoints(p2, q2)) {
    return false;
  }
  // Intersection check
  let line1 = algGP.computeLine(p1, p2);
  let line2 = algGP.computeLine(q1, q2);
  if(!isFinite(line1[0]) && !isFinite(line2[0])) {
    if(p1[0] == q1[0]) {
      return algGP.isBetween(p1[1], q1[1], q2[1]) || algGP.isBetween(p2[1], q1[1], q2[1]) || algGP.isBetween(q1[1], p1[1], p2[1]);
    } else {
      return false;
    }
  } else if(!isFinite(line1[0]) && line2[0] == 0) {
    return algGP.isBetween(p1[0], q1[0], q2[0]) && algGP.isBetween(q1[1], p1[1], p2[1]);
  } else if(!isFinite(line2[0]) && line1[0] == 0) {
    return algGP.isBetween(q1[0], p1[0], p2[0]) && algGP.isBetween(p1[1], q1[1], q2[1]);
  } else if(!isFinite(line1[0])) {
    let y = line2[0] * p1[0] + line2[1];
    return algGP.isBetween(y, p1[1], p2[1]) && algGP.isBetween(y, q1[1], q2[1]);
  } else if(!isFinite(line2[0])) {
    let y = line1[0] * q1[0] + line1[1];
    return algGP.isBetween(y, p1[1], p2[1]) && algGP.isBetween(y, q1[1], q2[1]);
  } else if(line1[0] == line2[0] && line1[1] == line2[1]) {
    return algGP.isBetween(p1[0], q1[0], q2[0]) || algGP.isBetween(p2[0], q1[0], q2[0]) || algGP.isBetween(q1[0], p1[0], p2[0]);
  } else if(line1[0] != line2[0]) {
    let x = (line2[1] - line1[1]) / (line1[0] - line2[0]);
    return algGP.isBetween(x, p1[0], p2[0]) && algGP.isBetween(x, q1[0], q2[0]);
  } else {
    return false;
  }
}

algGP.checkValid = function (p1, p2) {
  if(!algGP.withinBoundaries(p2)) {
    return false;
  }
  if(algGP.avoidIntersections) {
    for(let i = 0; i < algGP.listOfLines.length; i++) {
      let q1 = algGP.listOfLines[i][0];
      let q2 = algGP.listOfLines[i][1];
      if(algGP.checkIntersection(p1, p2, q1, q2)) {
        return false;
      }
    }
  }
  return true;
}

/* Drawing Functions */
algGP.drawLine = function (p1, p2) {
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = algGP.lineColor;
  if(algGP.colorByLength) {
    let length = algGP.distance(p1, p2);
    let lengthScale = (length - algGP.lineMinLength) / (algGP.lineMaxLength - algGP.lineMinLength);
    let r = Math.floor(lengthScale * algGP.longColor[0] + (1 - lengthScale) * algGP.shortColor[0]);
    let g = Math.floor(lengthScale * algGP.longColor[1] + (1 - lengthScale) * algGP.shortColor[1]);
    let b = Math.floor(lengthScale * algGP.longColor[2] + (1 - lengthScale) * algGP.shortColor[2]);
    ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
  } else if(algGP.colorByStep) {
    let stepScale = (algGP.numOfSteps % algGP.stepInterval) / algGP.stepInterval;
    stepScale = Math.abs(1 - 2 * stepScale);
    let r = Math.floor(stepScale * algGP.initialColor[0] + (1 - stepScale) * algGP.finalColor[0]);
    let g = Math.floor(stepScale * algGP.initialColor[1] + (1 - stepScale) * algGP.finalColor[1]);
    let b = Math.floor(stepScale * algGP.initialColor[2] + (1 - stepScale) * algGP.finalColor[2]);
    ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
  } else if(algGP.backtracking && algGP.colorByBranch) {
    let length = algGP.branchOfLines.length;
    let lengthScale = (length % algGP.branchInterval) / algGP.branchInterval;
    lengthScale = Math.abs(1 - 2 * lengthScale);
    let r = Math.floor(lengthScale * algGP.longBranchColor[0] + (1 - lengthScale) * algGP.shortBranchColor[0]);
    let g = Math.floor(lengthScale * algGP.longBranchColor[1] + (1 - lengthScale) * algGP.shortBranchColor[1]);
    let b = Math.floor(lengthScale * algGP.longBranchColor[2] + (1 - lengthScale) * algGP.shortBranchColor[2]);
    ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
  } else if(algGP.randomColor) {
    let r = Math.floor(256 * Math.random());
    let g = Math.floor(256 * Math.random());
    let b = Math.floor(256 * Math.random());
    ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
  }
  ctx.lineWidth = algGP.lineWidth;
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.stroke();
  if(algGP.drawEndpoints) {
    ctx.fillStyle = algGP.endpointColor;
    ctx.beginPath();
    ctx.arc(p1[0], p1[1], algGP.endpointRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p2[0], p2[1], algGP.endpointRadius, 0, 2 * Math.PI);
    ctx.fill();
  }
  if(algGP.drawCircles) {
    ctx.fillStyle = ctx.strokeStyle;
    ctx.globalAlpha = algGP.circlesAlpha;
    ctx.beginPath();
    ctx.arc(p1[0], p1[1], algGP.circlesRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p2[0], p2[1], algGP.circlesRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
  if(algGP.drawRectangles) {
    ctx.fillStyle = ctx.strokeStyle;
    ctx.globalAlpha = algGP.rectanglesAlpha;
    ctx.beginPath();
    ctx.rect(p1[0] - algGP.rectanglesWidth / 2, p1[1] - algGP.rectanglesHeight / 2, algGP.rectanglesWidth, algGP.rectanglesHeight);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(p2[0] - algGP.rectanglesWidth / 2, p2[1] - algGP.rectanglesHeight / 2, algGP.rectanglesWidth, algGP.rectanglesHeight);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
}

algGP.attemptToDraw = function () {
  // Angle
  let angle = ((algGP.angleMax - algGP.angleMin) * Math.random() + algGP.angleMin + 2 * pi) % (2 * pi);
  if(algGP.discreteAngles) {
    angle = Math.round(angle / algGP.discreteAngleOffset) * algGP.discreteAngleOffset;
  } else if(algGP.spiral) {
    angle = (algGP.currentAngle + Math.random() * (algGP.angleOffsetMax - algGP.angleOffsetMin) + algGP.angleOffsetMin + 2 * pi) % (2 * pi);
  }
  // Length
  let length = (algGP.lineMaxLength - algGP.lineMinLength) * Math.random() + algGP.lineMinLength;
  if(algGP.discreteLengths) {
    length = Math.round(length / algGP.discreteLengthOffset) * algGP.discreteLengthOffset;
  }
  // Position
  let x = algGP.currentX + length * Math.cos(angle);
  let y = algGP.currentY + length * Math.sin(angle);
  // Points
  let p1 = [algGP.currentX, algGP.currentY];
  let p2 = [x, y];
  // Check if valid
  if(algGP.checkValid(p1, p2)) {
    // console.log("Drawing Line");
    algGP.drawLine(p1, p2);
    algGP.listOfLines[algGP.listOfLines.length] = [p1, p2, angle];
    algGP.branchOfLines[algGP.branchOfLines.length] = [p1, p2, angle];
    algGP.currentX = x;
    algGP.currentY = y;
    algGP.currentAngle = angle;
    return true;
  } else {
    return false;
  }
}

algGP.drawOneStep = function () {
  if(algGP.numOfSteps > algGP.maxNumOfSteps) {
    clearInterval(algGP.loop);
    return false;
  }
  for(let i = 0; i < algGP.numOfAttempts; i++) {
    if(algGP.attemptToDraw()) {
      algGP.numOfSteps++;
      return true;
    }
  }
  if(algGP.backtracking && algGP.branchOfLines.length > 0) {
    algGP.branchOfLines.pop();
    if(algGP.branchOfLines.length == 0) {
      algGP.currentX = algGP.startX;
      algGP.currentY = algGP.startY;
      algGP.currentAngle = algGP.startAngle;
    } else {
      algGP.currentX = algGP.branchOfLines[algGP.branchOfLines.length - 1][0][0];
      algGP.currentY = algGP.branchOfLines[algGP.branchOfLines.length - 1][0][1];
      algGP.currentAngle = algGP.branchOfLines[algGP.branchOfLines.length - 1][2];
    }
    return false;
  } else {
    clearInterval(algGP.loop);
    return false;
  }
}

algGP.reset = function () {
  // Check if already running
  algGP.pause();
  // Initialize values
  algGP.numOfSteps = 0;
  algGP.currentX = algGP.startX;
  algGP.currentY = algGP.startY;
  algGP.currentAngle = algGP.startAngle;
  algGP.listOfLines = [];
  algGP.branchOfLines = [];
}

algGP.initialize = function() {
  algGP.reset();
}

algGP.pause = function () {
  if("loop" in algGP) {
    clearInterval(algGP.loop);
  }
}

algGP.start = function () {
  algGP.loop = setInterval(algGP.drawOneStep, algGP.speed);
}
