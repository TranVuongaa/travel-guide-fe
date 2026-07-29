import '@testing-library/jest-dom/vitest';

const emptyClientRectList = {
  length: 0,
  item: () => null,
  [Symbol.iterator]: function* iterateClientRects() {
    return;
  },
} as DOMRectList;

if (!document.elementFromPoint) {
  Object.defineProperty(document, 'elementFromPoint', {
    configurable: true,
    value: () => document.body,
  });
}

if (!Range.prototype.getClientRects) {
  Object.defineProperty(Range.prototype, 'getClientRects', {
    configurable: true,
    value: () => emptyClientRectList,
  });
}

if (!Range.prototype.getBoundingClientRect) {
  Object.defineProperty(Range.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: () => new DOMRect(),
  });
}
