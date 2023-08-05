export default function mergeSort<T>(arr: T[]): T[] {
  if (arr.length < 2) {
    return arr;
  }

  const middle = Math.ceil(arr.length / 2);

  const leftSide = arr.slice(0, middle);
  const rightSide = arr.slice(middle, arr.length);

  return merge(mergeSort(leftSide), mergeSort(rightSide));
}

function merge<T>(left: T[], right: T[]): T[] {
  let leftIndex = 0, rightIndex = 0;
  const result: T[] = [];

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  if (leftIndex < left.length) {
    return result.concat(left.slice(leftIndex, left.length));
  } else {
    return result.concat(right.slice(rightIndex, right.length));
  }
}
