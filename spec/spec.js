import mutate from '../src/main.js';

jasmine.CATCH_EXCEPTIONS = false;

describe('Deep Mutation', () => it('should work', () => {
  let testObj = {
    int: 1,
    subfield: {
      list: [1, {b: 2}],
      num: 100
    }
  };
  mutate({path: ['int'], operation: '+', operand: 1}, testObj);
  expect(testObj.int).toBe(2);
  mutate({path: 'subfield.list', operation: 'push', operand: 3}, testObj);
  expect(testObj.subfield.list[2]).toEqual(3);
}));

