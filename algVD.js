var algVD = {};
const shapes = ["circle", "square", "rectangle", "circle-fitted", "10PRINT", "diagonal"]
const shapeModes = ["circle", "square", "rectangle", "circle-fitted", "10PRINT", "diagonal", "random", "randomEachSite", "random-unfitted", "random-fitted", "sqcircs"] // used for randomize()
const expandingSiteModes = ["euclidean", "manhattan", "polarEuclidean", "polarManhattan", "polarHyperbolic", "wave", "minDiff", "absDiff", "approachingSite", "randomized", "sequential", "diffProd", "euclihattan", "chaos", "odd", "chaos2", "polarWave"] // used to initialize placement modes assigned to each site
const placementModes = ["random", "random-norepeat", "expandingRadius", "shrinkingRadius", "randomWalk", "expandingSite", "sequential", "square", "triangle", "expanding-square"]
const distances = ["euclidean", "manhattan", "hyperbolic", "wave", "minDiff", "absDiff", "diffProd", "euclihattan", "odd", "chaos", "chaos2", "polarWave", "polarEuclidean", "polarManhattan", "polarHyperbolic"]
const fillModes = ["yes", "no", "random", "randomEachSite"];
const alphaModes = ["random", "closer", "farther", "fixed", "index", "reverse-index", "site-index", "reverse-site-index"]
const gradientModes = ["center-out", "index", "top-bottom", "left-right", "diagonal"]
const sitePlacementModes = ["random", "circle", "spiral", "triangle", "diamond", "parabola", "trbl-diagonal", "tlbr-diagonal", "modulus", "grid", "mapToCanvas"]

algVD.setBackgroundColor = function(color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.globalAlpha = 1;
  ctx.rect(0, 0, width, height);
  ctx.fill();
  ctx.closePath();
}

algVD.randomColor = function() {
  let hex = ["#"];
  for (let i = 0; i < 6; i++) {
    hex.push(Math.floor(Math.random()*16).toString(16));
  }
  return hex.join("");
}

algVD.hexToRGB = function(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

algVD.randColor = function() {
  return [Math.floor(256 * Math.random()), Math.floor(256 * Math.random()), Math.floor(256 * Math.random())];
}

algVD.weightedColorAvg = function(weight, colorOne, colorTwo) {
  let r1 = colorOne[0];
  let g1 = colorOne[1];
  let b1 = colorOne[2];
  let r2 = colorTwo[0];
  let g2 = colorTwo[1];
  let b2 = colorTwo[2];
  let r = weight * r1 + (1 - weight) * r2;
  let g = weight * g1 + (1 - weight) * g2;
  let b = weight * b1 + (1 - weight) * b2;
  return [Math.floor(r), Math.floor(g), Math.floor(b)];
}

algVD.getColorWeight = function (p1) {
  if (algVD.gradientMode === "center-out") {
    let p2 = {x: Math.floor(width/2), y: Math.floor(height/2)}
    let ret = algVD.distance(p1,p2,"euclidean") / algVD.distance({x: 0, y: 0},p2, "euclidean")
    return ret
  } else if (algVD.gradientMode === "index") {
    return p1.i / (algVD.numSites-1)
  } else if (algVD.gradientMode === "top-bottom") {
    return p1.y / height
  } else if (algVD.gradientMode === "left-right") {
    return p1.x / width
  } else if (algVD.gradientMode === "diagonal") {
    return Math.max(p1.x / width, p1.y / height)
  }
}

algVD.drawShape = function(shape, x, y, radius, color, alpha, fill) {
  let temp1 = width / algVD.cols;
  let temp2 = height / algVD.rows;
  if(algVD.lessTransparency) {
    ctx.globalAlpha = 0.5 + alpha / 2;
  } else {
    ctx.globalAlpha = alpha;
  }
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.beginPath();
  if (shape == "square") {
    ctx.rect(x-radius/2,y-radius/2,radius,radius)
  } else if (shape == "rectangle") {
    ctx.rect(x-temp1/2,y-temp2/2,temp1,temp2)
  } else if (shape == "circle-fitted") {
    ctx.arc(x, y, Math.min(temp1/2,temp2/2), 0, 2 * Math.PI);
  } else if (shape === "diagonal" || shape === "10PRINT") {
    let bool = Math.floor(Math.random()*2)
    if (bool && shape === "10PRINT") {
      ctx.moveTo(x-temp1/2,y+temp2/2)
      ctx.lineTo(x+temp1/2,y-temp2/2)
    } else {
      ctx.moveTo(x-temp1/2,y-temp2/2)
      ctx.lineTo(x+temp1/2,y+temp2/2)
    }
  } else {
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
  }
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  ctx.stroke()
}

algVD.getFill = function(site) {
  if (algVD.fill == "yes") {
    return true;
  } else if (algVD.fill == "no") {
    return false;
  } else if (algVD.fill == "random") {
    return Math.floor(Math.random() * 2);
  } else if (algVD.fill == "randomEachSite") {
    return site.fill;
  }
}

algVD.getShape = function(site) {
  if (algVD.shape === "random") {
    let choice = Math.floor(Math.random() * shapes.length);
    return shapes[choice];
  } else if (algVD.shape === "randomEachSite") {
    return site.shape;
  } else if (algVD.shape === "random-unfitted") {
    let choice = Math.floor(Math.random() * 2);
    return shapes[choice];
  } else if (algVD.shape === "random-fitted") {
    let choice = Math.floor(Math.random() * 2) + 2;
    return shapes[choice];
  } else if (algVD.shape === "sqcircs") {
    let choice = Math.floor(Math.random() * 4);
    return shapes[choice];
  } else {
    return algVD.shape;
  }
 }

algVD.distance = function(p1,p2, space) {
  if (space === "manhattan") {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
  } else if (space === "hyperbolic") {
    const modulus1 = Math.sqrt(p1.x * p1.x + p1.y * p1.y);
    const modulus2 = Math.sqrt(p2.x * p2.x + p2.y * p2.y);
    const diffX = p1.x - p2.x;
    const diffY = p1.y - p2.y;
    const distance = Math.acosh(1 + (2 * (diffX * diffX + diffY * diffY)) / ((1 - modulus1 * modulus1) * (1 - modulus2 * modulus2)));
    return distance;
  } else if (space === "euclihattan") {
    return Math.abs(Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y) + Math.sqrt(Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2)))
  } else if (space === "polarEuclidean") {
    p1x = Math.cos(p1.x)
    p2x = Math.cos(p2.x)
    p1y = Math.sin(p1.y)
    p2y = Math.sin(p2.y)

    return Math.sqrt(Math.pow(p1x - p2x,2) + Math.pow(p1y - p2y,2));
  } else if (space === "polarManhattan") {
    p1x = Math.cos(p1.x)
    p2x = Math.cos(p2.x)
    p1y = Math.sin(p1.y)
    p2y = Math.sin(p2.y)

    return Math.abs(p1x - p2x) + Math.abs(p1y - p2y);
  } else if (space === "polarHyperbolic") {
    p1x = Math.cos(p1.x)
    p2x = Math.cos(p2.x)
    p1y = Math.sin(p1.y)
    p2y = Math.sin(p2.y)

    const modulus1 = Math.sqrt(p1x * p1x + p1y * p1y);
    const modulus2 = Math.sqrt(p2x * p2x + p2y * p2y);
    const diffX = p1x - p2x;
    const diffY = p1y - p2y;
    const distance = Math.acosh(1 + (2 * (diffX * diffX + diffY * diffY)) / ((1 - modulus1 * modulus1) * (1 - modulus2 * modulus2)));
    return distance;
  } else if (space === "wave" || space === "polarWave") {

    p1x = (p1.x)
    p2x = (p2.x)
    p1y = (p1.y)
    p2y = (p2.y)
    if (space === "polarWave") {
      p1x = Math.cos(p1.x)
      p2x = Math.cos(p2.x)
      p1y = Math.sin(p1.y)
      p2y = Math.sin(p2.y)
    }
    return Math.abs(Math.sqrt(Math.abs(p1x - p2x))*((p1x - p2x)/300) - Math.sqrt(Math.abs(p1y - p2y))*((p1y - p2y)/300))
  } else if (space === "minDiff") {
    let diffX = Math.abs(p1.x - p2.x)
    let diffY = Math.abs(p1.y - p2.y)

    return Math.min(Math.abs(diffX), Math.abs(diffY))
  } else if (space === "absDiff") {
    let diffX = Math.abs(p1.x - p2.x)
    let diffY = Math.abs(p1.y - p2.y)

    return Math.abs(Math.abs(diffX) - Math.abs(diffY))
  } else if (space === "diffProd") {
    let diffX = Math.abs(p1.x - p2.x)
    let diffY = Math.abs(p1.y - p2.y)

    return diffX * diffY
  } else if (space === "chaos") {
    return Math.abs(Math.sqrt(Math.abs(p1.x - p2.x))*(p1.x + p2.x)/1200 - Math.sqrt(Math.abs(p1.y - p2.y))*(p1.y + p2.y)/1200)
  } else if (space === "odd") {
    return Math.abs(p1.y - p2.y) + 16*Math.sqrt(Math.abs(p1.x - p2.x))
  } else if (space === "chaos2") {
    return Math.abs(Math.abs(p1.y - p2.y) - 16*Math.sqrt(Math.abs(p1.x - p2.x)))
  }
  return Math.sqrt(Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2));
}

algVD.mapValue = function (value, range1, range2) {
  return range2[0] + (((value-range1[0])*(range2[1]-range2[0]))/(range1[1]-range1[0]))
}

algVD.calculateAlpha = function (point, site) {
  let space = algVD.alphaSpace
  let distance = algVD.distance(point, site, space)
  if (algVD.varyAlphaMode === "random") {
    return Math.random()
  } else if (algVD.varyAlphaMode === "closer") {
    let maxDistPoint = site;
    let maxPossibleDist = 0;
    for (let i = 0; i < algVD.rows; i++) {
      for (let j = 0; j < algVD.cols; j++) {
        let tempPoint = {x: j, y: i}
        let tempDist = algVD.distance(maxDistPoint, tempPoint)
        if (tempDist > maxPossibleDist) {
          maxPossibleDist = tempDist
          maxDistPoint = tempPoint
        }
      }
    }
    let stdDistance = Math.max(1 - distance / maxPossibleDist - 0.2, 0.2)
    return stdDistance;
  } else if (algVD.varyAlphaMode === "farther") {
    let maxDistPoint = site;
    let maxPossibleDist = 0;
    for (let i = 0; i < algVD.rows; i++) {
      for (let j = 0; j < algVD.cols; j++) {
        let tempPoint = {x: j, y: i}
        let tempDist = algVD.distance(maxDistPoint, tempPoint)
        if (tempDist > maxPossibleDist) {
          maxPossibleDist = tempDist
          maxDistPoint = tempPoint
        }
      }
    }
    let stdDistance = distance / maxPossibleDist
    return stdDistance;
  } else if (algVD.varyAlphaMode === "index") {
    return algVD.numOfStepsTemp / (algVD.rows * algVD.cols)
  } else if (algVD.varyAlphaMode === "reverse-index") {
    return 1 - algVD.numOfStepsTemp / (algVD.rows * algVD.cols)
  } else if (algVD.varyAlphaMode === "site-index") {
    let siteIndex = algVD.sites.findIndex(item => item.x == site.x && item.y == site.y)
    return (siteIndex+1) / algVD.sites.length
  } else if (algVD.varyAlphaMode === "reverse-site-index") {
    let siteIndex = algVD.sites.findIndex(item => item.x == site.x && item.y == site.y)
    return 1 - (siteIndex+1) / algVD.sites.length
  } else {
    return algVD.alphaMultiplier
  }
}

algVD.setCoords = function () {
  let x;
  let y;
  if (algVD.placementMode === "random") {
    x = Math.floor(Math.random() * (algVD.cols+1))
    y = Math.floor(Math.random() * (algVD.rows+1))
    x = algVD.mapValue(x,[0,algVD.cols-1],[0,width])
    y = algVD.mapValue(y,[0,algVD.rows-1],[0,height])
  } else if (algVD.placementMode === "random-norepeat" && algVD.rowColGraph.length > 0) {
    let index = Math.floor(Math.random() * (algVD.rowColGraph.length))
    x = algVD.rowColGraph[index].x
    y = algVD.rowColGraph[index].y
    algVD.rowColGraph.splice(index, 1)
    x = algVD.mapValue(x,[0,algVD.cols-1],[0,width])
    y = algVD.mapValue(y,[0,algVD.rows-1],[0,height])
  } else if (algVD.placementMode === "expandingRadius" && algVD.rowColGraph.length > 0) {
    let index = 1;
    let minDistIndex = 0
    let space = algVD.expandShrinkDist

    for (index; index < algVD.rowColGraph.length; index++) {
      let dist = algVD.distance(algVD.rowColGraph[index], algVD.ESRfocus, space)
      if (dist < algVD.distance(algVD.rowColGraph[minDistIndex], algVD.ESRfocus, space)) {
        minDistIndex = index
      }
    }
    x = algVD.rowColGraph[minDistIndex].x
    y = algVD.rowColGraph[minDistIndex].y
    algVD.rowColGraph.splice(minDistIndex, 1)
    x = algVD.mapValue(x,[0,algVD.cols-1],[0,width])
    y = algVD.mapValue(y,[0,algVD.rows-1],[0,height])
  } else if (algVD.placementMode === "shrinkingRadius" && algVD.rowColGraph.length > 0) {
    let index = 1;
    let maxDistIndex = 0
    let space = algVD.expandShrinkDist
    for (index; index < algVD.rowColGraph.length; index++) {
      let dist = algVD.distance(algVD.rowColGraph[index], algVD.ESRfocus, space)
      if (dist > algVD.distance(algVD.rowColGraph[maxDistIndex], algVD.ESRfocus, space)) {
        maxDistIndex = index
      }
    }
    x = algVD.rowColGraph[maxDistIndex].x
    y = algVD.rowColGraph[maxDistIndex].y
    algVD.rowColGraph.splice(maxDistIndex, 1)
    x = algVD.mapValue(x,[0,algVD.cols-1],[0,width])
    y = algVD.mapValue(y,[0,algVD.rows-1],[0,height])
  } else if (algVD.placementMode === "randomWalk" && algVD.rowColGraph.length > 0) {
    let index = algVD.rowColGraph.length-1;
    let minDistIndex = algVD.rowColGraph.length-1
    for (index; index >= 0; index--) {
      let dist = algVD.distance(algVD.rowColGraph[index], algVD.randomWalkCoords, "euclidean")
      if (dist < algVD.distance(algVD.rowColGraph[minDistIndex], algVD.randomWalkCoords, "euclidean")) {
        minDistIndex = index
      } else if (dist === algVD.distance(algVD.rowColGraph[minDistIndex], algVD.randomWalkCoords, "euclidean")) {
        if (Math.floor(Math.random() * 2)) {
          minDistIndex = index
        }
      }
    }
    x = algVD.rowColGraph[minDistIndex].x
    y = algVD.rowColGraph[minDistIndex].y
    algVD.rowColGraph.splice(minDistIndex, 1)
    algVD.randomWalkCoords.x = x
    algVD.randomWalkCoords.y = y
    x = algVD.mapValue(x,[0,algVD.cols-1],[0,width])
    y = algVD.mapValue(y,[0,algVD.rows-1],[0,height])

  } else if (algVD.placementMode === "expandingSite" && algVD.rowColGraph.length > 0) {
    for (let i = 0; i < algVD.sites.length; i++) {

      let currentSiteIndex = ((algVD.expandingSitePerSite ? 0 : algVD.numOfStepsTemp)+i) % algVD.sites.length
      let currentSite = algVD.sites[currentSiteIndex]
      let siteX = algVD.mapValue(currentSite.x, [0,width], [0,algVD.cols])
      let siteY = algVD.mapValue(currentSite.y, [0,height], [0,algVD.rows])
      let newSiteCoords = {x: siteX, y: siteY}

      const points = algVD.rowColGraph.filter(point => point.siteIndex === currentSiteIndex)

      if (points.length > 0) {
        let closestPoint = points[0]

        for (let j = 0; j < points.length; j++) {
          let placementWithinSiteMode = algVD.expandingSiteDistance==="random" ? currentSite.mode : algVD.expandingSiteDistance
          let minDist = algVD.distance(closestPoint, newSiteCoords, placementWithinSiteMode)
          let currDist = algVD.distance(points[j], newSiteCoords, placementWithinSiteMode)

          let check1 = closestPoint.y > points[j].y
          let check3 = closestPoint.y <= points[j].y
          let check2 = closestPoint.x >= points[j].x
          let check4 = closestPoint.x < points[j].x
          if (placementWithinSiteMode==="approachingSite"&&(algVD.numOfStepsTemp % 4 == 0 ? check1 : algVD.numOfStepsTemp % 4 == 1 ? check2 : algVD.numOfStepsTemp % 4 == 2 ? check3 : check4)) {
            closestPoint = points[j]
          } else if (placementWithinSiteMode === "randomized") {
            closestPoint = points[Math.floor(Math.random()*points.length)]
          } else if (placementWithinSiteMode === "sequential" && check1) {
            closestPoint = points[j]
          } else if (placementWithinSiteMode!=="approachingSite" && placementWithinSiteMode !=="sequential") {
            if (!algVD.expandingSiteReverse && currDist <= minDist) {
              closestPoint = points[j]
            } else if (algVD.expandingSiteReverse && currDist >= minDist) {
              closestPoint = points[j]
            }
          }

        }
        x = closestPoint.x
        y = closestPoint.y
        let index = algVD.rowColGraph.findIndex(point => point.x === x && point.y === y)
        algVD.rowColGraph.splice(index, 1)
        x = algVD.mapValue(x,[0,algVD.cols-1],[0,width])
        y = algVD.mapValue(y,[0,algVD.rows-1],[0,height])

        algVD.drawShape(algVD.getShape(currentSite), x, y, currentSite.radius, currentSite.color, algVD.calculateAlpha({x: x, y: y}, currentSite), algVD.getFill(currentSite))

        return;
      }
    }
  } else if (algVD.placementMode === "movingSites" && algVD.numOfStepsTemp < algVD.rowColGraph.length) {
    let index = algVD.numOfStepsTemp
    x = algVD.rowColGraph[index].x
    y = algVD.rowColGraph[index].y
    x = algVD.mapValue(x,[0,algVD.cols-1],[0,width])
    y = algVD.mapValue(y,[0,algVD.rows-1],[0,height])
  } else if (algVD.placementMode === "sequential" && algVD.rowColGraph.length > 0) {

    let index = 0
    x = algVD.rowColGraph[index].x
    y = algVD.rowColGraph[index].y
    algVD.rowColGraph.splice(index, 1)
    x = algVD.mapValue(x,[0,algVD.cols-1],[0,width])
    y = algVD.mapValue(y,[0,algVD.rows-1],[0,height])
  } else if (algVD.placementMode === "square" && algVD.rowColGraph.length > 0) {
    let j
    const points = algVD.rowColGraph
    if (points.length > 0) {
      let closestPoint = points[0]
      for (j = 0; j < points.length; j++) {
        let check1 = closestPoint.y > points[j].y
        let check3 = closestPoint.y <= points[j].y
        let check2 = closestPoint.x >= points[j].x
        let check4 = closestPoint.x < points[j].x
        if ((algVD.numOfStepsTemp % 4 == 0 ? check1 : algVD.numOfStepsTemp % 4 == 1 ? check2 : algVD.numOfStepsTemp % 4 == 2 ? check3 : check4)) {
          closestPoint = points[j]
        }
      }
      x = closestPoint.x
      y = closestPoint.y
      let index = algVD.rowColGraph.findIndex(item => item.x === x && item.y === y)
      algVD.rowColGraph.splice(index, 1)
      x = algVD.mapValue(x,[0,algVD.cols-1],[0,width])
      y = algVD.mapValue(y,[0,algVD.rows-1],[0,height])
    }
  } else if (algVD.placementMode === "triangle" && algVD.rowColGraph.length > 0) {
    const points = algVD.rowColGraph;
    let resultPoint = points[0]
    for (let j = 1; j < points.length; j++) {
      if (!(points[j].x > resultPoint.y)) {
        resultPoint = points[j]
      }
    }
    x = resultPoint.x
    y = resultPoint.y
    let index = algVD.rowColGraph.findIndex(item => item.x === x && item.y === y)
    algVD.rowColGraph.splice(index, 1)
    x = algVD.mapValue(x,[0,algVD.cols-1],[0,width])
    y = algVD.mapValue(y,[0,algVD.rows-1],[0,height])
  } else if (algVD.placementMode === "expanding-square" && algVD.rowColGraph.length > 0) {
    const points = algVD.rowColGraph;
    let resultPoint = points[0]
    for (let j = 1; j < points.length; j++) {
      if ((points[j].x > resultPoint.y)) {
        resultPoint = points[j]
      }
    }
    x = resultPoint.x
    y = resultPoint.y
    let index = algVD.rowColGraph.findIndex(item => item.x === x && item.y === y)
    algVD.rowColGraph.splice(index, 1)
    x = algVD.mapValue(x,[0,algVD.cols-1],[0,width])
    y = algVD.mapValue(y,[0,algVD.rows-1],[0,height])
  }

  algVD.x = x
  algVD.y = y
}

algVD.drawOneStep = function () {
  if(algVD.numOfSteps > algVD.maxNumOfSteps) {
    clearInterval(algVD.loop);
    return false;
  } else {
    if (algVD.placementMode === "movingSites") {
      for (let q = 0; q < algVD.rows * algVD.cols; q++) {
        algVD.setCoords()

        let x = algVD.x;
        let y = algVD.y;

        let closest = algVD.sites[0];
        let minDist = algVD.distance({x: x, y: y}, algVD.sites[0], algVD.distanceSpace)
        for (let i = 1; i < algVD.sites.length; i++) {
          const dist = algVD.distance({x: x, y: y}, algVD.sites[i], algVD.distanceSpace)
          if (dist < minDist) {
            minDist = dist
            closest = algVD.sites[i];
          }
        }
        algVD.drawShape(algVD.getShape(closest), x, y, closest.radius, closest.color, algVD.calculateAlpha({x: x, y:y}, closest), algVD.getFill(closest))
        algVD.numOfStepsTemp++;

      }

      for (let j = 0; j < algVD.sites.length; j++) {
        let dx = Math.ceil(Math.random()*3 - 2)
        let dy = Math.ceil(Math.random()*3 - 2)
        algVD.sites[j].x  += dx
        algVD.sites[j].y  += dy
      }
      algVD.numOfStepsTemp = 0;
    } else {
      algVD.setCoords();

      let x = algVD.x;
      let y = algVD.y;
      if (x !== undefined && y !== undefined) {
        let closest = algVD.sites[0];
        let minDist = algVD.distance({x: x, y: y}, algVD.sites[0], algVD.distanceSpace)
        for (let i = 1; i < algVD.sites.length; i++) {
          const dist = algVD.distance({x: x, y: y}, algVD.sites[i], algVD.distanceSpace)
          if (dist < minDist) {
            minDist = dist
            closest = algVD.sites[i];
          }
        }
        algVD.drawShape(algVD.getShape(closest), x, y, closest.radius, closest.color, algVD.calculateAlpha({x:x, y:y}, closest), algVD.getFill(closest))
      }
    }

    if (algVD.displaySites) {
      for (let i = 0;i < algVD.sites.length; i++) {
        algVD.drawShape("circle", algVD.sites[i].x, algVD.sites[i].y, algVD.siteRadius, "black", algVD.siteAlpha, algVD.siteFill)
      }
    }
    algVD.numOfSteps++;
    if (algVD.placementMode !== "movingSites") {
      algVD.numOfStepsTemp++;
    }
  }
}

algVD.findClosestSiteToIndex = function(currPoint) {
  let tempNearestSiteIndex = 0;
  let x = algVD.mapValue(currPoint.x,[0,algVD.cols-1],[0,width])
  let y = algVD.mapValue(currPoint.y,[0,algVD.rows-1],[0,height])
  let tempCurrPoint = {x: x, y: y}

  for (let k = 1; k < algVD.sites.length; k++) {
    let tempNearestSite = algVD.sites[tempNearestSiteIndex];
    // let nearestSite = algVD.sites[tempNearestSiteIndex];

    // let tempNearestSite = {
    //   x: algVD.mapValue(nearestSite.x,[0,width],[-1,1]),
    //   y: algVD.mapValue(nearestSite.y,[0,height],[-1,1])
    // }

    let tempMinDist = algVD.distance(tempNearestSite,tempCurrPoint, algVD.distanceSpace)

    let tempCurrSite = algVD.sites[k];

    let tempCurrDist = algVD.distance(tempCurrSite, tempCurrPoint, algVD.distanceSpace)

    if (tempCurrDist <= tempMinDist) {
      tempNearestSiteIndex = k
    }
  }
  return tempNearestSiteIndex
}

algVD.reset = function () {
  // Check if already running
  algVD.pause();
  // Initialize values
  algVD.numOfSteps = 0;
  // Set line width
  ctx.lineWidth = Math.min(width, height) * 0.0025;

  algVD.numOfStepsTemp = 0;
  algVD.sites = [];

  if (algVD.randomGradientColors) {
    algVD.gradientColor1 = algVD.randColor()
    algVD.gradientColor2 = algVD.randColor()

    let rDelta = Math.abs(algVD.gradientColor2[0] - algVD.gradientColor1[0])
    let gDelta = Math.abs(algVD.gradientColor2[1] - algVD.gradientColor1[1])
    let bDelta = Math.abs(algVD.gradientColor2[2] - algVD.gradientColor1[2])
    while (rDelta + gDelta + bDelta < 200) {
      algVD.gradientColor2 = algVD.randColor()
      rDelta = Math.abs(algVD.gradientColor2[0] - algVD.gradientColor1[0])
      gDelta = Math.abs(algVD.gradientColor2[1] - algVD.gradientColor1[1])
      bDelta = Math.abs(algVD.gradientColor2[2] - algVD.gradientColor1[2])
    }
  }

  let rwx = Math.floor(Math.random() * (algVD.cols+1))
  let rwy = Math.floor(Math.random() * (algVD.rows+1))
  algVD.randomWalkCoords = {x: rwx, y: rwy}

  for (let i = 0; i < algVD.numSites; i++) {
    let x,y
    if (algVD.sitePlacement === "mapToCanvas") {
      let mapped = algVD.mapValue(i, [0, algVD.numSites-1], [0, width * height])
      y = mapped / (width);
      x = mapped % (width);
    } else if (algVD.sitePlacement === "triangle") {
      let min = Math.min(width, height);
      let minLo = min / 4;
      let minHi = min - minLo;

      if (i % 3 === 0) {
        let mapped = algVD.mapValue(i, [0, algVD.numSites-1], [minLo, minHi]);
        x = mapped;
        y = minHi;
      } else if (i % 3 === 1) {
        let mapped = algVD.mapValue(i, [0, algVD.numSites-1], [minLo, minHi]);
        y = min -  mapped;
        x = minLo/2 + mapped / 2;
      } else {
        let mapped = algVD.mapValue(i, [0, algVD.numSites-1], [minLo, minHi]);
        y =  min - mapped;
        x = minHi + minLo/2 - mapped / 2;
      }


      // let mapped = algVD.mapValue(i, [0, algVD.numSites-1], [0, width])
      // x = mapped
      // y = i%2? Math.abs(x - 300) + 300 : -Math.abs(x - 300) + 300 // x
      // y = i%2? Math.abs(x - 300) : -Math.abs(x - 300) + 600 // <>
      // y = i%2? Math.abs(x - 300) + 150 : -Math.abs(x - 300) + 450 // ><><
      // y = -Math.abs(x - 300) + 450 // v
      // y = Math.abs(x - 300) + 150 // ^
      // y = Math.sin(x) // sin upside down parabola, cos s
      // y = algVD.mapValue(y, [0, 1], [150, 450]) + 150

    } else if (algVD.sitePlacement === "tlbr-diagonal") {
      let minDim = Math.min(height,width)
      let mapped = algVD.mapValue(i, [0, algVD.numSites-1], [0, minDim])
      x = mapped
      y = mapped

    } else if (algVD.sitePlacement === "trbl-diagonal") {
      let minDim = Math.min(height,width)
      let mapped = algVD.mapValue(i, [0, algVD.numSites-1], [0, minDim])
      x = width - mapped
      y = mapped
    } else if (algVD.sitePlacement === "circle") {
      let r = width / 3
      let theta = i
      x = r * Math.cos(theta) + Math.floor(width / 2)
      y = r * Math.sin(theta) + Math.floor(height / 2)
    } else if (algVD.sitePlacement === "spiral") {
      let r = algVD.mapValue(i, [0,algVD.numSites], [20, width/2])
      let theta = i
      x = r * Math.cos(theta) + Math.floor(width / 2)
      y = r * Math.sin(theta) + Math.floor(height / 2)
    } else if (algVD.sitePlacement === "diamond") {
      let r = width / 3
      let theta = i
      x = r * Math.tan(theta) + Math.floor(width / 2)
      y = r * Math.sin(theta) + Math.floor(height / 2)
    } else if (algVD.sitePlacement === "parabola") {
      let r = width / 3
      let theta = i
      x = r * Math.cos(theta) + Math.floor(width / 2)
      y = r * Math.sin(theta)*Math.sin(theta) + Math.floor(height / 2)
    } else if (algVD.sitePlacement === "modulus") {
      x = i % algVD.siteGridDim
      y = Math.floor(i / algVD.siteGridDim)
      let xmod = i % algVD.sitePlacementModulusX
      let ymod = i % algVD.sitePlacementModulusY
      x = algVD.mapValue(x,[-1 + xmod, algVD.siteGridDim - xmod],[0,width])
      y = algVD.mapValue(y,[-1 + ymod, algVD.siteGridDim - ymod],[0,height])
    } else if (algVD.sitePlacement === "grid" && i < algVD.siteGridDim*algVD.siteGridDim) {
      x = i % algVD.siteGridDim
      y = Math.floor(i / algVD.siteGridDim)
      x = algVD.mapValue(x,[0,algVD.siteGridDim-1],[0.5*width/algVD.siteGridDim,width - 0.5*width/algVD.siteGridDim])
      y = algVD.mapValue(y,[0,algVD.siteGridDim-1],[0.5*height/algVD.siteGridDim,height - 0.5*height/algVD.siteGridDim])
    } else if (algVD.sitePlacement === "random") {
      x = Math.floor(width * Math.random());
      y = Math.floor(height * Math.random());
    }

    let rand =  algVD.randColor()

    if (algVD.gradient) {
      let col1 = algVD.randomGradientColors ? algVD.gradientColor1 : algVD.hexToRGB(algVD.gradientColor1)
      let col2 = algVD.randomGradientColors ? algVD.gradientColor2 : algVD.hexToRGB(algVD.gradientColor2)
      rand = algVD.weightedColorAvg(algVD.getColorWeight({x: x, y: y, i: i}),col1,col2)
    }

    let shapeIndex = Math.floor(Math.random() * (shapes.length)-1)
    if (Math.random() < 0.5) {
      shapeIndex = Math.floor(Math.random() * (shapes.length)-2)
    }
    let placementModeIndex = Math.floor(Math.random() * (expandingSiteModes.length))
    let fill = Math.floor(Math.random() * 2)

    algVD.sites.push({x: x, y: y, radius: algVD.circleRadius, color: "rgb(" + rand[0] + "," + rand[1] + "," + rand[2] + ")", shape: shapes[shapeIndex], fill: fill, mode: expandingSiteModes[placementModeIndex]})
  }
  algVD.rowColGraph = [];
  for (let i = 0; i < algVD.rows * algVD.cols; i++) {
    let closestSiteIndex = algVD.findClosestSiteToIndex({x: i % algVD.cols, y: Math.floor(i / algVD.cols)})
    algVD.rowColGraph.push({x: i % algVD.cols, y: Math.floor(i / algVD.cols), siteIndex: closestSiteIndex})
  }

  algVD.expandShrinkDist = algVD.expandShrinkDist === "random" ? distances[Math.floor(Math.random() * distances.length)] : algVD.expandShrinkDist

  algVD.ESRfocus = {x: algVD.expandShrinkx ===-1 ? Math.floor(Math.random() * algVD.cols) : algVD.expandShrinkx, y: algVD.expandShrinky === -1 ? Math.floor(Math.random() * algVD.rows) : algVD.expandShrinky}

}

algVD.initialize = function() {
  algVD.reset()
}

algVD.pause = function () {
  if("loop" in algVD) {
    clearInterval(algVD.loop);
  }
}

algVD.start = function () {
  if (algVD.backgroundColor !== "#FFFFFF") {
    algVD.setBackgroundColor(algVD.backgroundColor);
  }

  algVD.loop = setInterval(algVD.drawOneStep, algVD.speed);
}

algVD.loadDefaultParams = function () {
  algVD.circleRadius = 3;
  algVD.numSites = 25;
  algVD.placementMode = "expandingSite"; // random, random-norepeat, expandingRadius, shrinkingRadius, randomWalk, expandingSite, movingSites, sequential, square
  algVD.fill = "yes"; // yes, no, random, randomEachSite
  algVD.varyAlphaMode = "fixed" ;// random, closer, farther, fixed
  algVD.alphaMultiplier = 0.95;
  algVD.displaySites = true;
  algVD.siteRadius = 4;
  algVD.siteAlpha = 1;
  algVD.rows = 100;
  algVD.cols = 100;
  algVD.distanceSpace = "euclidean" // euclidian, manhattan, hyperbolic, euclihattan, polarEuclidean, polarManhattan, polarHyperbolic, wave, absDiff, minDiff, diffProd, chaos, odd, chaos2
  algVD.gradientColor1 = "#FF0000"
  algVD.gradientColor2 = "#0000FF"
  algVD.gradient = false;
  algVD.gradientMode = "center-out" // center-out, index, top-bototm, left-right, diagonal
  algVD.randomGradientColors = false;
  algVD.sitePlacement = "modulus"; // mapToCanvas, circle, spiral, diamond, parabola, modulus, grid, random
  algVD.siteGridDim = 5 // for sitePlacement == grid
  algVD.shape = "10PRINT" // circle, square, rectangle, circle-fitted  random, randomEachSite, random-unfitted, random-fitted
  algVD.expandingSiteDistance = "random" // for expandingSite placement mode: random, randomized, approachingSite, sequential, euclidean, manhattan, polarEuclidean, polarManhattan, polarHyperbolic, wave, minDiff, absDiff, diffProd, euclihattan, chaos, odd, chaos2
  algVD.expandingSitePerSite = true; // true - fill current site before moving on to the next one
  algVD.expandingSiteReverse = false; // false = minDist, true = maxDist
  algVD.sitePlacementModulusX = 2 // for modulus site placement
  algVD.sitePlacementModulusY = 2 // for modulus site placement
  algVD.siteFill = true
  algVD.alphaSpace = "euclidean" // any of the different distances
  algVD.expandShrinkDist = "euclidean"
  algVD.expandShrinkx = -1
  algVD.expandShrinky = -1
}
