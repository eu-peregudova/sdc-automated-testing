# sdc-automated-testing

JavaScript project for exploring unit testing capabilities. It provides a function `calculateTotal` for calculating a shopping cart total with configurable discounts and tax. The calculation is implemented as an ES module and is covered by Mocha and Chai tests.

## Requirements

- Node.js 22.21 or newer
- npm

## Getting started

Install the project dependencies:

```bash
npm install
```

Run the tests:

```bash
npm test
```

## Function description

### Input parameters

```js
calculateTotal(items, options)
```

- `items` (`Array`): the cart contents. Each item may provide:
  - `price` (`number` or numeric string): unit price.
  - `quantity` (`number` or numeric string): number of units.
- `options` (`Object`, optional):
  - `discountRate` (`number`, optional): discount as a decimal fraction from `0` through `1`; defaults to `0`.
  - `taxRate` (`number`, optional): tax as a decimal fraction; defaults to `0.2` and may be any non-negative value.

### Expected output

The function returns a `number` representing the final cart total, rounded to two decimal places:

```text
round((sum(price × quantity) × (1 − discountRate) × (1 + taxRate)), 2)
```

For example, a cart with a subtotal of `200`, the default tax rate, and no discount returns `240`.

### Business rules

- The cart must be an array.
- Prices and quantities must not be negative.
- Missing or non-numeric price and quantity values contribute `0`.
- Discounts must be between `0` and `1`, inclusive.
- Tax cannot be negative; tax rates above `1` are allowed.
- The empty cart produces a total of `0`.
- Invalid cart types raise `TypeError`; invalid discount or tax ranges raise `RangeError`; negative item values raise `Error`.

## Test scenarios

The tests are in `test/main.test.js` and cover the following categories:

- **Positive tests:** calculate a total using default tax, calculate a total with both discount and tax, and calculate totals for multiple valid tax rates.
- **Negative tests:** reject a non-array cart, negative prices, negative quantities, discounts below `0` or above `1`, and negative tax rates.
- **Boundary tests:** verify an empty cart, zero-valued items, a `0` discount, a `1` (100%) discount, a `0` tax rate, and the exact supported discount limits.
- **Robustness tests:** treat missing or malformed item properties as zero so the result does not become `NaN`.

## Defaults and validation

The default values are defined in `src/constants.js`:

- `DEFAULT_DISCOUNT_RATE`: `0` (no discount)
- `DEFAULT_TAX_RATE`: `0.2` (20% tax)

The function:

- Throws a `TypeError` when the cart is not an array.
- Throws a `RangeError` when the discount is outside the inclusive `0`–`1` range.
- Throws a `RangeError` when the tax rate is negative.
- Throws an `Error` when an item has a negative price or quantity.
- Treats missing or non-numeric `price` and `quantity` values as `0`.
- Supports tax rates greater than `1` (for example, `1` represents 100% tax).
