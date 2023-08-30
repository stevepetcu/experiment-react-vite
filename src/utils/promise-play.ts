// Do promises block the main thread? Does await do that?

/**
 * Seems like this one does not block the main thread, despite some articles saying the opposite.
 */
function promise() {
  console.log('a');
  (new Promise(resolve => {
    console.log('Start promise.');
    setTimeout(() => resolve('bruh'), 3000);
    console.log('End promise');
    return;
  })).then((res) => {
      console.log('b');
      console.log(res);
    }
  );
  console.log('c');
}

/**
 * This one does block the main thread.
 */
async function awaitPromise() {
  console.log('a');
  await (new Promise(resolve => {
    console.log('Start promise.');
    setTimeout(() => resolve('bruv'), 3000);
    console.log('End promise');
    return;
  }));
  console.log('b');
  console.log('c');
}
