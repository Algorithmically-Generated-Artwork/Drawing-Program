/* Parameters */
algCS.speed = 0;
algCS.maxNumOfSteps = 500;
algCS.maxAttempsPerStep = 15;
algCS.setBackground = true; // set background or just place nodes
algCS.backgroundColor = "#051029";
algCS.placementMode = "random"; // random, grid, discreteAngle

// general node placement constraints
algCS.minDist = 5; // minium distance to every other node
algCS.largeNodeCommonFactor = 10; // higher: more uncommon large nodes
algCS.overlappingLines = true;
algCS.gridDim = 25; // grid dimension
algCS.forceBigNodeLeafs = true; // large nodes always be leafs

// for discreteAngle placement mode
algCS.angleDenom = 4; // factor used to determine angles allowed e.g. 2 = pi/2 = only 90 degrees
algCS.discreteAngleMaxLength = 50; // max distance that a node can be from another node

// large node properties
algCS.maxRadius = 20;
algCS.minRadius = 10;
algCS.largeNodeShape = "star"; // bullseye, star, both
algCS.colorCycleLengthModifier = 2; // for gradient color modes
algCS.randomAlpha = false;
algCS.randomAlphaMax = 0.35;

// bullseye node shape specific properties
algCS.bullseyeMode = "linearGradient" // linear gradient, random
algCS.bullseyeAlpha = 1.0;
algCS.linearGradientRandomColors = false;
algCS.linearGradientColorOne = "#FF0000"
algCS.linearGradientColorTwo = "#FFFF00"

// star node shape specific properties
algCS.starColMode = "gradient"; // color mode: gradient, random, fixed
algCS.starGradientColorOne = "#FF0000"
algCS.starGradientColorTwo = "#FFFF00"
algCS.starGradientRandomColors = false;
algCS.starAlpha = 1.0;
algCS.starFixedColor = "#0000FF";
algCS.starCurvePoints = 4 // points defining curve between star points
algCS.numOfStarPoints = 4; // number of points for star nodes
algCS.innerRadiusScale = 0.5;

// both shape mode
algCS.bothShapeModeStarProb = 0.75 // probability of drawing stars in

// small node properties
algCS.smallCircleMode = "fixed" // color: fixed, random
algCS.smallCircleColorFixed = "yellow";

// glow properties
algCS.glow = true;
algCS.glowOnSmall = false; // on small nodes
algCS.randomGlow = false; // color
algCS.glowColor = "yellow"; // default
algCS.glowLargeRadiusFactor = 2; // size factor for large node glow
algCS.glowSmallRadiusFactor = 4; // size factor for small node glow

// line properties
algCS.lineColor = "white";
algCS.lineWidthSizeFactor = 0.25; // higher = thicker lines
algCS.lineAlpha = 1.0;
