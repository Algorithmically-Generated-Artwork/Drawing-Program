/* Parameters */
algCL.speed = 0;
algCL.maxNumOfSteps = 1000;
algCL.NumOfStepsDone = 0;

algCL.backgroundColor = "white";

algCL.palettes = [
    // Default
    [
        [255, 0, 0],     // red
        [0, 255, 0],     // green
        [0, 0, 255],     // blue
        [255, 192, 203], // pink
        [0, 255, 255],   // cyan
        [255, 255, 0],   // yellow
        [255, 0, 255],   // magenta
        [255, 165, 0],   // orange
        [255, 0, 255],   // fuchsia
        [64, 224, 208]   // turquoise
    ],

    // Pastel
    [
        [255, 182, 193], // light pink
        [173, 216, 230], // light blue
        [144, 238, 144], // light green
        [255, 240, 245], // lavender blush
        [255, 228, 225], // misty rose
        [255, 239, 185], // peach
        [250, 240, 190], // light goldenrod yellow
        [255, 240, 245], // seashell
        [216, 191, 216], // thistle
        [255, 218, 185]  // moccasin
    ],

    // Earth Tone
    [
        [139, 69, 19],   // saddle brown
        [160, 82, 45],   // sienna
        [107, 142, 35],  // olive drab
        [85, 107, 47],   // dark olive green
        [222, 184, 135], // burlywood
        [139, 137, 112], // taupe
        [205, 133, 63],  // peru
        [169, 169, 169], // dark gray
        [160, 160, 160], // gray
        [102, 51, 0]     // umber
    ],

    // Cool Tones
    [
        [0, 128, 255],   // sky blue
        [0, 255, 255],   // cyan
        [0, 102, 204],   // deep blue
        [75, 0, 130],    // indigo
        [138, 43, 226],  // blue violet
        [72, 61, 139],   // dark slate blue
        [0, 206, 209],   // dark turquoise
        [176, 224, 230], // powder blue
        [0, 255, 127],   // spring green
        [32, 178, 170]   // light sea green
    ],

    // Warm Tones
    [
        [255, 69, 0],    // red-orange
        [255, 140, 0],   // dark orange
        [255, 165, 0],   // orange
        [255, 215, 0],   // gold
        [218, 165, 32],  // goldenrod
        [205, 92, 92],   // indian red
        [178, 34, 34],   // firebrick
        [139, 0, 0],     // dark red
        [255, 99, 71],   // tomato
        [240, 128, 128]  // light coral
    ],

    // Regal
    [
        [102, 0, 51],   // deep burgundy
        [255, 215, 0],  // gold
        [75, 0, 130],   // indigo
        [47, 79, 79],   // dark slate
        [220, 20, 60],  // crimson
        [184, 134, 11], // antique bronze
        [0, 51, 102],   // navy blue
        [139, 69, 19],  // rich brown
        [128, 0, 0],    // deep red
        [160, 82, 45]   // mahogany
    ],


    // Grayscale
    [
        [0, 0, 0],       // black
        [32, 32, 32],    // very dark gray
        [64, 64, 64],    // dark gray
        [96, 96, 96],    // gray
        [128, 128, 128], // medium gray
        [160, 160, 160], // light gray
        [192, 192, 192], // very light gray
        [224, 224, 224], // near white
        [245, 245, 245], // off white
        [255, 255, 255]  // pure white
    ]
  ];

algCL.paletteSelect = "default"; //default, pastel, earth, warm, cool, regal, greyscale
algCL.circleColors = algCL.palettes[0];


algCL.numBalls = 10;
algCL.ballArray = [];

algCL.fillCircle = true;

algCL.minimumAlpha = 0.2;
algCL.maximumAlpha = 1;
algCL.minimumVelocity = 1;
algCL.maximumVelocity = 10;
algCL.minimumRadius = 25;
algCL.maximumRadius = 50;

algCL.gradientMethod = "none"; //none, inverse, setlist

// algCL.gradientOrSolid = false;
// algCL.gradientInverse = false;
// algCL.gradientSetList = false;
algCL.colorCycleLength = 50;

algCL.wrapAroundWalls = false;
algCL.wrapAroundStyle = "both"; //both, x, y
algCL.wrapAroundRandom = false;

algCL.randomChangeSteps = 50;
algCL.velocityChangesOnCollision = false;
algCL.speedUpOnCollision = false;
algCL.velocityIncrement = 1;


algCL.ballsCollide = false;
algCL.handleCollision = "combine" //none, combine, disappear, change radii

algCL.ballsDivideOnWallCollision = false;

algCL.ballRadiiCollisionFactor = 0.8;
algCL.combineAlphaMode = "change"; //change (sum and multiply), sum, min, max for alpha
algCL.combineAlphaChangeFactor = 0.1;


algCL.collisionAngleRandomness = false;
algCL.angleRandomnessScaler = 0.1;
algCL.randomBounce = false;

algCL.sinusoidal = false;
algCL.sinusoidalCycle = 5;
algCL.sinusoidalAngle = Math.PI / 8;
algCL.noTrail = false;
