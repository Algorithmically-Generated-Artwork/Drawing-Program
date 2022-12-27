var algVines = {};

algVines.distance = function (p1, p2) {
  return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]));
}

algVines.getRandomColor = function() {
  let r = Math.floor(256 * Math.random());
  let g = Math.floor(256 * Math.random());
  let b = Math.floor(256 * Math.random());
  return "rgb(" + r + "," + g + "," + b + ")";
}

algVines.drawFilledCircle = function(x, y, radius, shape_color, shape_opacity) {
    ctx.fillStyle = shape_color;
    ctx.globalAlpha = shape_opacity;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

algVines.drawTriangle = function (x, y, length, lineWidth, radians, shape_color, shape_opacity) {
  let height = length * Math.sqrt(3) / 2;
  let triangle_radius = length * Math.sqrt(3) / 3;
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = shape_color;
  ctx.globalAlpha = shape_opacity;
  ctx.beginPath();
  if(algVines.rotation) {
    // console.log(algVines.rotationRads);
    let moveto_x = x + triangle_radius * Math.cos(-radians);
    let moveto_y = y + triangle_radius * Math.sin(-radians);
    let lineto1_x = x + triangle_radius * Math.cos(-(radians + 2 * Math.PI / 3));
    let lineto1_y = y + triangle_radius * Math.sin(-(radians + 2 * Math.PI / 3));
    let lineto2_x = x + triangle_radius * Math.cos(-(radians + 4 * Math.PI / 3));
    let lineto2_y = y + triangle_radius * Math.sin(-(radians + 4 * Math.PI / 3));
    ctx.moveTo(moveto_x, moveto_y);
    ctx.lineTo(lineto1_x, lineto1_y);
    ctx.lineTo(lineto2_x, lineto2_y);
    ctx.lineTo(moveto_x, moveto_y);
  } else {
    ctx.moveTo(x, y - height / 2);
    ctx.lineTo(x - length / 2, y + height / 2);
    ctx.lineTo(x + length / 2, y + height / 2);
    ctx.lineTo(x, y - height / 2);
  }
  ctx.closePath();
  ctx.stroke();
}

algVines.drawSquare = function (x, y, radius, length, lineWidth, shape_color, shape_opacity, radians) {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = shape_color;
  ctx.globalAlpha = shape_opacity;
  ctx.beginPath();
  if(!algVines.rotation) {
    ctx.rect(x, y, length, length);
  } else {
    let angle = (2 * Math.PI / 4);
    ctx.moveTo(x + radius * Math.cos(0 * angle + radians), y + radius * Math.sin(0 * angle + radians));
    for(i = 1; i < 4; i++) {
      ctx.lineTo(x + radius * Math.cos(i * angle + radians), y + radius * Math.sin(i * angle + radians));
    }
    ctx.lineTo(x + radius * Math.cos(0 * angle + radians), y + radius * Math.sin(0 * angle + radians));
  }
  ctx.closePath();
  ctx.stroke();
}

algVines.drawPentagon = function (x, y, radius, lineWidth, shape_color, shape_opacity, radians) {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = shape_color;
  ctx.globalAlpha = shape_opacity;
  ctx.beginPath();
  if(!algVines.rotation) {
    let angle = 2 * Math.PI / 5;
    ctx.moveTo(x + radius * Math.cos(0 * angle), y + radius * Math.sin(0 * angle));
    for(i = 1; i < 5; i++) {
      ctx.lineTo(x + radius * Math.cos(i * angle), y + radius * Math.sin(i * angle));
    }
    ctx.lineTo(x + radius * Math.cos(0 * angle), y + radius * Math.sin(0 * angle));
  } else {
    // Rotation code goes here
    let angle = 2 * Math.PI / 5;
    ctx.moveTo(x + radius * Math.cos(-(0 * angle + radians)), y + radius * Math.sin(-(0 * angle + radians)));
    for(i = 1; i < 5; i++) {
      ctx.lineTo(x + radius * Math.cos(-(i * angle + radians)), y + radius * Math.sin(-(i * angle + radians)));
    }
    ctx.lineTo(x + radius * Math.cos(-(0 * angle + radians)), y + radius * Math.sin(-(0 * angle + radians)));
  }
  ctx.closePath();
  ctx.stroke();
}

algVines.drawLine = function(p1, p2, lineWidth, shape_color, shape_opacity) {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = shape_color;
  ctx.globalAlpha = shape_opacity;
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.stroke();
}

algVines.setBackgroundColor = function(color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.globalAlpha = 1;
    ctx.rect(0, 0, width, height);
    ctx.fill();
}

algVines.lineIsValid = function(p1, p2) {
  return p1[0] >= 0 && p1[1] >= 0 && p2[0] >= 0 && p2[1] >= 0 && algVines.distance(p1, p2) < algVines.spikeMaxLength;
}

/* Start at a random pixel on the canvas. Randomly choose which of the surrounding pixels to draw on next.
This is how the alg will draw the main branch of the "vines". For every pixel that the algorithm chooses to draw on,
a winding series of slowly shrinking circles will be drawn from that pixel at random angles to mimic the curly,
waviness of grapevines. */

algVines.drawNextShape = function(x, y, radians, color, opacity, numOfSides){
  if(algVines.useColorList && algVines.changingColors) {
    let colorIndex = Math.floor(Math.random() * algVines.colorList.length);
    color = algVines.colorList[colorIndex];
  } else if(algVines.useColorList && !algVines.changingColors) {
    color = algVines.initialColor;
  } else if(algVines.randomColor && algVines.changingColors) {
    color = algVines.getRandomColor();
  } else if(algVines.randomColor && !algVines.changingColors) {
    color = algVines.initialColor;
  }
  // console.log(numOfSides);
  if(numOfSides == 3) {
    algVines.drawTriangle(x, y, algVines.sideLength, algVines.lineWidth, radians, color, opacity);
  } else if(numOfSides == 4) {
    algVines.drawSquare(x, y, Math.sqrt(2) * algVines.sideLength / 2, algVines.sideLength, algVines.lineWidth, color, opacity, radians);
  } else {
    // x, y, numOfSides, radius, lineWidth, shape_color, shape_opacity, radians
    algVines.drawPentagon(x, y, algVines.sideLength / (2 * Math.sin(Math.PI / 5)), algVines.lineWidth, color, opacity, radians);
  }
}

algVines.drawOneStep = function() {
    // Reached the end
    if(algVines.numOfSteps > algVines.maxNumOfSteps) {
      clearInterval(algVines.loop);
      return false;
    }

    // Increment iterations
    algVines.currentIterations += 1;
    // Path and movement
    let prev_x = algVines.current_x;
    let prev_y = algVines.current_y;
    let step_x = algVines.stepX;
    let step_y = algVines.stepY;
    if(algVines.randomPath) {
      let x_index = Math.floor(Math.random() * algVines.stepChoicesX.length);
      let y_index = Math.floor(Math.random() * algVines.stepChoicesY.length);
      step_x = algVines.stepChoicesX[x_index];
      step_y = algVines.stepChoicesY[y_index];
    } else if(algVines.curvedPath) {
      let angle = 2 * Math.PI * (algVines.currentIterations % algVines.pathCycle) / algVines.pathCycle;
      let radius = algVines.pathRadius;
      if(algVines.changingRadius) {
        radius = algVines.pathRadius + Math.floor(algVines.currentIterations / algVines.radiusIncrementCycle);
      }
      if(algVines.alsoLinear) {
        step_x = radius * Math.cos(angle) + algVines.stepX;
        step_y = algVines.stepY;
      } else {
        step_x = radius * Math.cos(angle);
        step_y = radius * Math.sin(angle);
      }
    }
    if(algVines.noisyPath) {
      step_x += Math.floor(Math.random() * algVines.noiseX);
      step_y += Math.floor(Math.random() * algVines.noiseY);
    }
    algVines.current_x = (algVines.current_x + step_x + width) % width;
    algVines.current_y = (algVines.current_y + step_y + height) % height;
    // Drawing variation
    algVines.currentOpacity = - 0.9 * Math.sin(0.004 * Math.PI * (algVines.currentIterations % 250)) + 1;
    algVines.currentRadius = algVines.circleRadius * Math.sin(0.01 * Math.PI * (algVines.currentIterations % 100)) + 2;
    algVines.sideNum = Math.round(2 * Math.sin(0.01 * Math.PI * (algVines.currentIterations % 100)) + 3);
    algVines.rotationDegs = 180 * Math.sin(0.01 * Math.PI * (algVines.currentIterations % 100));
    algVines.rotationRads = algVines.rotationDegs * (Math.PI / 180);
    // Select color
    let color = algVines.defaultColor;
    if(algVines.useColorList && algVines.changingColors) {
      let colorIndex = Math.floor(Math.random() * algVines.colorList.length);
      color = algVines.colorList[colorIndex];
    } else if(algVines.useColorList && !algVines.changingColors) {
      color = algVines.initialColor;
    } else if(algVines.randomColor && algVines.changingColors) {
      color = algVines.getRandomColor();
    } else if(algVines.randomColor && !algVines.changingColors) {
      color = algVines.initialColor;
    }
    // Draw shape or texture
    if(algVines.drawCircles) {
        let radius = algVines.circleRadius;
        let opacity = algVines.circleOpacity;
        if(algVines.pressureVariation && algVines.circleRandomness) {
          let pressure = algVines.penPressureMin + (1.0 - algVines.penPressureMin) * Math.random();
          radius = Math.floor(pressure * algVines.circleRadius);
          opacity = algVines.currentOpacity;
        } else if(algVines.pressureVariation && !algVines.circleRandomness){
          radius = algVines.currentRadius;
          opacity = algVines.currentOpacity;
        }
        algVines.drawFilledCircle(algVines.current_x, algVines.current_y, radius, color, opacity);
    } else if(algVines.drawShapes && !algVines.rotation) {
      // x, y, radians, color, opacity, numOfSides
      algVines.drawNextShape(algVines.current_x, algVines.current_y, 0, color, algVines.currentOpacity, algVines.sideNum);
    } else if(algVines.drawShapes && algVines.rotation) {
      // console.log(algVines.rotationDegs);
      algVines.drawNextShape(algVines.current_x, algVines.current_y, algVines.rotationRads, color, algVines.currentOpacity, algVines.sideNum);
    } else {
      for(let i = 0; i < algVines.numOfSpikes; i++) {
        let x_offset = Math.floor(algVines.spikeOffsetRangeX * Math.random()) - Math.floor(algVines.spikeOffsetRangeX / 2);
        let y_offset = Math.floor(algVines.spikeOffsetRangeY * Math.random()) - Math.floor(algVines.spikeOffsetRangeY / 2);
        let p1 = [prev_x, prev_y];
        let p2 = [algVines.current_x + x_offset, algVines.current_y + y_offset];
        if(algVines.lineIsValid(p1, p2)) {
          algVines.drawLine(p1, p2, algVines.spikeLineWidth, color, algVines.spikeAlpha);
        }
      }
    }

    algVines.numOfSteps++;
    return true;
}

algVines.reset = function () {
    algVines.pause();
    algVines.currentIterations = 0;
    algVines.current_x = Math.floor(Math.random() * width);
    algVines.current_y = Math.floor(Math.random() * height);
    if(!algVines.changingColors) {
      algVines.initialColor = algVines.getRandomColor();
    }
    algVines.numOfSteps = 0;
}

algVines.initialize = function() {
    algVines.reset();
}

algVines.pause = function () {
    if("loop" in algVines) {
        clearInterval(algVines.loop);
    }
}

algVines.start = function () {
    if(algVines.isBackgroundSet) {
        algVines.setBackgroundColor(algVines.backgroundColor);
    } else {
        algVines.backgroundChoice = Math.floor(Math.random() * algVines.backgroundColors.length);
        algVines.backgroundColor = algVines.backgroundColors[algVines.backgroundChoice];
        algVines.setBackgroundColor(algVines.backgroundColor);
    }
    algVines.loop = setInterval(algVines.drawOneStep, algVines.speed);
}
