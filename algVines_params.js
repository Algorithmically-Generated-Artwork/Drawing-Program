/* Parameters */
/* Yellow to blue gradient */
algVines.palette1 = [
  "rgb(250,250,110)",
  "rgb(227,230,108)",
  "rgb(204,210,105)",
  "rgb(181,191,103)",
  "rgb(158,171,100)",
  "rgb(134,151,98)",
  "rgb(111,131,95)",
  "rgb(88,112,93)",
  "rgb(65,92,90)",
  "rgb(42,72,88)"
];

algVines.palette2 = [
    "purple",
    "fuchsia",
    "lime",
    "aqua",
    "darkorange",
    "deeppink",
    "mediumspringgreen",
    "white",
    "tomato"
]

algVines.palette3 = [
  "rgb(163,0,33)",
  "rgb(245,99,41)",
  "rgb(238,175,27)",
  "rgb(236,237,232)",
  "rgb(129,177,162)"
];

algVines.palette4 = [
  "rgb(57,0,153)",
  "rgb(158,0,89)",
  "rgb(255,0,84)",
  "rgb(255,84,0)",
  "rgb(255,189,0)"
];

algVines.palette5 = [
  "rgb(121,125,98)",
  "rgb(155,155,122)",
  "rgb(217,174,148)",
  "rgb(241,220,167)",
  "rgb(208,140,96)",
  "rgb(153,123,102)"
];

// Palettes
algVines.palettes = [
    algVines.palette1,
    algVines.palette2,
    algVines.palette3,
    algVines.palette4,
    algVines.palette5
];

// Draw colors
algVines.defaultColor = "blue";
algVines.colorList = algVines.palette2;

// Background colors
algVines.isBackgroundSet = false;
algVines.backgroundColors = [
    "black",
    "white",
    "gainsboro",
    "gray",
    "red",
    "blue",
    "green",
    "yellow"
];

// Movement params
algVines.speed = 0;
algVines.maxNumOfSteps = 50000;

// Path params
algVines.stepX = 1;
algVines.stepY = 8;
algVines.noisyPath = false;
algVines.noiseX = 2;
algVines.noiseY = 1;
algVines.randomPath = false;
algVines.stepChoicesX = [-10, 0, 14];
algVines.stepChoicesY = [-6, 0, 8];
algVines.curvedPath = true;
algVines.pathRadius = 5;
algVines.pathCycle = 30;
algVines.changingRadius = true;
algVines.radiusIncrementCycle = 20;
algVines.alsoLinear = false;

// Color params
algVines.useColorList = true;
algVines.randomColor = false;
algVines.changingColors = true;

// Circle params
algVines.drawCircles = false;
algVines.circleRadius = 15;
algVines.circleOpacity = 0.2;
algVines.pressureVariation = true;
algVines.penPressureMin = 0.4;
algVines.circleRandomness = false;

// Shape params
algVines.drawShapes = true;
algVines.rotation = true;
algVines.lineWidth = 2;
algVines.sideLength = 30;

// Spike params
algVines.numOfSpikes = 5;
algVines.spikeAlpha = 0.4;
algVines.spikeLineWidth = 1;
algVines.spikeOffsetRangeX = 50;
algVines.spikeOffsetRangeY = 100;
algVines.spikeMaxLength = 200;
