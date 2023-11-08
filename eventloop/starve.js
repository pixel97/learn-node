
const cb = () => {
    // do Something
    setImmediate(cb);
};

setTimeout(() => console.log('setTimeout executed'), 5);

setImmediate(cb);

console.log('Start');
