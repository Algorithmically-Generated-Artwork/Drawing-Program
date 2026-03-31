const algTartan = (() => {
    let intervalId = 0;
    let numberOfSteps = 0;
    let rng;
    let sett;
    let threads;

    const OFFSET_MULTIPLIER = Object.freeze([-1, 0, 1, 2]);

    function Sett(mode, stripes) {
        const fullStripes = [];
        let index = 0;

        const parsedStripes = parse(stripes);

        switch (mode) {
            case 'symmetric': {
                fullStripes.push(...parsedStripes);
                for (let i = parsedStripes.length - 2; i > 0; i--) {
                    fullStripes.push(parsedStripes[i]);
                }

                break;
            }

            case 'asymmetric': {
                fullStripes.push(...parsedStripes);
                break;
            }
        }

        function parse(settString) {
            // Mapping for single character color codes (Scottish Register of Tartans standard)
            const colorMap = {
                'K': '#000000', // Black
                'R': '#FF0000', // Red
                'G': '#00FF00', // Green
                'B': '#0000FF', // Blue
                'Y': '#FFFF00', // Yellow
                'W': '#FFFFFF', // White
                'N': '#808080', // Grey (Neutral)
                'P': '#800080', // Purple
                'O': '#FFA500', // Orange
                'T': '#D2691E', // Brown (Tan)
                'LB': '#ADD8E6', // Light Blue
                'LR': '#FF6B6B', // Light Red
                'LG': '#90EE90', // Light Green
                'LP': '#DDA0DD', // Light Purple
                'LN': '#D3D3D3', // Light Grey
                'LT': '#F4A460', // Light Brown
            };

            // X11 color names to hex (add more as needed)
            const x11Colors = {
                'black': '#000000',
                'red': '#FF0000',
                'green': '#00FF00',
                'blue': '#0000FF',
                'yellow': '#FFFF00',
                'white': '#FFFFFF',
                'grey': '#808080',
                'gray': '#808080',
                'purple': '#800080',
                'orange': '#FFA500',
                'brown': '#A52A2A',
                'pink': '#FFC0CB',
                'cyan': '#00FFFF',
                'magenta': '#FF00FF',
            };

            const stripes = [];

            // Pattern 1: Single character codes (e.g., "K4 R24")
            const singleCharPattern = /([A-Z]{1,2})(\d+)/g;

            // Pattern 2: X11 color names (e.g., "Black4 Red24")
            const x11Pattern = /([A-Za-z]+)(\d+)/g;

            // Pattern 3: Hex codes (e.g., "#000000#4" or "#FF0000#24")
            const hexPattern = /(#[0-9A-Fa-f]{6})#(\d+)/g;

            let match;

            // Try hex pattern first (most specific)
            if (settString.includes('#')) {
                while ((match = hexPattern.exec(settString)) !== null) {
                    stripes.push({
                        color: match[1].toUpperCase(),
                        width: parseInt(match[2], 10)
                    });
                }
            }
            // Try single character pattern
            else if (/^[A-Z\s\d]+$/.test(settString)) {
                while ((match = singleCharPattern.exec(settString)) !== null) {
                    const colorCode = match[1];
                    const color = colorMap[colorCode];

                    if (color) {
                        stripes.push({
                            color: color,
                            width: parseInt(match[2], 10)
                        });
                    }
                }
            }
            // Try X11 color names
            else {
                while ((match = x11Pattern.exec(settString)) !== null) {
                    const colorName = match[1].toLowerCase();
                    const color = x11Colors[colorName];

                    if (color) {
                        stripes.push({
                            color: color,
                            width: parseInt(match[2], 10)
                        });
                    }
                }
            }

            return stripes;
        }

        function nextStripe() {
            const stripe = fullStripes[index % fullStripes.length];
            index++;

            return stripe;
        }

        return { nextStripe, reset: () => { index = 0; } };
    }

    function Thread(stripe, position, weaveType, offset) {
        let drawnLength = offset;
        let isOver = true;

        function draw(length) {
            if (isComplete()) return;

            switch (weaveType) {
                case 'warp': {
                    ctx.fillStyle = stripe.color;
                    ctx.fillRect(
                        position,
                        drawnLength,
                        algTartan.threadWeight,
                        length
                    );

                    drawnLength += length;
                    break;
                }

                case 'weft': {
                    // Weave the thread over and under the warp threads
                    let remainingLength = length;
                    const stepLength = algTartan.threadWeight * 2;
                    while (remainingLength > 0) {
                        if (isOver) {
                            ctx.fillStyle = stripe.color;
                            ctx.fillRect(
                                drawnLength,
                                position,
                                stepLength,
                                algTartan.threadWeight
                            );
                        }

                        isOver = !isOver;
                        drawnLength += stepLength;
                        remainingLength -= stepLength;
                    }

                    break;
                }
            }
        }

        function isComplete() {
            switch (weaveType) {
                case 'warp':
                    return drawnLength >= height;

                case 'weft':
                    return drawnLength >= width;
            }
        }

        return { draw, isComplete };
    }

    function drawOneStep() {
        if (numberOfSteps >= algTartan.maxNumberOfSteps) {
            pause();
            return;
        }

        const incompleteWarpThreads = threads.warp.filter(thread => !thread.isComplete());
        if (incompleteWarpThreads.length > 0) {
            for (let i = 0; i < rng.int(incompleteWarpThreads.length / algTartan.step, incompleteWarpThreads.length); i++) {
                const threadIndex = Math.floor(rng.int(0, incompleteWarpThreads.length - 1));
                const thread = incompleteWarpThreads[threadIndex];

                thread.draw(rng.int(1, algTartan.step));
                numberOfSteps++;
            }

            return;
        }

        const incompleteWeftThreads = threads.weft.filter(thread => !thread.isComplete());
        if (incompleteWeftThreads.length > 0) {
            for (let i = 0; i < rng.int(incompleteWeftThreads.length / algTartan.step, incompleteWeftThreads.length); i++) {
                const threadIndex = Math.floor(rng.int(0, incompleteWeftThreads.length - 1));
                const thread = incompleteWeftThreads[threadIndex];

                thread.draw(rng.int(1, algTartan.step));
                numberOfSteps++;
            }

            return;
        }

        pause();
    }

    function start() {
        intervalId = setInterval(drawOneStep, algTartan.speed);
    };

    function pause() {
        clearInterval(intervalId);
    };

    function reset() {
        pause();

        numberOfSteps = 0;
        rng = random(algTartan.seed);


        const settType = algTartan.symmetricSett ? 'symmetric' : 'asymmetric';
        sett = new Sett(settType, algTartan.sett);
        threads = {
            warp: [],
            weft: [],
        };

        let x = 0;
        while (x < width) {
            const stripe = sett.nextStripe();
            const warpThreads = Array.from({ length: stripe.width }, (_, index) => Thread(stripe, x + (index * algTartan.threadWeight), 'warp', 0));

            threads.warp.push(...warpThreads);
            x += stripe.width * algTartan.threadWeight;
        }

        sett.reset();

        let y = 0;
        while (y < height) {
            const stripe = sett.nextStripe();
            const weftThreads = Array.from({ length: stripe.width }, (_, index) => Thread(stripe, y + (index * algTartan.threadWeight), 'weft', algTartan.threadWeight * OFFSET_MULTIPLIER[index % OFFSET_MULTIPLIER.length]));

            threads.weft.push(...weftThreads);
            y += stripe.width * algTartan.threadWeight;
        }
    };

    function initialize() {
        reset();
    };

    return {
        start,
        pause,
        reset,
        initialize,
    };
})();