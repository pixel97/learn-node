const args = process.argv;
if (args.length > 0) {
    //args.forEach((v, i) => console.log(`${v}`));
    for(let i = 2; i < args.length; i++){
        console.log(args[i]);
    }
}
else {
    console.log('Args not found');
}
