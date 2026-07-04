let algComp = {};
algComp.binaryMatrix = [];
algComp.coordinateMatrix = [];
algComp.updatedCoordinateMatrix = [];
algComp.rectangles = [];
algComp.recordCanvas = [];

algComp.i = 1;
algComp.j = 0;
algComp.origin = null;
algComp.dest = null;
algComp.horizontalDrawing = true;
algComp.verticalDrawing = false;
algComp.rectangleFilling = false;
algComp.foundRectangles = false;
algComp.currRec = 0;
algComp.currPalette = null;

algComp.curr = null;
algComp.currStep = 0;
algComp.currColor = algComp.lineColor;
algComp.isCompletingLine = false;

/********* Drawing Functions **********/
algComp.drawLine = function (p1, p2) {
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = algComp.currColor;
    ctx.lineWidth = algComp.lineWidth;
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
}

algComp.fillRectangle = function (startX, startY, row, col, destX, destY) {
    // randomly select a color from the palette
    ctx.fillStyle = algComp.chooseRectColor();
    if (algComp.colorByPixel || algComp.createOffset) {
        // fill the rectangle by pixels
        ctx.fillRect(startX, startY, row, col);
        return;
    }

    let lineAdjust = algComp.lineWidth / 2;
    if (startX !== 0) {
        startX += lineAdjust;
        row -= lineAdjust;
    }

    if (startY !== 0) {
        startY += lineAdjust;
        col -= lineAdjust;
    }

    if (destX !== height) {
        row -= lineAdjust;
    }

    if (destY !== width) {
        col -= lineAdjust;
    }

    ctx.fillRect(startX, startY, row, col);
}


/********* Initialization **********/
algComp.initializeMatrix = function () {
    let rowProb = 0;
    // top borderline
    algComp.fillBorder();

    // fill the matrix
    for (let i = 0; i < algComp.numOfRows; i++) {
        let row = [];
        let coordinates = [];

        // reach to the top and bottom border
        if (algComp.reachToBorder && (i === 0 || i === algComp.numOfRows - 1)) {
            for (let j = 0; j < algComp.numOfCols + 2; j++) {
                row.push(1);
                coordinates.push([0, 0]);
            }
            algComp.binaryMatrix.push(row);
            algComp.coordinateMatrix.push(coordinates);
            continue;
        }

        // consider making the row all 0's to create bigger white spaces
        if (algComp.biggerWhiteSpace) {
            let prob = algComp.increaseProb(algComp.whiteSpaceProb, algComp.whiteSpaceMaxProb,
                rowProb, algComp.numOfRows, "sig");
            if (Math.random() < prob) {
                // make the row all 0's
                for (let j = 0; j < algComp.numOfCols + 2; j++) {
                    if (j === 0 || j === algComp.numOfCols + 1) {
                        row.push(1);
                    } else if (algComp.reachToBorder && (j === 1 || j === algComp.numOfCols)) {
                        row.push(1);
                    } else {
                        row.push(0);
                    }
                    coordinates.push([0, 0]);
                }
                algComp.binaryMatrix.push(row);
                algComp.coordinateMatrix.push(coordinates);
                continue;
            }
        }

        let colProb = 0;
        let rowLine = false;
        for (let j = 0; j < algComp.numOfCols + 2; j++) {
            if (j === 0 || j === algComp.numOfCols + 1) {
                row.push(1);
            } else if (algComp.reachToBorder && (j === 1 || j === algComp.numOfCols)) {
                row.push(1);
            } else {
                if (algComp.strictGrid) {
                    row.push(1);
                    rowLine = true;
                } else {
                    let prob = algComp.increaseProb(algComp.lengthProb, algComp.lengthMaxProb,
                        colProb, algComp.numOfCols, "sig");
                    let num = Math.random() < prob ? 1 : 0;

                    if (num === 0) {
                        colProb = 0;
                    } else {
                        rowLine = true;
                        colProb++;
                    }

                    row.push(num);
                }
            }
            coordinates.push([0, 0]);
        }

        if (rowLine) rowProb++;

        algComp.binaryMatrix.push(row);
        algComp.coordinateMatrix.push(coordinates);
    }

    // bottom borderline
    algComp.fillBorder();

    // Post-process: to create more vertical lines when we have bigger white spaces
    if (algComp.biggerWhiteSpace) {
        rowProb = 0; // it is actually column's prob
        for (let i = 1; i < algComp.numOfCols + 1; i++) {
            let prob = algComp.increaseProb(algComp.whiteSpaceProb, algComp.whiteSpaceMaxProb,
                rowProb, algComp.numOfCols, "sig");
            if (Math.random() < prob) continue;

            let colProb = 0; // it is actually row's prob
            let rowLine = false;
            for (let j = 1; j < algComp.numOfRows + 1; j++) {
                if (algComp.strictGrid) {
                    algComp.binaryMatrix[j][i] = 1;
                    rowLine = true;
                } else if (algComp.binaryMatrix[j][i] === 0) {
                    let prob = algComp.increaseProb(algComp.lengthProb, algComp.lengthMaxProb,
                        colProb, algComp.numOfRows, "sig");
                    let num = Math.random() < prob ? 1 : 0;

                    if (num === 0) {
                        colProb = 0;
                    } else {
                        rowLine = true;
                        colProb++;
                    }

                    algComp.binaryMatrix[j][i] = num;
                }
            }

            if (rowLine) rowProb++;
        }
    }
}

algComp.selectCoordinates = function () {
    if (algComp.diffLineSameGroup) {
        // set the x coordinate for each column
        for (let i = 1; i < algComp.numOfCols + 1; i++) {
            let curr = false; // currently within a line
            let x = 0;
            for (let j = 0; j < algComp.numOfRows + 2; j++) {
                if (!curr) x = algComp.selectX(i - 1); // select X coordinate for the next line
                if (algComp.binaryMatrix[j][i] === 1) {
                    algComp.coordinateMatrix[j][i][0] = x;
                    curr = true;
                } else {
                    curr = false;
                }
            }
        }

        // set the y coordinate for each row
        for (let i = 1; i < algComp.numOfRows + 1; i++) {
            let curr = false; // currently within a line
            let y = 0;
            for (let j = 0; j < algComp.numOfCols + 2; j++) {
                if (!curr) y = algComp.selectY(i - 1); // select Y coordinate for the next line
                if (algComp.binaryMatrix[i][j] === 1) {
                    algComp.coordinateMatrix[i][j][1] = y;
                    curr = true;
                } else {
                    curr = false;
                }
            }
        }
    } else {
        // set the x coordinate for each column
        for (let i = 1; i < algComp.numOfCols + 1; i++) {
            let x = algComp.selectX(i - 1); // select X coordinate for the next line
            for (let j = 0; j < algComp.numOfRows + 2; j++) {
                if (algComp.binaryMatrix[j][i] === 1) {
                    algComp.coordinateMatrix[j][i][0] = x;
                }
            }
        }

        // set the y coordinate for each row
        for (let i = 1; i < algComp.numOfRows + 1; i++) {
            let y = algComp.selectY(i - 1); // select Y coordinate for the next line
            for (let j = 0; j < algComp.numOfCols + 2; j++) {
                if (algComp.binaryMatrix[i][j] === 1) {
                    algComp.coordinateMatrix[i][j][1] = y;
                }
            }
        }
    }

    // set the last row
    for (let j = 0; j < algComp.numOfCols + 2; j++) {
        algComp.coordinateMatrix[algComp.numOfRows + 1][j][1] = height;
    }

    // set the last column
    for (let i = 0; i < algComp.numOfRows + 2; i++) {
        algComp.coordinateMatrix[i][algComp.numOfCols + 1][0] = width;
    }
}

algComp.selectX = function (col) {
    let lower = width / algComp.numOfCols * col;
    let upper = width / algComp.numOfCols * col + width / algComp.numOfCols;

    // random number between upper and lower
    return algComp.ranGenNum(upper, lower);
}

algComp.selectY = function (row) {
    let lower = height / algComp.numOfRows * row;
    let upper = height / algComp.numOfRows * row + height / algComp.numOfRows;

    // random number between upper and lower
    return algComp.ranGenNum(upper, lower);
}

algComp.fillBorder = function () {
    // push the top/bottom borderline
    algComp.binaryMatrix.push(new Array(algComp.numOfCols + 2).fill(1));
    let coor = [];
    for (let i = 0; i < algComp.numOfCols + 2; i++) {
        coor.push([0, 0]);
    }
    algComp.coordinateMatrix.push(coor);
}

algComp.initializeRecordCanvas = function () {
    // initialize the record canvas to be an empty matrix
    if (algComp.colorByPixel || algComp.createOffset) {
        algComp.recordCanvas = new Array(height)
            .fill(0).map(() => new Array(width).fill(0));
        console.log("record canvas initialized");
    }
}


/********* Offsets **********/
algComp.chooseOffset = function () {
    if (algComp.horizontalDrawing) {
        algComp.origin.cCoor[0] = algComp.offsetCoordinate(algComp.origin.cCoor[0], "neg");
        algComp.dest.cCoor[0] = algComp.offsetCoordinate(algComp.dest.cCoor[0], "pos");
        // update in the matrix
        algComp.updatedCoordinateMatrix[algComp.origin.mCoor[0]][algComp.origin.mCoor[1]][0] = algComp.origin.cCoor[0];
        algComp.updatedCoordinateMatrix[algComp.dest.mCoor[0]][algComp.dest.mCoor[1]][0] = algComp.dest.cCoor[0];
    } else if (algComp.verticalDrawing) {
        algComp.origin.cCoor[1] = algComp.offsetCoordinate(algComp.origin.cCoor[1], "neg");
        algComp.dest.cCoor[1] = algComp.offsetCoordinate(algComp.dest.cCoor[1], "pos");
        // update in the matrix
        algComp.updatedCoordinateMatrix[algComp.origin.mCoor[0]][algComp.origin.mCoor[1]][1] = algComp.origin.cCoor[1];
        algComp.updatedCoordinateMatrix[algComp.dest.mCoor[0]][algComp.dest.mCoor[1]][1] = algComp.dest.cCoor[1];
    }
}

algComp.offsetCoordinate = function (num, direction) {
    if (Math.random() < algComp.offsetProb) {
        if (direction === "neg") {
            return num - algComp.ranGenNum(algComp.minOffsetSize, algComp.offsetSize);
        } else {
            return num + algComp.ranGenNum(algComp.minOffsetSize, algComp.offsetSize);
        }
    }
    return num;
}


/********* Coloring **********/
algComp.colorCurrRectangle = function () {
    if (algComp.currRec >= algComp.rectangles.length) {
        algComp.rectangleFilling = false;
        return;
    }
    // console.log("Coloring rectangle ", algComp.currRec);
    let curr = algComp.rectangles[algComp.currRec];
    if (algComp.colorByPixel || algComp.createOffset) {
        // color rectangles by pixels of the canvas
        algComp.fillRectangle(curr[0] - 1, curr[1] - 1, curr[3] - 1, curr[2] - 1);
    } else {
        // color rectangles using the grid
        let tl = algComp.updatedCoordinateMatrix[curr[1]][curr[0]];
        let br = algComp.updatedCoordinateMatrix[curr[1] + curr[2] - 1][curr[0] + curr[3] - 1];
        // console.log(curr, tl, br);
        algComp.fillRectangle(tl[0], tl[1], br[0] - tl[0], br[1] - tl[1], br[0], br[1]);
    }
    algComp.currRec++;
}

algComp.findRects = function () {
    if (algComp.colorByPixel || algComp.createOffset) {
        // color by each pixel of the canvas
        algComp.rectangles = algComp.getEmptyRectangles(height + 2, width + 2, algComp.recordCanvas);
    } else {
        // color by grid
        algComp.rectangles = algComp.getEmptyRectangles(algComp.numOfRows + 2,
            algComp.numOfCols + 2, algComp.binaryMatrix);
        // add the two by two rectangles
        if (algComp.add2B2Rect) {
            algComp.rectangles = algComp.rectangles.concat(algComp.getTwoByTwoRectangles(algComp.numOfRows + 2,
                algComp.numOfCols + 2, algComp.binaryMatrix));
        }
    }
}

algComp.processCanvas = function () {
    if (!algComp.foundRectangles) {
        if (algComp.colorByPixel || algComp.createOffset) {
            // algComp.recordCanvas = algComp.canvasToMatrix();
            algComp.expandRecordCanvas();
        }
        algComp.findRects();
        algComp.foundRectangles = true;
        console.log("found rectangles");
        // console.log(algComp.rectangles);
    }
}

algComp.expandRecordCanvas = function () {
    // expand the record canvas by adding the borderlines
    let newRecordCanvas = [];
    // top border
    newRecordCanvas.push(new Array(width + 2).fill(1));
    // middle
    for (let i = 0; i < height; i++) {
        let row = [];
        for (let j = 0; j < width + 2; j++) {
            if (j === 0 || j === width + 1) {
                row.push(1);
            } else {
                row.push(algComp.recordCanvas[i][j - 1]);
            }
        }
        newRecordCanvas.push(row);
    }
    // bottom border
    newRecordCanvas.push(new Array(width + 2).fill(1));
    algComp.recordCanvas = newRecordCanvas;
}

algComp.checkIfColoringFinished = function () {
    if (!algComp.rectangleFilling || algComp.onlyLines) {
        // show the grid
        if (algComp.showGrid) {
            algComp.displayGrid();
        }
        // stop the loop
        algComp.pause();
        console.log("coloring finished");
        return true;
    }
    return false;
}

algComp.chooseLineColor = function () {
    if (algComp.onlyLines) {
        algComp.currColor = algComp.currPalette[algComp.ranGenNum(0, algComp.currPalette.length - 1)];
        // color cannot be white
        while (algComp.currColor === "#fff") {
            algComp.currColor = algComp.currPalette[algComp.ranGenNum(0, algComp.currPalette.length - 1)];
        }
    }
}

algComp.chooseRectColor = function () {
    let color = algComp.currPalette[algComp.ranGenNum(0, algComp.currPalette.length - 1)];

    // if white, select again to decrease the probability of white
    if (algComp.lessWhite && color === "#fff") {
        if (Math.random() < algComp.lessWhiteProb) {
            color = algComp.currPalette[algComp.ranGenNum(0, algComp.currPalette.length - 1)];
        }
    }

    return color;
}

algComp.decideRandomColor = function () {
    let choice = algComp.ranGenNum(0, 3);
    if (choice === 0) {
        // completely random colors
        for (let i = 0; i < algComp.ranGenNum(4, 10); i++) {
            algComp.ranColorPalette.push(algComp.generateRandomColor());
        }
    } else if (choice === 1) {
        // generate analogous color group
        const baseHue = Math.floor(Math.random() * 360);
        algComp.ranColorPalette = algComp.generateAnalogousColors(baseHue, algComp.ranGenNum(4, 10));
    } else if (choice === 2) {
        // generate light/saturation
        const baseHue = Math.floor(Math.random() * 360);
        algComp.ranColorPalette = algComp.generateShadesAndTints(baseHue, algComp.ranGenNum(4, 10));
    } else if (choice === 3) {
        // generate monochromatic color group
        const baseHue = Math.floor(Math.random() * 360);
        algComp.ranColorPalette = algComp.generateMonochromaticColors(baseHue, algComp.ranGenNum(4, 10));
    }
}


/********* Recursive Steps **********/
algComp.completingLine = function (origin, dest, curr) {
    let stepX = (dest[0] - origin[0]) / algComp.framesPerMovement;
    let stepY = (dest[1] - origin[1]) / algComp.framesPerMovement;

    curr[0] += stepX;
    curr[1] += stepY;
    algComp.currStep++;

    // console.log("completing line", origin, dest, curr);

    algComp.drawLine(origin, curr);

    if (algComp.currStep >= algComp.framesPerMovement) {
        algComp.drawLine(origin, dest);
        if (algComp.colorByPixel || algComp.createOffset) {
            algComp.recordLine(origin, dest);
        }
        algComp.isCompletingLine = false;
        algComp.origin = null;
        algComp.dest = null;
        algComp.curr = null;
        algComp.currStep = 0;
        algComp.currColor = algComp.lineColor;
        algComp.iterationUpdate();
    }
}

algComp.chooseCurrCoordinates = function (currX, currY) {
    if (!algComp.origin) {
        algComp.origin = {
            mCoor: [algComp.i, algComp.j],          // matrix location
            cCoor: [currX, currY],              // canvas location
        }
    }
    algComp.dest = {
        mCoor: [algComp.i, algComp.j],          // matrix location
        cCoor: [currX, currY],              // canvas location
    }
}

algComp.iterationUpdate = function () {
    if (algComp.horizontalDrawing) {
        algComp.j++;
        if (algComp.j > algComp.numOfCols + 1) {
            algComp.j = 0;
            algComp.i++;
            algComp.origin = null;
            algComp.dest = null;
        }
    } else if (algComp.verticalDrawing) {
        algComp.i++;
        if (algComp.i > algComp.numOfRows + 1) {
            algComp.i = 0;
            algComp.j++;
            algComp.origin = null;
            algComp.dest = null;
        }
    }

    if (algComp.horizontalDrawing && algComp.i > algComp.numOfRows) {
        // the num of rows exceeds limit
        algComp.horizontalDrawing = false;
        algComp.verticalDrawing = true;
        algComp.i = 0;
        algComp.j = 1;
        algComp.origin = null;
        algComp.dest = null;
        console.log("finish horizontal");
    } else if (algComp.verticalDrawing && algComp.j > algComp.numOfCols) {
        // the num of cols exceeds limit
        algComp.verticalDrawing = false;
        algComp.rectangleFilling = true;
        algComp.i = 1;
        algComp.j = 0;
        algComp.origin = null;
        algComp.dest = null;
        console.log("finish vertical");
    }
}

algComp.drawOneStep = function () {
    if (!algComp.horizontalDrawing && !algComp.verticalDrawing) {
        if (algComp.checkIfColoringFinished()) {
            return;
        }
        // begin to coloring the rectangles
        algComp.processCanvas();    // will only run once
        algComp.colorCurrRectangle();
        return;
    }

    // finishing the current line
    if (algComp.isCompletingLine) {
        algComp.completingLine(algComp.origin.cCoor, algComp.dest.cCoor, algComp.curr);
        return;
    }

    if (algComp.binaryMatrix[algComp.i][algComp.j] === 1) {
        algComp.chooseCurrCoordinates(algComp.coordinateMatrix[algComp.i][algComp.j][0],
            algComp.coordinateMatrix[algComp.i][algComp.j][1]);
    } else if (algComp.origin && algComp.dest) {
        if (algComp.origin.cCoor[0] !== algComp.dest.cCoor[0]
            || algComp.origin.cCoor[1] !== algComp.dest.cCoor[1]) {
            if (algComp.createOffset) algComp.chooseOffset();
            // console.log("line:", [algComp.origin.x, algComp.origin.y], [algComp.dest.x, algComp.dest.y]);
            algComp.isCompletingLine = true;
            algComp.curr = algComp.origin.cCoor.slice();
            algComp.chooseLineColor();
            return;
        }
        algComp.origin = null;
        algComp.dest = null;
    }

    // update last element of the matrix
    if (((algComp.horizontalDrawing && algComp.j === algComp.numOfCols + 1)
            || (algComp.verticalDrawing && algComp.i === algComp.numOfRows + 1))
        && algComp.origin && algComp.dest) {
        if (algComp.origin.cCoor[0] !== algComp.dest.cCoor[0]
            || algComp.origin.cCoor[1] !== algComp.dest.cCoor[1]) {
            if (algComp.createOffset) algComp.chooseOffset();
            // console.log("(last) line:", [algComp.origin.x, algComp.origin.y], [algComp.dest.x, algComp.dest.y]);
            algComp.isCompletingLine = true;
            algComp.curr = algComp.origin.cCoor.slice();
            algComp.chooseLineColor();
            return;
        }
        algComp.origin = null;
        algComp.dest = null;
    }

    if (!algComp.isCompletingLine) {
        algComp.iterationUpdate();
    }
}


/********* Main Functions **********/
algComp.reset = function () {
    algComp.pause();
    algComp.drawLineQueue = [];
    algComp.binaryMatrix = [];
    algComp.coordinateMatrix = [];
    algComp.recordCanvas = [];
    algComp.i = 1;
    algComp.j = 0;
    algComp.origin = null;
    algComp.dest = null;
    algComp.curr = null;
    algComp.horizontalDrawing = true;
    algComp.verticalDrawing = false;
    algComp.rectangleFilling = false;
    algComp.foundRectangles = false;
    algComp.isCompletingLine = false;
    algComp.currRec = 0;
    algComp.currPalette = null;
    algComp.currStep = 0;
    algComp.currColor = algComp.lineColor;
}

algComp.initialize = function () {
    algComp.reset();
}

algComp.pause = function () {
    if ("loop" in algComp) {
        clearInterval(algComp.loop);
    }
}

algComp.start = function () {
    // randomly select a palette
    if ("currPalette" in algComp && algComp.currPalette != null) {
        // noop, for backstage generation
    } else if (algComp.usePalette) {
        // use an existing color palette
        let choice = algComp.ranGenNum(0, algComp.palettes.length - 1);
        algComp.currPalette = algComp.palettes[choice];
    } else {
        // choose the random color palette
        algComp.decideRandomColor();
        algComp.currPalette = algComp.ranColorPalette;
    }
    // initialize the matrices
    algComp.initializeMatrix();
    algComp.selectCoordinates();
    algComp.initializeRecordCanvas();
    // make a separate copy of the coordinate matrix (not change the original)
    algComp.updatedCoordinateMatrix = JSON.parse(JSON.stringify(algComp.coordinateMatrix));

    // initial prints
    console.log("matrices and parameters generated");
    // console.log(algComp.binaryMatrix);
    // console.log(algComp.coordinateMatrix);
    // console.log(algComp.updatedCoordinateMatrix);

    algComp.loop = setInterval(algComp.drawOneStep, algComp.speed);
}

algComp.randomize = function () {
    alg1.speed = 0;
    // decide color frame
    algComp.usePalette = Math.random() < 0.6;
    // grid size
    algComp.numOfRows = algComp.ranGenNum(3, 15);
    algComp.numOfCols = algComp.ranGenNum(3, 15);
    // line length and width
    algComp.decideLineLength([0.4, 0.6], [0.6, 0.9]);
    algComp.lineWidth = algComp.ranGenNum(0, 10);
    // add 2B2 rectangles (true because it's almost never good to have false)
    algComp.add2B2Rect = true;
    // modes
    let choice = algComp.ranGenNum(0, 6);
    if (choice < 5) {
        algComp.ranOpStrictGrid();
    } else if (choice < 6) {
        algComp.ranOpNonStrictGrid();
    } else {
        algComp.ranOpOnlyLines();
    }
    // prob increase rate
    algComp.sigRate = algComp.ranGenNum(5, 20);
}


/********* Helper Functions **********/
algComp.ranGenNum = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

algComp.ranGenProb = function (min, max) {
    return Math.random() * (max - min) + min;
}

algComp.increaseProb = function (base, final, curr, total, type) {
    let norm = curr / (total - 1);

    if (type === "sig") {
        let x = norm * algComp.sigRate - algComp.sigRate / 2;
        let sigmoid = 1 / (1 + Math.exp(-x));
        return base + (final - base) * sigmoid;
    } else if (type === "exp") {
        let r = Math.log(final / base) / total;
        return Math.min(final, base * Math.exp(r * curr));
    }

    return Math.round(Math.random());
}

// The following functions were made available by the authors under an open
// source MIT License.  Please see the following repo for more details.
// URL - https://github.com/MichaelWehar/Enumerating-Rectangles-With-Empty-Interior

// This function will take in a binary matrix (rows, cols, 2D array)
// and output an array of subrectangles (x, y, rows, cols) that
// have 1's on the borders and 0's on the inside.
algComp.getEmptyRectangles = function (rows, cols, matrix) {
    let output = [];
    let i = 0;
    // Each interval has the form (left, right)
    let prevIntervals = [];
    // Each staple has the form (left, right, top)
    let staples = [];
    // Loop where we go through each row
    while (i < rows) {
        let array = matrix[i];
        let intervals = algComp.getIntervals(cols, array);
        let nextStaplesNew = [];
        let nextStaplesOld = [];
        if (i != 0) {
            // Closing staples
            let iIndex = 0; // interval index
            let sIndex = 0; // staple index
            while (iIndex < intervals.length && sIndex < staples.length) {
                let interval = intervals[iIndex];
                let staple = staples[sIndex];
                if (staple[0] < interval[0]) {
                    sIndex++;
                } else if (interval[1] < staple[1]) {
                    iIndex++;
                } else if (interval[0] <= staple[0] && staple[1] <= interval[1]) {
                    let x = staple[0];
                    let y = staple[2];
                    let tempRows = i - y + 1;
                    let tempCols = staple[1] - staple[0] + 1;
                    output.push([x, y, tempRows, tempCols]);
                    sIndex++;
                }
            }
            // Continuing staples
            iIndex = 0; // interval index
            sIndex = 0; // staple index
            while (iIndex < intervals.length && sIndex < staples.length) {
                let interval = intervals[iIndex];
                let staple = staples[sIndex];
                if (staple[0] == interval[1]) {
                    if (iIndex + 1 < intervals.length) {
                        iIndex++;
                        interval = intervals[iIndex];
                        if (staple[1] == interval[0]) {
                            nextStaplesOld.push(staple);
                            sIndex++;
                        }
                    } else {
                        break;
                    }
                } else if (staple[0] < interval[1]) {
                    sIndex++;
                } else if (staple[0] > interval[1]) {
                    iIndex++;
                }
            }
        }
        // New staples
        pIndex = 0; // previous interval index
        cIndex = 0; // current interval index
        while (cIndex < intervals.length && pIndex < prevIntervals.length) {
            let pInterval = prevIntervals[pIndex];
            let cInterval = intervals[cIndex];
            if (pInterval[0] <= cInterval[1] && cInterval[1] <= pInterval[1]) {
                if (cIndex + 1 < intervals.length) {
                    let left = cInterval[1];
                    cIndex++;
                    cInterval = intervals[cIndex];
                    let right = cInterval[0];
                    if (right - left > 1 && right <= pInterval[1]) {
                        let staple = [left, right, i - 1];
                        nextStaplesNew.push(staple);
                    }
                } else {
                    break;
                }
            } else if (cInterval[1] < pInterval[0]) {
                cIndex++;
            } else if (pInterval[0] < cInterval[1]) {
                pIndex++;
            }
        }
        // Prepare for next row
        prevIntervals = intervals;
        staples = algComp.mergeStaples(nextStaplesOld, nextStaplesNew);
        i++;
        // console.log("Intervals: " + JSON.stringify(intervals));
        // console.log("Staples: " + JSON.stringify(staples));
        // console.log();
    }
    return output;
}

// Merge two ordered lists of staples together
algComp.mergeStaples = function (list1, list2) {
    let output = [];
    let i = 0;
    let j = 0;
    while (i < list1.length && j < list2.length) {
        if (list1[i][0] < list2[j][0]) {
            output.push(list1[i]);
            i++;
        } else {
            output.push(list2[j]);
            j++;
        }
    }
    if (i < list1.length) {
        while (i < list1.length) {
            output.push(list1[i]);
            i++;
        }
    } else {
        while (j < list2.length) {
            output.push(list2[j]);
            j++;
        }
    }
    return output;
}

// This function will find all two by two matrices of all 1's
algComp.getTwoByTwoRectangles = function (rows, cols, matrix) {
    let output = [];
    for (let i = 0; i < rows - 1; i++) {
        for (let j = 0; j < cols - 1; j++) {
            if (matrix[i][j] == 1 && matrix[i + 1][j] == 1 && matrix[i][j + 1] == 1 && matrix[i + 1][j + 1] == 1) {
                output.push([j, i, 2, 2]);
            }
        }
    }
    return output;
}

// This function will take in a binary array (length, array) and
// output an array of intervals (left, right) representing blocks
// of 1's within the array.
algComp.getIntervals = function (length, array) {
    let intervals = [];
    let left = -1;
    for (let i = 0; i < length; i++) {
        if (left == -1 && array[i] == 1) {
            left = i;
        } else if (left != -1 && array[i] == 0) {
            intervals.push([left, i - 1]);
            left = -1;
        }
    }
    if (left != -1) {
        intervals.push([left, length - 1]);
    }
    return intervals;
}

algComp.getValues = function (obj, x, y) {
    let index = 4 * (x + y * width);
    return [obj.data[index], obj.data[index + 1], obj.data[index + 2], obj.data[index + 3]];
}

algComp.canvasToMatrix = function () {
    let data = ctx.getImageData(0, 0, width, height);
    let matrix = [];
    for (let y = 0; y < height; y++) {
        matrix.push([]);
        for (let x = 0; x < width; x++) {
            let values = algComp.getValues(data, x, y);
            if (values[0] === 0 && values[1] === 0 && values[2] === 0 && values[3] === 0) {
                matrix[y].push(0);
            } else {
                matrix[y].push(1);
            }
        }
    }
    return matrix;
}

algComp.displayLine = function (p1, p2) {
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = "lightgray";
    ctx.lineWidth = algComp.lineWidth;
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
}

algComp.displayGrid = function () {
    // draw cols and rows on canvas using the drawLine function
    for (let i = 0; i < algComp.numOfCols + 1; i++) {
        algComp.displayLine([width / algComp.numOfCols * i, 0], [width / algComp.numOfCols * i, height]);
    }

    for (let i = 0; i < algComp.numOfRows + 1; i++) {
        algComp.displayLine([0, height / algComp.numOfRows * i], [width, height / algComp.numOfRows * i]);
    }
}

algComp.generateRandomColor = function () {
    // easier to generate through rgb than hex
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
}

algComp.generateAnalogousColors = function (baseHue, count) {
    const colors = [];
    // randomize degree of separation
    const step = algComp.ranGenNum(15, 30);
    for (let i = 0; i < count; i++) {
        const hue = (baseHue + i * step) % 360;
        colors.push(`hsl(${hue}, 100%, 50%)`);
    }
    return colors;
}

algComp.generateShadesAndTints = function (baseHue, count) {
    let colors = [];
    for (let i = 0; i < count; i++) {
        let lightness = 50 + i * 10; // adjust lightness for shade
        let saturation = 70 - i * 10; // adjust saturation for tint
        colors.push(`hsl(${baseHue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
}

algComp.generateMonochromaticColors = function (baseHue, count) {
    let colors = [];
    const saturationStep = algComp.ranGenNum(5, 20); // step for saturation change
    const baseSaturation = algComp.ranGenNum(50, 70); // base saturation percentage

    for (let i = 0; i < count; i++) {
        let saturation = (baseSaturation + saturationStep * i) % 100;
        colors.push(`hsl(${baseHue}, ${saturation}%, 50%)`);
    }
    return colors;
}

// This function records a line on the recordCanvas. The algorithm can only record
// horizontal or vertical lines. For a more general algorithm, see Bresenham's line algorithm.
algComp.recordLine = function(origin, dest) {
    let x0 = origin[0];
    let y0 = origin[1];
    let x1 = dest[0];
    let y1 = dest[1];
    let halfWidth = Math.floor(algComp.lineWidth / 2);

    if (y0 === y1) { // Horizontal line
        let start = Math.min(x0, x1);
        let end = Math.max(x0, x1);
        for (let x = start; x <= end; x++) {
            for (let dy = -halfWidth; dy <= halfWidth; dy++) {
                if (y0 + dy >= 0 && y0 + dy < height && x >= 0 && x < width) {
                    algComp.recordCanvas[y0 + dy][x] = 1;
                }
            }
        }
        // Adjust the end pixels to create half-squares
        for (let dy = -halfWidth; dy <= 0; dy++) {
            if (y0 + dy >= 0 && y0 + dy < height) {
                if (start - 1 >= 0) {
                    algComp.recordCanvas[y0 + dy][start - 1] = 1;
                }
                if (end + 1 < width) {
                    algComp.recordCanvas[y0 + dy][end + 1] = 1;
                }
            }
        }
    } else if (x0 === x1) { // Vertical line
        let start = Math.min(y0, y1);
        let end = Math.max(y0, y1);
        for (let y = start; y <= end; y++) {
            for (let dx = -halfWidth; dx <= halfWidth; dx++) {
                if (x0 + dx >= 0 && x0 + dx < width && y >= 0 && y < height) {
                    algComp.recordCanvas[y][x0 + dx] = 1;
                }
            }
        }
        // Adjust the end pixels to create half-squares
        for (let dx = -halfWidth; dx <= 0; dx++) {
            if (x0 + dx >= 0 && x0 + dx < width) {
                if (start - 1 >= 0) {
                    algComp.recordCanvas[start - 1][x0 + dx] = 1;
                }
                if (end + 1 < height) {
                    algComp.recordCanvas[end + 1][x0 + dx] = 1;
                }
            }
        }
    }
};


/********* Randomize Options **********/
algComp.ranOpOnlyLines = function () {
    algComp.onlyLines = true;
    algComp.colorByPixel = false;
    // strict grid
    algComp.strictGrid = Math.random() < 0.5;
    if (!algComp.strictGrid) {
        // offset
        algComp.decideOffset(0.6, [0.4, 0.4], [0.8, 0.8],
            [5, 10], [50, 70]);
        // diff line same group
        algComp.diffLineSameGroup = Math.random() < 0.6;
        // reach to border
        algComp.reachToBorder = Math.random() < 0.4;
    }
    // whitespace
    algComp.decideWhiteSpace(0.5 + algComp.strictGrid ? 0.2 : 0,
        [0.2, 0.6], [0.1, 0.9]);
    // less white color
    algComp.lessWhite = Math.random() < 0.8;
    algComp.lessWhiteProb = algComp.ranGenProb(0.4, 0.8);
}

algComp.ranOpStrictGrid = function () {
    algComp.strictGrid = true;
    algComp.onlyLines = false;
    algComp.colorByPixel = false;
    // whitespace
    algComp.decideWhiteSpace(0.7,
        [0.2, 0.6], [0.1, 0.9]);
    // less white color
    algComp.lessWhite = Math.random() < 0.8;
    algComp.lessWhiteProb = algComp.ranGenProb(0.4, 0.8);
}

algComp.ranOpNonStrictGrid = function () {
    algComp.strictGrid = false;
    algComp.onlyLines = false;
    algComp.colorByPixel = true;
    // offset
    algComp.decideOffset(0.6, [0.4, 0.4], [0.8, 0.8],
        [5, 10], [50, 70]);
    // diff line same group
    algComp.diffLineSameGroup = Math.random() < 0.6;
    // reach to border
    algComp.reachToBorder = Math.random() < 0.3;
    // whitespace
    algComp.decideWhiteSpace(0.4,
        [0.2, 0.6], [0.1, 0.9]);
    // less white color
    algComp.lessWhite = Math.random() < 0.8;
    algComp.lessWhiteProb = algComp.ranGenProb(0.4, 0.8);
}

algComp.decideWhiteSpace = function (prob, minRange, maxRange) {
    if (Math.random() > prob) {
        algComp.biggerWhiteSpace = true;
        let min = algComp.ranGenProb(minRange[0], minRange[1]);
        let max = algComp.ranGenProb(Math.max(min, maxRange[0]), maxRange[1]);
        algComp.whiteSpaceProb = algComp.ranGenProb(min, max);
        algComp.whiteSpaceMaxProb = max;
    }
}

algComp.decideLineLength = function (minRange, maxRange) {
    let min = algComp.ranGenProb(minRange[0], minRange[1]);
    let max = algComp.ranGenProb(Math.max(min, maxRange[0]), maxRange[1]);
    algComp.lengthProb = algComp.ranGenProb(min, max);
    algComp.lengthMaxProb = max;
}

algComp.decideOffset = function (prob, minRange, maxRange, minNumRange, maxNumRange) {
    if (Math.random() > prob) {
        algComp.createOffset = true;
        let min = algComp.ranGenProb(minRange[0], minRange[1]);
        let max = algComp.ranGenProb(Math.max(min, maxRange[0]), maxRange[1]);
        algComp.offsetProb = algComp.ranGenProb(min, max);
        // offset size
        let minNum = algComp.ranGenNum(minNumRange[0], minNumRange[1]);
        let maxNum = algComp.ranGenNum(Math.max(minNum, maxNumRange[0]), maxNumRange[1]);
        algComp.offsetSize = algComp.ranGenNum(minNum, maxNum);
        algComp.minOffsetSize = minNum;
    }
}
