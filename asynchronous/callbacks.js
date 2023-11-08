let k = [];

function someAsyncOperation() {
  // Return a new promise that resolves after the setTimeout callback has been executed
  return new Promise((resolve) => {
    setTimeout(function() {
      k = k.concat([1,2,3]);
      resolve(k); // Resolve the promise with the updated array
    }, 0);
  });
};


someAsyncOperation().then((updatedArray) => {
  let sum = 0;
  updatedArray.forEach((item) => {
    sum = sum + item;
  });
  console.log(sum);
});
