const random = (() => {
    const float = (n = 1) => n * Math.random()

    const int = (n = 1) => Math.floor(float(n));

    const boolean = () => Math.random() < 0.5;

    const color = () => `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, "0")}`;

    return {
        float,
        int,
        boolean,
        color,
    };
})();

const algAntFarm = (() => {
    let intervalId;
    let numberOfSteps = 0;
    let panicSpeedMultiplier = 1;
    let ants = [];
    let panicId;

    const Ant = ({ point, color: c } = {}) => {
        const color = c ?? random.color();

        if (!point) {
            const x = random.int(width);
            const y = random.int(height);

            point = { x, y };
        }

        const move = () => {
            const start = { ...point };
            const s = algAntFarm.antSpeed * panicSpeedMultiplier;

            point.x += (random.boolean() ? 1 : -1) * random.int(s);
            point.y += (random.boolean() ? 1 : -1) * random.int(s);

            if (point.x > width) {
                point.x = width;
            } else if (point.x < 0) {
                point.x = 0;
            }

            if (point.y > height) {
                point.y = height;
            } else if (point.y < 0) {
                point.y = 0;
            }

            ctx.lineWidth = algAntFarm.lineWidth;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        };

        return {
            move,
        };
    };

    const createAnts = (n) => Array.from({ length: n }, () => Ant());

    const drawOneStep = () => {
        if (numberOfSteps > algAntFarm.maxNumberOfSteps) {
            pause();

            return false;
        }

        if (algAntFarm.numberOfAnts > ants.length) {
            ants = ants.concat(createAnts(algAntFarm.numberOfAnts - ants.length));
        } else if (algAntFarm.numberOfAnts < ants.length) {
            ants = ants.slice(0, algAntFarm.numberOfAnts);
        }

        ants.forEach(ant => ant.move());
        numberOfSteps += 1;

        intervalId = setTimeout(drawOneStep, algAntFarm.speed);
    };

    const handlePanic = () => {
        panicSpeedMultiplier = panicSpeedMultiplier + random.float(algAntFarm.maxPanicSpeedMultiplier - panicSpeedMultiplier);
        clearInterval(panicId);

        panicId = setInterval(() => {
            const n = panicSpeedMultiplier - random.float();
            if (n < 1) {
                panicSpeedMultiplier = 1;
                clearInterval(panicId)
            } else {
                panicSpeedMultiplier = n;
            }
        }, 1000);
    };

    const start = () => {
        c.addEventListener('dblclick', handlePanic);
        intervalId = setTimeout(drawOneStep, algAntFarm.speed);
    };

    const pause = () => {
        clearInterval(intervalId);
        c.removeEventListener('dblclick', handlePanic);
    };

    const reset = () => {
        pause();

        numberOfSteps = 0;
        ants = createAnts(algAntFarm.numberOfAnts);
    };

    const initialize = () => {
        reset();
    };

    return {
        start,
        pause,
        reset,
        initialize,
    };
})();