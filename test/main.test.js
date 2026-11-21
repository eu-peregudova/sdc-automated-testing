import { expect } from 'chai';
import { calculateTotal } from '../src/main.js';
import { DEFAULT_TAX_RATE } from '../src/constants.js';

describe('calculateTotal function', () => {
  let standardCart;

  beforeEach(() => {
    standardCart = [
      { price: 50, quantity: 2 },
      { price: 25, quantity: 4 }
    ];

    standardCart.total = standardCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  afterEach(() => {
    standardCart = null;
  });

  describe('should calculate total correctly with correct inputs', () => {
    it('should calculate the total correctly with default tax and no discount', () => {
      const result = calculateTotal(standardCart);
      const expectedSubtotal = standardCart.total * (1 + DEFAULT_TAX_RATE);

      expect(result).to.equal(expectedSubtotal);
    });

    it('should apply discount and tax correctly', () => {
      const discountRate = 0.1;
      const taxRate = 0.3;
      
      const result = calculateTotal(standardCart, { discountRate, taxRate });
      const expectedTotal = standardCart.total * (1 - discountRate) * (1 + taxRate);

      expect(result).to.equal(Math.round(expectedTotal * 100) / 100);
    });
  });

  describe('should handle edge cases', () => {
    it('should correctly process lower boundaries (0 discount, 0 tax, empty cart)', () => {
      expect(calculateTotal([], { discountRate: 0, taxRate: 0 })).to.equal(0);
      expect(calculateTotal([{ price: 0, quantity: 0 }], { discountRate: 0, taxRate: 0 })).to.equal(0);
    });

    it('should accept exact upper and lower discount rate boundaries (0 and 1)', () => {
      expect(calculateTotal(standardCart, { discountRate: 1, taxRate: 0.2 })).to.equal(0);
      expect(calculateTotal(standardCart, { discountRate: 0, taxRate: 0.2 })).to.equal(240);
    });

    it('should reject discount rates outside boundaries (< 0 or > 1)', () => {
      expect(() => calculateTotal(standardCart, { discountRate: -0.01 })).to.throw(RangeError);
      expect(() => calculateTotal(standardCart, { discountRate: 1.01 })).to.throw(RangeError);
    });

    it('should reject negative tax rates', () => {
      expect(() => calculateTotal(standardCart, { taxRate: -0.1 })).to.throw(RangeError);
    });
  });

  describe('should throw appropriate errors for invalid inputs', () => {
    it('should throw TypeError when items is not an array', () => {
      expect(() => calculateTotal(null)).to.throw(TypeError);
      expect(() => calculateTotal(undefined)).to.throw(TypeError);
      expect(() => calculateTotal('invalid-cart-string')).to.throw(TypeError);
    });

    it('should throw Error for negative prices or quantities', () => {
      expect(() => calculateTotal([{ price: -10, quantity: 2 }])).to.throw(Error);
      expect(() => calculateTotal([{ price: 10, quantity: -2 }])).to.throw(Error);
    });

    it('should handle missing or malformed item properties without NaN', () => {
      const malformedCart = [{ price: 'invalid', quantity: 2 }, {}];
      const result = calculateTotal(malformedCart);

      expect(result).to.equal(0);
    });
  });

  describe('should handle various tax scenarios', () => {
    const taxScenarios = [
      { taxRate: 0.0, expected: 200 },
      { taxRate: 0.1, expected: 220 },
      { taxRate: 0.25, expected: 250 },
      { taxRate: 0.5, expected: 300 },
      { taxRate: 1.0, expected: 400 },
      { taxRate: 2.0, expected: 600 }
    ];

    taxScenarios.forEach(({ taxRate, expected }) => {
      it(`test tax rate ${taxRate * 100}% yielding expected total ${expected}`, () => {
        const result = calculateTotal([{ price: 100, quantity: 2 }], { taxRate });
        expect(result).to.equal(expected);
      });
    });
  });
});