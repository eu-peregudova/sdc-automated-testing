import { DEFAULT_TAX_RATE, DEFAULT_DISCOUNT_RATE } from './constants.js';

export function calculateTotal(items, options = {}) {
  if (!Array.isArray(items)) {
    throw new TypeError('Items must be an array');
  }

  const { discountRate = DEFAULT_DISCOUNT_RATE, taxRate = DEFAULT_TAX_RATE } = options;

  if (discountRate < 0 || discountRate > 1) {
    throw new RangeError('Discount rate must be between 0 and 1');
  }

  if (taxRate < 0) {
    throw new RangeError('Tax rate cannot be negative');
  }

  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    if (price < 0 || quantity < 0) {
      throw new Error('Price and quantity must be non-negative');
    }
    return sum + (price * quantity);
  }, 0);

  const discounted = subtotal * (1 - discountRate);
  const totalWithTax = discounted * (1 + taxRate);

  return Math.round(totalWithTax * 100) / 100;
}