import mergeSort from '../../utils/merge-sorter';

describe('Merge sorter', () => {
  test('can sort arrays of numbers in ASC order', () => {
    expect(mergeSort([0, 5, -10, 2, 99, 100, 23, 15, -3]))
      .toEqual([-10, -3, 0, 2, 5, 15, 23, 99, 100]);
  });

  test('can sort arrays of strings in ASC order', () => {
    expect(mergeSort(['x', 'a', 'c', 'b', 'f', 'z']))
      .toEqual(['a', 'b', 'c', 'f', 'x', 'z']);
  });
});
