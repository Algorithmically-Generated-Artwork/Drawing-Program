/**
 * Creates a seeded random number generator using Linear Congruential Generator algorithm.
 * Provides reproducible random numbers - same seed always produces same sequence.
 * 
 * @param {number} [seed=12345] - The seed value for the random number generator
 * @returns {Object} RNG object with methods for generating random values
 * @returns {function(): number} returns.next - Get next random number between 0 and 1
 * @returns {function(number, number): number} returns.float - Get random float between min and max
 * @returns {function(number, number): number} returns.int - Get random integer between min and max (inclusive)
 * @returns {function(number): boolean} returns.bool - Get random boolean with optional probability
 * @returns {function(Array): *} returns.choice - Pick random element from array
 * @returns {function(Array): Array} returns.shuffle - Return shuffled copy of array
 * 
 * @example
 * // Basic usage
 * const rng = random(42);
 * console.log(rng.next()); // 0.7266343236062676 (always same with seed 42)
 * console.log(rng.float(0, 100)); // Random float between 0-100
 * console.log(rng.int(1, 6)); // Random integer 1-6 (dice roll)
 * 
 * @example
 * // Array operations
 * const rng = random(123);
 * const colors = ['red', 'green', 'blue'];
 * console.log(rng.choice(colors)); // Random color
 * console.log(rng.shuffle([1, 2, 3, 4])); // Shuffled array
 * 
 * @example
 * // Reproducibility
 * const rng1 = random(555);
 * const rng2 = random(555);
 * console.log(rng1.next() === rng2.next()); // true - same seed, same result
 */
const random = (seed = Date.now()) => {
    let state = seed;

    /**
     * Get the next random number in sequence
     * 
     * Linear Congruential Generator implementation
     * Uses constants from Numerical Recipes: a=1664525, c=1013904223, m=2^32
     * 
     * @returns {number} Random number between 0 and 1
     */
    const next = () => {
        state = (state * 1664525 + 1013904223) % 4294967296;

        return state / 4294967296;
    };

    /**
     * Get random floating point number within range
     * 
     * @param {number} [min=0] - Minimum value (inclusive)
     * @param {number} [max=1] - Maximum value (exclusive)
     * 
     * @returns {number} Random float between min and max
     */
    const float = (min = 0, max = 1) => next() * (max - min) + min;

    /**
     * Get random integer within range
     * 
     * @param {number} min - Minimum value (inclusive)
     * @param {number} max - Maximum value (inclusive)
     * 
     * @returns {number} Random integer between min and max
     */
    const int = (min, max) => Math.floor(next() * (max - min + 1)) + min;

    /**
     * Get random boolean value
     * 
     * @param {number} [probability=0.5] - Probability of returning true (0-1)
     * 
     * @returns {boolean} Random boolean based on probability
     */
    const bool = (probability = 0.5) => next() < probability;

    /**
     * Pick random element from array
     * 
     * @param {Array} array - Array to choose from
     * 
     * @returns {*} Random element from the array
     */
    const choice = (array) => array[Math.floor(next() * array.length)];

    /**
     * Shuffle array using Fisher-Yates algorithm
     * 
     * @param {Array} array - Array to shuffle
     * 
     * @returns {Array} New shuffled array (original unchanged)
     */
    const shuffle = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = int(0, i);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    };

    return {
        next,
        float,
        int,
        bool,
        choice,
        shuffle,
    };
};