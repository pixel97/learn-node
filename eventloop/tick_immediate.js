let count = 0;
setImmediate(() => {
    console.log(`Run Immediately = ${count}`)
});

setImmediate(() => {
    count++;
    console.log(`nextTick = ${count}`)
});
console.log(`main = ${count}`);