/* Parameters */
algVD.speed = 0;
algVD.maxNumOfSteps = 10000;

// Site Parameters
algVD.displaySites = true;
algVD.numSites = 25;
algVD.siteRadius = 4;
algVD.siteAlpha = 1;
algVD.siteFill = true
algVD.sitePlacement = "modulus"; // mapToCanvas, circle, spiral, diamond, parabola, modulus, grid, random
algVD.siteGridDim = 5 // for sitePlacement == grid
algVD.sitePlacementModulusX = 2 // for modulus site placement
algVD.sitePlacementModulusY = 2 // for modulus site placement

// Grid
algVD.rows = 100;
algVD.cols = 100;
algVD.backgroundColor = "#FFFFFF";

// Point Placement Parameters
algVD.distanceSpace = "euclidean" // euclidian, manhattan, hyperbolic, euclihattan, polarEuclidean, polarManhattan, polarHyperbolic, wave, polarWave, absDiff, minDiff, diffProd, chaos, odd, chaos2
algVD.placementMode = "expandingSite"; // random, random-norepeat, expandingRadius, shrinkingRadius, randomWalk, expandingSite, movingSites, sequential, square
algVD.expandingSiteDistance = "random" // for expandingSite placement mode: random, randomized, approachingSite, sequential, euclidean, manhattan, polarEuclidean, polarManhattan, polarHyperbolic, wave, minDiff, absDiff, diffProd, euclihattan, chaos, odd, chaos2
algVD.expandingSitePerSite = true; // true - fill current site before moving on to the next one
algVD.expandingSiteReverse = false; // false = minDist, true = maxDist
algVD.expandShrinkDist = "euclidean" // For expanding or shrinking radius placement mode
algVD.expandShrinkx = -1
algVD.expandShrinky = -1

// Point Properties
algVD.circleRadius = 3; // used for other shapes as well (square)
algVD.shape = "10PRINT" // circle, square, rectangle, circle-fitted  random, randomEachSite, random-unfitted, random-fitted
algVD.fill = "yes"; // yes, no, random, randomEachSite

algVD.varyAlphaMode = "fixed" ;// random, closer, farther, fixed
algVD.alphaSpace = "euclidean" // any of the different distances
algVD.alphaMultiplier = 0.95;

algVD.gradient = false;
algVD.randomGradientColors = false;
algVD.gradientMode = "center-out"; // center-out, index, top-bototm, left-right, diagonal
algVD.gradientColor1 = "#FF0000";
algVD.gradientColor2 = "#0000FF";

// Added by Mike for less transparency
algVD.lessTransparency = false;
