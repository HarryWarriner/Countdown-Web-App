import { expect } from 'chai';
import { getRandomSmall, getRandomBig, getAimNum, performOperation, calculateScore } from '../logic.js';

describe('Game Logic', () => {

    it('getRandomSmall returns a number between 1 and 10', () => {
        for (let i = 0; i < 100; i++) {
            const num = getRandomSmall();
            expect(num).to.be.within(1, 10);
        }
    });

    it('getRandomBig returns one of 25, 50, 75, or 100', () => {
        const values = new Set([25, 50, 75, 100]);
        for (let i = 0; i < 100; i++) {
            expect(values.has(getRandomBig())).to.be.true;
        }
    });

    it('performOperation returns correct result or null', () => {
        expect(performOperation(5, 3, '+')).to.equal(8);
        expect(performOperation(10, 3, '-')).to.equal(7);
        expect(performOperation(4, 2, 'x')).to.equal(8);
        expect(performOperation(6, 2, '/')).to.equal(3);
        expect(performOperation(6, 4, '/')).to.equal(null); // not divisible
    });

    it('calculateScore returns correct score', () => {
        expect(calculateScore(500, 500)).to.equal(10);
        expect(calculateScore(493, 500)).to.equal(7);
        expect(calculateScore(480, 500)).to.equal(0);
    });
});
