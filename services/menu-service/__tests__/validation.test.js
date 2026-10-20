const { validateRating } = require('../src/server');

test('should accept valid rating of 2', () => {
  const result = validateRating(2);
  expect(result.valid).toBe(true);
});