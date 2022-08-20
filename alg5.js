var alg5 = {};

alg5.distance = function (p1, p2) {
  return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]));
}

alg5.getRandomColor = function() {
  let r = Math.floor(256 * Math.random());
  let g = Math.floor(256 * Math.random());
  let b = Math.floor(256 * Math.random());
  return "rgb(" + r + "," + g + "," + b + ")";
}

alg5.drawFilledCircle = function(x, y, radius, shape_color, shape_opacity) {
    ctx.fillStyle = shape_color;
    ctx.globalAlpha = shape_opacity;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

alg5.drawTriangle = function (x, y, length, lineWidth, radians, shape_color, shape_opacity) {
  let height = length * Math.sqrt(3) / 2;
  let triangle_radius = length * Math.sqrt(3) / 3;
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = shape_color;
  ctx.globalAlpha = shape_opacity;
  ctx.beginPath();
  if(alg5.rotation) {
    console.log(alg5.rotationRads);
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
  ctx.stroke();
}

alg5.drawSquare = function (x, y, radius, length, lineWidth, shape_color, shape_opacity, radians) {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = shape_color;
  ctx.globalAlpha = shape_opacity;
  ctx.beginPath();
  if(!alg5.rotation) {
    ctx.rect(x, y, length, length);
  } else {
    let angle = (2 * Math.PI / 4);
    ctx.moveTo(x + radius * Math.cos(0 * angle + radians), y + radius * Math.sin(0 * angle + radians));
    for(i = 1; i < 4; i++) {
      ctx.lineTo(x + radius * Math.cos(i * angle + radians), y + radius * Math.sin(i * angle + radians));
    }
    ctx.lineTo(x + radius * Math.cos(0 * angle + radians), y + radius * Math.sin(0 * angle + radians));
  }
  ctx.stroke();
}

alg5.drawPentagon = function (x, y, radius, lineWidth, shape_color, shape_opacity, radians) {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = shape_color;
  ctx.globalAlpha = shape_opacity;
  ctx.beginPath();
  if(!alg5.rotation) {
    let angle = 2 * Math.PI / 5;
    ctx.moveTo(x + radius * Math.cos(0 * angle), y + radius * Math.sin(0 * angle));
    for(i = 1; i < 5; i++) {
      ctx.lineTo(x + radius * Math.cos(i * angle), y + radius * Math.sin(i * angle));
    }
    ctx.lineTo(x + radius * Math.cos(0 * angle), y + radius * Math.sin(0 * angle));
  } else {
    //rotation code goes here
    let angle = 2 * Math.PI / 5;
    ctx.moveTo(x + radius * Math.cos(-(0 * angle + radians)), y + radius * Math.sin(-(0 * angle + radians)));
    for(i = 1; i < 5; i++) {
      ctx.lineTo(x + radius * Math.cos(-(i * angle + radians)), y + radius * Math.sin(-(i * angle + radians)));
    }
    ctx.lineTo(x + radius * Math.cos(-(0 * angle + radians)), y + radius * Math.sin(-(0 * angle + radians)));
  }
  ctx.stroke();

}

alg5.drawLine = function(p1, p2, lineWidth, shape_color, shape_opacity) {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = shape_color;
  ctx.globalAlpha = shape_opacity;
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.stroke();
}

alg5.setBackgroundColor = function(color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.globalAlpha = 1;
    ctx.rect(0, 0, width, height);
    ctx.fill();
}

alg5.lineIsValid = function(p1, p2) {
  return p1[0] >= 0 && p1[1] >= 0 && p2[0] >= 0 && p2[1] >= 0 && alg5.distance(p1, p2) < alg5.spikeMaxLength;
}

/* Start at a random pixel on the canvas. Randomly choose which of the surrounding pixels to draw on next.
This is how the alg will draw the main branch of the "vines". For every pixel that the algorithm chooses to draw on,
a winding series of slowly shrinking circles will be drawn from that pixel at random angles to mimic the curly,
waviness of grapevines. */

alg5.drawNextShape = function(x, y, radians, color, opacity, numOfSides){
  if(alg5.useColorList && alg5.changingColors) {
    let colorIndex = Math.floor(Math.random() * alg5.colorList.length);
    color = alg5.colorList[colorIndex];
  } else if(alg5.useColorList && !alg5.changingColors) {
    color = alg5.initialColor;
  } else if(alg5.randomColor && alg5.changingColors) {
    color = alg5.getRandomColor();
  } else if(alg5.randomColor && !alg5.changingColors) {
    color = alg5.initialColor;
  }
  console.log(numOfSides);
  if(numOfSides == 3) {
    alg5.drawTriangle(x, y, alg5.sideLength, alg5.lineWidth, radians, color, opacity);
  } else if(numOfSides == 4) {
    alg5.drawSquare(x, y, Math.sqrt(2) * alg5.sideLength / 2, alg5.sideLength, alg5.lineWidth, color, opacity, radians);
  } else {
    //x, y, numOfSides, radius, lineWidth, shape_color, shape_opacity, offset
    alg5.drawPentagon(x, y, alg5.sideLength / (2 * Math.sin(Math.PI / 5)), alg5.lineWidth, color, opacity, radians);
  }
}

alg5.drawOneStep = function() {
    // Increment iterations
    alg5.currentIterations += 1;
    // Path and movement
    let prev_x = alg5.current_x;
    let prev_y = alg5.current_y;
    let step_x = alg5.stepX;
    let step_y = alg5.stepY;
    if(alg5.randomPath) {
      let x_index = Math.floor(Math.random() * alg5.stepChoicesX.length);
      let y_index = Math.floor(Math.random() * alg5.stepChoicesY.length);
      step_x = alg5.stepChoicesX[x_index];
      step_y = alg5.stepChoicesY[y_index];
    } else if(alg5.curvedPath) {
      let angle = 2 * Math.PI * (alg5.currentIterations % alg5.pathCycle) / alg5.pathCycle;
      let radius = alg5.pathRadius;
      if(alg5.changingRadius) {
        radius = alg5.pathRadius + Math.floor(alg5.currentIterations / alg5.radiusIncrementCycle);
      }
      if(alg5.alsoLinear) {
        step_x = radius * Math.cos(angle) + alg5.stepX;
        step_y = alg5.stepY;
      } else {
        step_x = radius * Math.cos(angle);
        step_y = radius * Math.sin(angle);
      }
    }
    if(alg5.noisyPath) {
      step_x += Math.floor(Math.random() * alg5.noiseX);
      step_y += Math.floor(Math.random() * alg5.noiseY);
    }
    alg5.current_x = (alg5.current_x + step_x + width) % width;
    alg5.current_y = (alg5.current_y + step_y + height) % height;
    // Drawing variation
    alg5.currentOpacity = - 0.9 * Math.sin(0.004 * Math.PI * (alg5.currentIterations % 250)) + 1;
    alg5.currentRadius = alg5.circleRadius * Math.sin(0.01 * Math.PI * (alg5.currentIterations % 100)) + 2;
    alg5.sideNum = Math.round(2 * Math.sin(0.01 * Math.PI * (alg5.currentIterations % 100)) + 3);
    alg5.rotationDegs = 180 * Math.sin(0.01 * Math.PI * (alg5.currentIterations % 100));
    alg5.rotationRads = alg5.rotationDegs * (Math.PI / 180);
    // Select color
    let color = alg5.defaultColor;
    if(alg5.useColorList && alg5.changingColors) {
      let colorIndex = Math.floor(Math.random() * alg5.colorList.length);
      color = alg5.colorList[colorIndex];
    } else if(alg5.useColorList && !alg5.changingColors) {
      color = alg5.initialColor;
    } else if(alg5.randomColor && alg5.changingColors) {
      color = alg5.getRandomColor();
    } else if(alg5.randomColor && !alg5.changingColors) {
      color = alg5.initialColor;
    }
    // Draw shape or texture
    if(alg5.drawCircles) {
        let radius = alg5.circleRadius;
        let opacity = alg5.circleOpacity;
        if(alg5.pressureVariation && alg5.circleRandomness) {
          let pressure = alg5.penPressureMin + (1.0 - alg5.penPressureMin) * Math.random();
          radius = Math.floor(pressure * alg5.circleRadius);
          opacity = alg5.currentOpacity;
        } else if(alg5.pressureVariation && !alg5.circleRandomness){
          radius = alg5.currentRadius;
          opacity = alg5.currentOpacity;
        }
        alg5.drawFilledCircle(alg5.current_x, alg5.current_y, radius, color, opacity);
    } else if(alg5.drawShapes && !alg5.rotation) {
      // x, y, length, lineWidth, radians, shape_color, shape_opacity
      alg5.drawNextShape(alg5.current_x, alg5.current_y, 0, color, alg5.currentOpacity, alg5.sideNum, 0);

    } else if(alg5.drawShapes && alg5.rotation) {
      console.log(alg5.rotationDegs);
      alg5.drawNextShape(alg5.current_x, alg5.current_y, alg5.rotationRads, color, alg5.currentOpacity, alg5.sideNum);

    } else {
      for(let i = 0; i < alg5.numOfSpikes; i++) {
        let x_offset = Math.floor(alg5.spikeOffsetRangeX * Math.random()) - Math.floor(alg5.spikeOffsetRangeX / 2);
        let y_offset = Math.floor(alg5.spikeOffsetRangeY * Math.random()) - Math.floor(alg5.spikeOffsetRangeY / 2);
        let p1 = [prev_x, prev_y];
        let p2 = [alg5.current_x + x_offset, alg5.current_y + y_offset];
        if(alg5.lineIsValid(p1, p2)) {
          alg5.drawLine(p1, p2, alg5.spikeLineWidth, color, alg5.spikeAlpha);
        }
      }
    }
}

alg5.reset = function () {
    alg5.pause();
    alg5.currentIterations = 0;
    alg5.current_x = Math.floor(Math.random() * width);
    alg5.current_y = Math.floor(Math.random() * height);
    if(!alg5.changingColors && alg5.randomColor) {
      alg5.initialColor = alg5.getRandomColor();
    } else if(!alg5.changingColors && alg5.useColorList) {
      let colorIndex = Math.floor(Math.random() * alg5.colorList.length);
      circle_color = alg5.colorList[colorIndex];
      alg5.initialColor = circle_color;
    }

    alg5.isBackgroundSet = false;
}

alg5.initialize = function() {
    alg5.reset();
}

alg5.pause = function () {
    if("loop" in alg5) {
        clearInterval(alg5.loop);
    }
}

alg5.start = function () {
    if(!alg5.isBackgroundSet) {
        alg5.backgroundChoice = Math.floor(Math.random() * alg5.backgroundColors.length);
        alg5.backgroundColor = alg5.backgroundColors[alg5.backgroundChoice];
        alg5.setBackgroundColor(alg5.backgroundColor);
        alg5.isBackgroundSet = true;
    }
    alg5.loop = setInterval(alg5.drawOneStep, alg5.speed);
}
