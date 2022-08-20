/* Parameters */
/* Yellow to blue gradient */
algVines.gradient1 = [
    {r: 250, g: 250, b: 110},
    {r: 227, g: 230, b: 108},
    {r: 204, g: 210, b: 105},
    {r: 181, g: 191, b: 103},
    {r: 158, g: 171, b: 100},
    {r: 134, g: 151, b: 98},
    {r: 111, g: 131, b: 95},
    {r: 88, g: 112, b: 93},
    {r: 65, g: 92, b: 90},
    {r: 42, g: 72, b: 88}
]

// Gradients
algVines.gradients = [
    algVines.gradient1
];

// Draw colors
algVines.defaultColor = "blue";
algVines.colorList = [
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

// Background colors
algVines.backgroundColors = [
    "black",
    "white",
    "gainsboro",
    "gray",
    "red",
    "blue",
    "green",
    "yellow"
]

// Movement params
algVines.speed = 15;

// Path params
algVines.stepX = 1;
algVines.stepY = 8;
algVines.noisyPath = true;
algVines.noiseX = 2;
algVines.noiseY = 1;
algVines.randomPath = false;
algVines.stepChoicesX = [-10, 0, 14];
algVines.stepChoicesY = [-6, 0, 8];
algVines.curvedPath = true;
algVines.pathRadius = 4;
algVines.pathCycle = 30;
algVines.changingRadius = true;
algVines.radiusIncrementCycle = 50;
algVines.alsoLinear = true;

// Color params
algVines.useColorList = false;
algVines.randomColor = true;
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
algVines.offset = 0;
algVines.sideLength = 10;

// Spike params
algVines.numOfSpikes = 5;
algVines.spikeAlpha = 0.4;
algVines.spikeLineWidth = 1;
algVines.spikeOffsetRangeX = 50;
algVines.spikeOffsetRangeY = 100;
algVines.spikeMaxLength = 200;
